import React, { createContext, useContext, useMemo } from 'react';

import { LayersTheme, getTheme } from '../theme';

interface ThemeContextValue {
  theme: LayersTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  theme?: LayersTheme;
  themeMode?: 'light' | 'dark';
  children: React.ReactNode;
}

export const ThemeProvider = ({
  theme,
  themeMode,
  children,
}: ThemeProviderProps) => {
  const value = useMemo<ThemeContextValue>(() => {
    // Use custom theme if provided, otherwise use themeMode
    const resolvedTheme = theme || getTheme(themeMode);
    return { theme: resolvedTheme };
  }, [theme, themeMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useLayerTheme = (): LayersTheme => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default light theme if no provider
    return getTheme('light');
  }
  return context.theme;
};
