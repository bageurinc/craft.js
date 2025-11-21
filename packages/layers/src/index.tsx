import { ROOT_NODE } from '@craftjs/utils';
import React from 'react';

import { LayerOptions } from './interfaces';
import { LayerContextProvider } from './layers/LayerContextProvider';
import { LayerManagerProvider } from './manager/LayerManagerProvider';

export {
  useLayer,
  DefaultLayer,
  DefaultLayerHeader,
  EditableLayerName,
} from './layers';

export type { LayersTheme } from './theme';
export { lightTheme, darkTheme, getTheme } from './theme';

type LayersProps = Partial<LayerOptions>;

export const Layers = ({ ...options }: LayersProps) => {
  return (
    <div
      className="craft-layers-container"
      style={{ height: '100%', overflow: 'auto' }}
    >
      <LayerManagerProvider options={options}>
        <LayerContextProvider id={ROOT_NODE} depth={0} />
      </LayerManagerProvider>
    </div>
  );
};
