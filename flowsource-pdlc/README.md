# flowsource-pdlc

Welcome to the flowsource-pdlc plugin!

This plugin enables the **Agents** feature in Flowsource, acting as a conversational chatbot interface. Users can interact with the agent by entering prompts or questions in the UI. These prompts are securely sent to an API gateway, where the agent processes the request and returns a response, which is then displayed in the chat interface.


## User Experience & UI Overview

When you use the Agents feature in Flowsource, the UI provides:

- **Conversational Chat Interface**: A chat window where you can type prompts or questions to the agent.
- **Prompt Submission**: Enter your request and submit; the plugin sends it to the backend API gateway.
- **Agent Responses**: The agent processes your prompt and returns a response, which is displayed in the chat window.
- **Chat History**: View previous prompts and responses for context and continuity.
- **Cloud Awareness**: The agent can answer or perform actions related to AWS, Azure, and GCP, depending on your prompt.

This conversational UI is designed for simplicity and productivity, allowing you to:
- Ask questions or give commands in natural language
- Receive instant, context-aware responses from the agent


## To use flowsource-pdlc plugin in a plain Backstage 

1. **Add the plugin dependency**
   In `packages/app/package.json`, add:
   ```json
   "@flowsource/plugin-flowsource-pdlc": "^1.0.0"
   ```

2. **Import and add the route**
   In `packages/app/src/App.tsx`, add:
   ```tsx
   import { FlowsourcePdlcPage } from '@flowsource/plugin-flowsource-pdlc';
   ...existing code...
   <Route path="/flowsource-pdlc" element={<FlowsourcePdlcPage />} />
   ```

3. **Add to the sidebar navigation**
   In `packages/app/src/components/Root/Root.tsx`, add:
   ```tsx
   import { PdlcPng } from '../../assets/icons/Pdlc';
   ...existing code...
   <SidebarItem icon={PdlcPng} to="flowsource-pdlc" text="Agents" />
   ```