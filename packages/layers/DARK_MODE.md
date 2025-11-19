# Dark Mode Support for Craft.js Layers

The `@craftjs/layers` package now supports dark mode! You can customize the appearance of the layers panel to match your application's theme.

## Features

- 🎨 **Built-in themes**: Light and dark themes included
- 🔧 **Custom themes**: Create your own theme configuration
- 🚀 **Easy to use**: Simple API with backwards compatibility
- 📱 **Responsive**: Works seamlessly with your existing setup

## Quick Start

### Using Built-in Dark Mode

```tsx
import { Layers } from '@craftjs/layers';

function MyApp() {
  return (
    <Editor>
      {/* Enable dark mode */}
      <Layers themeMode="dark" />
    </Editor>
  );
}
```

### Using Built-in Light Mode (Default)

```tsx
import { Layers } from '@craftjs/layers';

function MyApp() {
  return (
    <Editor>
      {/* Light mode is default, no need to specify */}
      <Layers />

      {/* Or explicitly set to light */}
      <Layers themeMode="light" />
    </Editor>
  );
}
```

## Custom Themes

Create your own custom theme to match your brand:

```tsx
import { Layers, LayersTheme } from '@craftjs/layers';

const myCustomTheme: LayersTheme = {
  // Background colors
  bgBase: 'transparent',
  bgHover: '#3a3a3a',
  bgSelected: '#007acc',
  bgCanvas: 'rgba(255, 255, 255, 0.05)',

  // Text colors
  textPrimary: '#ffffff',
  textSelected: '#ffffff',

  // Icon colors
  iconPrimary: '#cccccc',
  iconSelected: '#ffffff',

  // Border and shadow
  borderColor: '#ffffff15',
  shadowColor: '#00000050',
};

function MyApp() {
  return (
    <Editor>
      <Layers theme={myCustomTheme} />
    </Editor>
  );
}
```

## Dynamic Theme Switching

Switch between themes based on user preference or system settings:

```tsx
import { Layers } from '@craftjs/layers';
import { useState, useEffect } from 'react';

function MyApp() {
  const [isDark, setIsDark] = useState(false);

  // Listen to system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <Editor>
      <Layers themeMode={isDark ? 'dark' : 'light'} />
    </Editor>
  );
}
```

## Theme Structure

The `LayersTheme` interface defines all themeable properties:

```typescript
interface LayersTheme {
  // Background colors
  bgBase: string;        // Base layer background
  bgHover: string;       // Hover state background
  bgSelected: string;    // Selected layer background
  bgCanvas: string;      // Canvas/container background

  // Text colors
  textPrimary: string;   // Primary text color
  textSelected: string;  // Selected layer text color

  // Icon colors
  iconPrimary: string;   // Icon fill color
  iconSelected: string;  // Selected layer icon color

  // Border and shadow
  borderColor: string;   // Border line color
  shadowColor: string;   // Shadow color for canvas containers
}
```

## Built-in Themes

### Light Theme (Default)

```typescript
{
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
}
```

### Dark Theme

```typescript
{
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
}
```

## Advanced Usage

### Accessing Built-in Themes

You can import and extend built-in themes:

```tsx
import { Layers, lightTheme, darkTheme, LayersTheme } from '@craftjs/layers';

// Extend dark theme with custom selection color
const myTheme: LayersTheme = {
  ...darkTheme,
  bgSelected: '#ff6b6b',
};

function MyApp() {
  return (
    <Editor>
      <Layers theme={myTheme} />
    </Editor>
  );
}
```

### Using Theme Helper

```tsx
import { Layers, getTheme } from '@craftjs/layers';

function MyApp({ isDarkMode }) {
  return (
    <Editor>
      <Layers theme={getTheme(isDarkMode ? 'dark' : 'light')} />
    </Editor>
  );
}
```

## Integration with Chakra UI

Example integration with Chakra UI's color mode:

```tsx
import { Layers } from '@craftjs/layers';
import { useColorMode } from '@chakra-ui/react';

function MyApp() {
  const { colorMode } = useColorMode();

  return (
    <Editor>
      <Layers themeMode={colorMode === 'dark' ? 'dark' : 'light'} />
    </Editor>
  );
}
```

## Migration Guide

### From Previous Version

If you're upgrading from a previous version, **no changes are required**. The layers component defaults to light mode if no theme options are provided.

```tsx
// This still works exactly the same
<Layers />

// Now you can add dark mode support
<Layers themeMode="dark" />
```

## API Reference

### Layers Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `themeMode` | `'light' \| 'dark'` | `'light'` | Use built-in light or dark theme |
| `theme` | `LayersTheme` | `undefined` | Custom theme object (overrides `themeMode`) |
| `expandRootOnLoad` | `boolean` | `true` | Expand root layer on load |
| `renderLayer` | `React.ElementType` | `DefaultLayer` | Custom layer component |

### Exports

```typescript
// Components
export { Layers, DefaultLayer, DefaultLayerHeader, EditableLayerName };

// Hooks
export { useLayer };

// Theme utilities
export type { LayersTheme };
export { lightTheme, darkTheme, getTheme };
```

## Examples

### Full Example with Toggle

```tsx
import { Editor, Frame, Element } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import { useState } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Editor>
          <Frame>
            <Element is="div" canvas>
              {/* Your components */}
            </Element>
          </Frame>
        </Editor>
      </div>

      <div style={{ width: 300, borderLeft: '1px solid #ccc' }}>
        <button onClick={() => setIsDark(!isDark)}>
          Toggle Theme
        </button>

        <Editor>
          <Layers themeMode={isDark ? 'dark' : 'light'} />
        </Editor>
      </div>
    </div>
  );
}
```

## Troubleshooting

### Theme not applying

Make sure you're passing the prop to `<Layers>` component, not `<Editor>`:

```tsx
// ❌ Wrong
<Editor theme={darkTheme}>
  <Layers />
</Editor>

// ✅ Correct
<Editor>
  <Layers theme={darkTheme} />
</Editor>
```

### Custom theme not working

Ensure your custom theme implements all required properties from `LayersTheme` interface:

```tsx
import { LayersTheme } from '@craftjs/layers';

// TypeScript will enforce all required properties
const myTheme: LayersTheme = {
  // ... all properties required
};
```

## Contributing

Found a bug or want to add a theme? Contributions are welcome! Please open an issue or PR on the [GitHub repository](https://github.com/prevwong/craft.js).

## License

MIT
