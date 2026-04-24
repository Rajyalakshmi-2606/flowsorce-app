# flowsource-pdlc-backend

Welcome to the flowsource-pdlc-backend plugin!

This plugin enables the **Agents** feature in Flowsource, acting as a conversational chatbot interface. Users can interact with the agent by entering prompts or questions in the UI. These prompts are securely sent to an API gateway, where the agent processes the request and returns a response, which is then displayed in the chat interface.

## Authentication

 For AWS, ensure your Kubernetes service account associated with the Flowsource deployment is annotated with the required IAM role, for example:

  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: <your-existing-service-account>
    annotations:
  ```
 For Azure, ensure your Kubernetes service account associated with the Flowsource deployment is annotated with the required Azure role or managed identity, for example:

  ```yaml
  apiVersion: v1
  kind: ServiceAccount
  metadata:
    name: <your-existing-service-account>
    annotations:
  ```

## What does flowsource-pdlc-backend do?

- Exposes secure backend endpoints for PDLC operations
- Handles cloud API signing for AWS and Azure
- Integrates with the Flowsource frontend to provide a unified product delivery experience


## How to use in a Backstage backend

### 1. Add the plugin dependency
   In `packages/backend/package.json`, add:
   ```json
   "@flowsource/plugin-flowsource-pdlc-backend": "^1.0.0"
   ```

### 2. Register the plugin in your backend
   In `packages/backend/src/index.ts`, add:
   ```typescript
   backend.add(import('@flowsource/plugin-flowsource-pdlc-backend'));
   ```

### 3. Configure AWS endpoint in `app-config.yaml`
   Add the following section (edit values as needed):
   ```yaml
   pdlc:
     cloudProvider: aws
     aws:
       region: "region-1"
       apiId: "app1"
       stage: "dev"
     azure:
       targetUrl: "http://targetUrl"
       clientID: "clientId"
       apiKey: "appKey"
   ```

## Authorization

Authorization type to be set: `AWS_IAM`

### API Gateway Resource Policy Example
This is an example of an **API Gateway resource policy**. 

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEKSIRSAOnly",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::aws-account-id:role/eks-cluster-role-name"
      },
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:region:aws-account-id:api-id/stage/*/*"
    }
  ]
}
```
