import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { flowsourcePdlcPlugin, FlowsourcePdlcPage } from '../src/plugin';

createDevApp()
  .registerPlugin(flowsourcePdlcPlugin)
  .addPage({
    element: <FlowsourcePdlcPage />,
    title: 'Root Page',
    path: '/flowsource-pdlc',
  })
  .render();
