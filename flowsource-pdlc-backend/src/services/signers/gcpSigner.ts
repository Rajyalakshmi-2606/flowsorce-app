import { GoogleAuth } from 'google-auth-library';

export async function signGcpRequest(req: any, config: any) {
  const targetUrl = config.getString('proxyMulticloud.gcp.targetUrl') + req.originalUrl.replace('/proxy/gcp', '');
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const headers = await client.getRequestHeaders(targetUrl);

  return {
    url: targetUrl,
    method: req.method,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };
}
