// eslint-disable-next-line vue/prefer-import-from-vue
import { extend } from '@vue/shared';
import {
  CreateAppFunction, createRenderer, RootRenderFunction,
} from 'vue';

import { nodeOps, OlNode } from './nodeOps';
import { patchProp } from './patchProp';

const { render: baseRender, createApp: baseCreateApp } = createRenderer(
  // @ts-ignore
  extend({ patchProp }, nodeOps),
);

export const render = baseRender as RootRenderFunction<OlNode>;
export const createApp = baseCreateApp as CreateAppFunction<OlNode>;
