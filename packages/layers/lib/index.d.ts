import React from 'react';
import { LayerOptions } from './interfaces';
export { useLayer, DefaultLayer, DefaultLayerHeader, EditableLayerName, } from './layers';
export type { LayersTheme } from './theme';
export { lightTheme, darkTheme, getTheme } from './theme';
type LayersProps = Partial<LayerOptions>;
export declare const Layers: ({ ...options }: LayersProps) => React.JSX.Element;
