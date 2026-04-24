import fetch from 'node-fetch';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Sha256 } from '@aws-crypto/sha256-js';
import { fromTokenFile } from "@aws-sdk/credential-provider-web-identity";
import xss from 'xss'; 

export async function invokeAwsApi(req: any, region: string, apiId: string, stage: string, logger: any) {
  // Keep your web identity logic
  function getCredentialsProvider() {
    if (process.env.AWS_WEB_IDENTITY_TOKEN_FILE && process.env.AWS_ROLE_ARN) {
      logger.info("Using web identity credentials");
      return fromTokenFile({
        roleArn: process.env.AWS_ROLE_ARN,
        webIdentityTokenFile: process.env.AWS_WEB_IDENTITY_TOKEN_FILE,
      });
    } else {
      logger.info("Using default provider credentials");
      return defaultProvider();
    }
  }
  
  const credentialsProvider = getCredentialsProvider();
  const resolvedCredentials = await credentialsProvider();
  const signer = new SignatureV4({
    service: 'execute-api',
    region,
    credentials: resolvedCredentials,
    sha256: Sha256,
  });

  const hostname = `${apiId}.execute-api.${region}.amazonaws.com`;
  const path = `/${stage}`;
  const url = `https://${hostname}${path}`;

  let body;
  if (req.body) {
    // If body is a string, sanitize it directly
    if (typeof req.body === 'string') {
      body = xss(req.body);
    } else {
      body = xss(JSON.stringify(req.body));
    }
  } else {
    body = undefined;
  }
  
  // Only include essential headers for signing
  const headers: Record<string, string> = {
    'host': hostname,
    'content-type': 'application/json',
    'accept': 'application/json',
  };

  // Add content-length only if there's a body
  if (body) {
    headers['content-length'] = Buffer.byteLength(body).toString();
  }

  // Copy only specific, safe headers from the original request
  const allowedHeaders = ['accept-language', 'origin', 'accept-encoding'];
  Object.keys(req.headers || {}).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (allowedHeaders.includes(lowerKey) && req.headers[key]) {
      headers[lowerKey] = req.headers[key];
    }
  });


  const httpRequest = new HttpRequest({
    method: req.method,
    headers,
    hostname,
    path,
    protocol: 'https:',
    body: body,
  });

  try {
    const signedRequest = await signer.sign(httpRequest);

    // Create a clean headers object for the fetch call
    const fetchHeaders: Record<string, string> = {};
    Object.entries(signedRequest.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        fetchHeaders[key] = Array.isArray(value) ? value.join(', ') : value;
      }
    });

    const awsResponse = await fetch(url, {
      method: signedRequest.method,
      headers: fetchHeaders,
      body: signedRequest.body,
    });

    const contentType = awsResponse.headers.get('content-type');
    const responseText = await awsResponse.text();
    let data;
    if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        logger.error("JSON parsing failed: " + responseText);
        throw error;
      }
    } else {
      data = responseText;
    }
    return data;

  } catch (error: any) {
    logger.error("AWS API call failed: " + error.message);
    logger.error("Error stack: " + error.stack);
    throw error;
  }
}