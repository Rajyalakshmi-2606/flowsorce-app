import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const flowsourcePdlcPlugin = createPlugin({
  id: 'flowsource-pdlc',
  routes: {
    root: rootRouteRef,
  },

});


export const FlowsourcePdlcPage = flowsourcePdlcPlugin.provide(
  createRoutableExtension({
    name: 'FlowsourcePdlcPage',
    component: () =>
      import('./components/PdlcComponent').then(m => m.PdlcComponent),
    mountPoint: rootRouteRef,
  }),
);
