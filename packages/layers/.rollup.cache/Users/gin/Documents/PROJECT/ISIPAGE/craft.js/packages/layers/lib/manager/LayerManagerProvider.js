import { useMethods } from '@craftjs/utils';
import React from 'react';
import { LayerMethods } from './actions';
import { LayerManagerContext } from './context';
import { LayerEventContextProvider } from '../events';
import { DefaultLayer } from '../layers';
import { ThemeProvider } from '../layers/ThemeContext';
export const LayerManagerProvider = ({ children, options }) => {
  // TODO: fix type
  const store = useMethods(LayerMethods, {
    layers: {},
    events: {
      selected: null,
      dragged: null,
      hovered: null,
    },
    options: {
      renderLayer: DefaultLayer,
      ...options,
    },
  });
  return React.createElement(
    LayerManagerContext.Provider,
    { value: { store } },
    React.createElement(
      ThemeProvider,
      { theme: options.theme, themeMode: options.themeMode },
      React.createElement(LayerEventContextProvider, null, children)
    )
  );
};
//# sourceMappingURL=LayerManagerProvider.js.map
