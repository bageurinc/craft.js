// Theme configuration for Craft.js Layers
export interface LayersTheme {
  // Background colors
  bgBase: string;
  bgHover: string;
  bgSelected: string;
  bgCanvas: string;

  // Text colors
  textPrimary: string;
  textSelected: string;

  // Icon colors
  iconPrimary: string;
  iconSelected: string;

  // Border and shadow
  borderColor: string;
  shadowColor: string;
}

// Light theme (default)
export const lightTheme: LayersTheme = {
  bgBase: 'transparent',
  bgHover: '#f1f1f1',
  bgSelected: '#2680eb',
  bgCanvas: 'rgba(255, 255, 255, 0.02)',

  textPrimary: 'inherit',
  textSelected: '#fff',

  iconPrimary: '#808184',
  iconSelected: '#fff',

  borderColor: '#00000012',
  shadowColor: '#00000014',
};

// Dark theme
export const darkTheme: LayersTheme = {
  bgBase: 'transparent',
  bgHover: '#2a2a2a',
  bgSelected: '#2680eb',
  bgCanvas: 'rgba(255, 255, 255, 0.05)',

  textPrimary: '#e0e0e0',
  textSelected: '#fff',

  iconPrimary: '#b0b0b0',
  iconSelected: '#fff',

  borderColor: '#ffffff12',
  shadowColor: '#00000040',
};

// Theme helper function
export const getTheme = (mode?: 'light' | 'dark'): LayersTheme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
