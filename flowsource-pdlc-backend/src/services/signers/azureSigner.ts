import { DefaultAzureCredential } from '@azure/identity';
import xss from 'xss';

let token: any = null;
async function getRefreshedToken(credential: any) {
  if (!token || Date.now() > (token.expiresOnTimestamp - 2 * 60 * 1000)) {
    // Refresh if not cached or expiring within 2 minutes
    token = await credential.getToken("https://management.azure.com/.default");
  }
  return token.token;
}

export async function signAzureRequest(req: any, config: any, logger: any) {

  const targetUrl = config.targetUrl;
  const clientID = config.clientID;
  const apiKey = config.apiKey; 
  const credential = new DefaultAzureCredential({
    managedIdentityClientId: clientID
  });

  const token = await getRefreshedToken(credential);
  const jsonPayload = req.body;
  const formData = new FormData();

  for (const key in jsonPayload) {
    if (jsonPayload.hasOwnProperty(key)) {
      formData.append(key, xss(jsonPayload[key]));
    }
  }
  try {
    const azureResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'x-api-key': apiKey,
      },
      body: formData,
    });


    const contentType = azureResponse.headers.get('content-type');
    let responseBody: any;

    if (contentType && contentType.includes('text/event-stream')) {

      const responseText = await azureResponse.text(); // from fetch

      // Extract JSON array portion
      const start = responseText.indexOf("[");
      const end = responseText.lastIndexOf("]");
      if (start === -1 || end === -1 || end <= start) {
        throw new Error("No valid JSON array found.");
      }

      let jsonPart = responseText.substring(start, end + 1);

      // Clean control characters
      jsonPart = jsonPart
        .replace(/[\u0000-\u001F]+/g, " ") // remove control characters
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

      let combinedText = "";

      try {
        const parsed = JSON.parse(jsonPart);
        parsed.forEach((entry: Record<string, string>) => {
          for (const [, content] of Object.entries(entry)) {
            combinedText += `${content}\n\n${"-".repeat(80)}\n\n`;
          }
        });
        responseBody = combinedText;
      } catch (err) {
        logger.error("Failed to parse JSON:", err);
        logger.error("Raw JSON part:", jsonPart);
        throw err;
      }
    }

    else if (contentType && contentType.includes('application/json')) {
      try {
        const json = await azureResponse.json();
        responseBody = json;
      } catch (error) {
        logger.error("JSON parsing failed");
        throw error;
      }
    } else {
      const text = await azureResponse.text();
      responseBody = text;
    }

    return {
      statusCode: azureResponse.status,
      body: JSON.stringify([{ response: responseBody }])
    };
  } catch (error: any) {
    logger.error("Azure API call failed: " + error.message);
    logger.error("Error stack: " + error.stack);
    throw error;
  }
}

