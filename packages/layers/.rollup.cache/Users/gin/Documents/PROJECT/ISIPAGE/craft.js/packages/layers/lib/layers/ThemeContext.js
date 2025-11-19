import React, { createContext, useContext, useMemo } from 'react';
import { getTheme } from '../theme';
const ThemeContext = createContext(null);
export const ThemeProvider = ({ theme, themeMode, children, }) => {
    const value = useMemo(() => {
        // Use custom theme if provided, otherwise use themeMode
        const resolvedTheme = theme || getTheme(themeMode);
        return { theme: resolvedTheme };
    }, [theme, themeMode]);
    return (React.createElement(ThemeContext.Provider, { value: value }, children));
};
export const useLayerTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Return default light theme if no provider
        return getTheme('light');
    }
    return context.theme;
};
//# sourceMappingURL=ThemeContext.js.map