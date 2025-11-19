// Light theme (default)
export const lightTheme = {
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
export const darkTheme = {
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
export const getTheme = (mode) => {
    return mode === 'dark' ? darkTheme : lightTheme;
};
//# sourceMappingURL=theme.js.map