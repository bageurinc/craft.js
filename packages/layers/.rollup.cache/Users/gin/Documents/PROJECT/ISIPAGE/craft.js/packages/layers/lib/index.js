import { ROOT_NODE } from '@craftjs/utils';
import React from 'react';
import { LayerContextProvider } from './layers/LayerContextProvider';
import { LayerManagerProvider } from './manager/LayerManagerProvider';
export {
  useLayer,
  DefaultLayer,
  DefaultLayerHeader,
  EditableLayerName,
} from './layers';
export { lightTheme, darkTheme, getTheme } from './theme';
export const Layers = ({ ...options }) => {
  return React.createElement(
    'div',
    {
      className: 'craft-layers-container',
      style: { height: '100%', overflow: 'auto' },
    },
    React.createElement(
      LayerManagerProvider,
      { options: options },
      React.createElement(LayerContextProvider, { id: ROOT_NODE, depth: 0 })
    )
  );
};
//# sourceMappingURL=index.js.map
