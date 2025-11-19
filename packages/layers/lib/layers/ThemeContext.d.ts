import React from 'react';
import { LayersTheme } from '../theme';
export interface ThemeProviderProps {
    theme?: LayersTheme;
    themeMode?: 'light' | 'dark';
    children: React.ReactNode;
}
export declare const ThemeProvider: ({ theme, themeMode, children, }: ThemeProviderProps) => React.JSX.Element;
export declare const useLayerTheme: () => LayersTheme;
