import express from 'express';
import { LoggerService, RootConfigService } from '@backstage/backend-plugin-api';
import { invokeAwsApi } from './services/signers/awsInvoke';
import { signAzureRequest } from './services/signers/azureSigner';
import { signGcpRequest } from './services/signers/gcpSigner';

export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
}

export async function createRouter(options: RouterOptions): Promise<express.Router> {
  const { logger, config } = options;
  const router = express.Router();
  router.use(express.json());

  const pdlcConfig = config.getConfig('pdlc');
  const cloudProvider = pdlcConfig.getOptionalString('cloudProvider')?.toLowerCase().trim();

  if (!cloudProvider) {
    logger.error('PDLC plugin misconfigured: Missing cloudProvider');
    router.use((_req, res) => {
      res.status(503).send({
        success: false,
        error: 'Missing cloudProvider. Please ask your administrator to configure the PDLC plugin.',
      });
    });
    return router;
  }

  logger.info(`PDLC cloudProvider: ${cloudProvider}`);

  let isValidConfig = false;
  let errorDetails: string[] = [];

  if (cloudProvider === 'aws') {
    const awsConfig = pdlcConfig.getOptionalConfig('aws');
    const region = awsConfig?.getOptionalString('region') ?? '';
    const apiId = awsConfig?.getOptionalString('apiId') ?? '';
    const stage = awsConfig?.getOptionalString('stage') ?? '';

    if (!region || !apiId || !stage) {
      errorDetails.push(`Missing AWS config: ${[
        !region && 'region',
        !apiId && 'apiId',
        !stage && 'stage',
      ]
        .filter(Boolean)
        .join(', ')}`);
    } else {
      isValidConfig = true;
    }

  } else if (cloudProvider === 'azure') {
    const azureConfig = pdlcConfig.getOptionalConfig('azure');
    const targetUrl = azureConfig?.getOptionalString('targetUrl') ?? '';
    const clientID = azureConfig?.getOptionalString('clientID') ?? '';
    const apiKey = azureConfig?.getOptionalString('apiKey') ?? '';

    if (!targetUrl || !clientID || !apiKey) {
      errorDetails.push(`Missing Azure config: ${[
        !targetUrl && 'targetUrl',
        !clientID && 'clientID',
        !apiKey && 'apiKey',
      ]
        .filter(Boolean)
        .join(', ')}`);
    } else {
      isValidConfig = true;
    }

  } else if (cloudProvider === 'gcp') {
    const gcpConfig = pdlcConfig.getOptionalConfig('gcp');
    const targetUrl = gcpConfig?.getOptionalString('targetUrl') ?? '';

    if (!targetUrl) {
      errorDetails.push('Missing GCP config: targetUrl');
    } else {
      isValidConfig = true;
    }

  } else {
    logger.error(`Unsupported cloudProvider: ${cloudProvider}`);
    router.use((_req, res) => {
      res.status(503).send({
        success: false,
        error: `Unsupported cloudProvider: ${cloudProvider}`,
      });
    });
    return router;
  }

  if (!isValidConfig) {
    logger.error(`PDLC plugin misconfigured: ${errorDetails.join('; ')}`);
    router.use((_req, res) => {
      res.status(503).send({
        success: false,
        error: 'PDLC plugin misconfigured',
        details: errorDetails,
      });
    });
    return router;
  }

  // Health check
  router.get('/health', (_req, res) => {
    logger.info('PDLC backend health check');
    res.json({ status: 'ok' });
  });

  // Main handler
  router.post('/pdlc', async (req, res) => {
    try {
      if (cloudProvider === 'aws') {
        const awsConfig = pdlcConfig.getConfig('aws');
        const region = awsConfig.getString('region');
        const apiId = awsConfig.getString('apiId');
        const stage = awsConfig.getString('stage');

        const awsResponse = await invokeAwsApi(req, region, apiId, stage, logger);
        return res.json(awsResponse);

      } else if (cloudProvider === 'azure') {
        const azureConfig = pdlcConfig.getConfig('azure');
        const targetUrl = azureConfig.getString('targetUrl');
        const clientID = azureConfig.getString('clientID');
        const apiKey = azureConfig.getString('apiKey');

        const result = await signAzureRequest(req, { targetUrl, clientID, apiKey }, logger);
        return res.json(result);

      } else if (cloudProvider === 'gcp') {
        const gcpConfig = pdlcConfig.getConfig('gcp');
        const targetUrl = gcpConfig.getString('targetUrl');

        const result = await signGcpRequest(req, targetUrl);
        return res.json(result);
      }

      return res.status(503).json({ success: false, error: 'PDLC plugin not configured.' });

    } catch (error: any) {
      logger.error(`PDLC handler error: ${error}`);
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}
