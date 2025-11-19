# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Craft.js** is a React framework for building extensible drag-and-drop page editors. It's a modular library that provides the building blocks (drag-n-drop system, component rendering, state management) without imposing specific UI constraints, allowing developers to build custom page editors.

This is a **monorepo** managed with **Lerna** and **Yarn workspaces**, containing multiple packages and examples.

## Repository Structure

```
craft.js/
├── packages/
│   ├── core/           # Main Craft.js library (@craftjs/core)
│   ├── layers/         # Photoshop-like layers panel (@craftjs/layers)
│   └── utils/          # Shared utilities (@craftjs/utils)
├── examples/
│   ├── basic/          # Basic page editor example
│   └── landing/        # Landing page editor example
├── site/               # Documentation site (Docusaurus)
├── scripts/            # Build and deployment scripts
└── cypress/            # E2E tests
```

## Development Commands

### Initial Setup

```bash
# Install dependencies (uses Yarn workspaces)
yarn install

# Clean all packages
yarn clean
```

### Development Workflow

```bash
# Start development mode for all packages (watch mode)
yarn dev

# Start documentation site
yarn dev:site

# Start both packages and site concurrently
yarn dev:all

# Development with Yalc (for testing in other projects)
yarn dev:yalc
```

### Building

```bash
# Build all packages (excludes site and examples)
yarn build

# Build everything including site and examples
yarn build:all
```

### Testing

```bash
# Run Jest unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run Cypress E2E tests
yarn cy:test

# Open Cypress interactive mode
yarn cy:open
```

### Code Quality

```bash
# Lint all TypeScript/JavaScript files
yarn lint

# Format code with Prettier
yarn prettier
```

### Publishing

```bash
# Create changeset (for versioning)
yarn changeset:version

# Publish to npm (runs build, lint, test first)
yarn publish
```

## Architecture

### Core Concepts

Craft.js uses a **Node-based architecture** where every component in the editor is represented as a Node:

- **Node**: The fundamental unit containing component data, DOM reference, event state, rules, and relationships
- **EditorState**: Global state containing all nodes, events (selected/dragged/hovered), and options
- **Store**: State management using a custom `useMethods` hook (inspired by use-methods library)
- **Query/Actions**: Read (query) and write (actions) operations on the editor state

### Key Packages

#### @craftjs/core

The main package with the following structure:

- **`editor/`** - Core state management
  - `store.tsx` - EditorState definition and store setup
  - `actions.ts` - State mutation methods (add/delete/move nodes, etc.)
  - `query.tsx` - State read methods (getNodes, serialize, etc.)
  - `Editor.tsx` - Top-level editor context provider

- **`nodes/`** - Node system
  - `Element.tsx` - Component for creating user components
  - `Canvas.tsx` - Component for droppable regions
  - `useInternalNode.ts` - Node-level hooks

- **`render/`** - Rendering system
  - `Frame.tsx` - Editable area container
  - `RenderNode.tsx` - Renders individual nodes

- **`events/`** - Drag-n-drop event handling
  - `CoreEventHandlers.ts` - Base event handler class
  - `DefaultEventHandlers.ts` - Default drag/drop implementation
  - `findPosition.ts` - Drop position calculation
  - `movePlaceholder.ts` - Visual indicator logic

- **`hooks/`** - Public API hooks
  - `useEditor.tsx` - Access editor state/actions
  - `useNode.ts` - Access node state/connectors

- **`interfaces/`** - TypeScript types
  - `nodes.ts` - Node, NodeData, NodeRules types
  - `editor.ts` - EditorState, Options types
  - `events.ts` - Event-related types

#### @craftjs/layers

Provides a Photoshop-like layers panel UI component. Separate package for modularity.

#### @craftjs/utils

Shared utilities including the custom `useMethods` hook (modified version from use-methods library).

### Build System

- **TypeScript**: Transpilation via `tsc` (declaration files only in dev)
- **Rollup**: Bundles source into ESM and CJS formats
- **Babel**: Transpilation with presets for browser compatibility
- **Build script**: `scripts/build.sh` runs both `tsc` (declarations) and `rollup` (bundles)
- **Watch mode**: Development builds run with `-w` flag for hot reloading

Output structure per package:
```
dist/
  esm/index.js      # ES modules
  cjs/index.js      # CommonJS
lib/
  *.d.ts            # TypeScript declarations
```

### State Management Pattern

Uses a **custom reducer pattern** via `useMethods`:

1. **ActionMethods** define state mutations (in `actions.ts`)
2. **QueryMethods** define read-only operations (in `query.tsx`)
3. **Store** combines both with history support (undo/redo)
4. **History normalization** ensures consistency on undo/redo (removes events for deleted nodes)
5. **Ignore list** for actions that shouldn't trigger history entries (e.g., `setDOM`, `selectNode`)

### Component Registration

User components use a static `craft` property for configuration:

```typescript
const MyComponent = ({ text }) => { /* ... */ };

MyComponent.craft = {
  displayName: 'My Component',
  props: { text: 'default' },       // Default props
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  related: {
    toolbar: MyComponentToolbar      // Related components (settings panel, etc.)
  }
};
```

Components are registered via the `resolver` prop on `<Editor>`:

```jsx
<Editor resolver={{ MyComponent, AnotherComponent }}>
  <Frame>...</Frame>
</Editor>
```

### Serialization

The editor state can be serialized to JSON:

- **Serialize**: `query.serialize()` converts nodes to plain objects (replaces React types with string names)
- **Deserialize**: `<Frame json={jsonString}>` recreates state from JSON
- **Node hydration**: Timestamps track when nodes are recreated

### Event System

Drag-and-drop events flow through:

1. **CoreEventHandlers** - Abstract base class defining event lifecycle
2. **DefaultEventHandlers** - Concrete implementation with drag/drop logic
3. **Event listeners** - Attached via `connectors` from `useNode()`
4. **Placement calculation** - `findPosition()` determines valid drop locations
5. **Visual indicators** - `RenderEditorIndicator` shows drop zones

Customizable via `options.handlers` prop on `<Editor>`.

## TypeScript Configuration

- **Root**: `tsconfig.json` extends `tsconfig.base.json`
- **Base**: Loose mode (`strict: false`), JSX as React, ESNext target
- **Path aliases**: `@craftjs/core`, `@craftjs/layers`, `@craftjs/utils` map to package sources
- **Jest**: Separate `tsconfig.jest.json` for test configuration
- **Per-package**: Each package has its own `tsconfig.json`

## Testing

- **Unit tests**: Jest with ts-jest, React Testing Library
- **E2E tests**: Cypress
- **Test location**: `packages/**/?(*.)test.ts(x)`
- **Setup**: `jest/setup.js` configures test environment
- **Coverage**: No specific coverage thresholds configured

## Common Workflows

### Adding a New Package

1. Create directory in `packages/`
2. Add `package.json` with scripts: `start`, `build`, `clean`
3. Add `tsconfig.json` extending root config
4. Add to root `tsconfig.json` paths
5. Lerna will auto-detect via workspaces

### Making Changes

1. Run `yarn dev` for watch mode
2. Make changes in `packages/*/src/`
3. Tests auto-run on pre-push (via Husky)
4. Lint runs on pre-commit (via lint-staged)

### Creating a Release

1. Make changes and commit
2. Run `yarn changeset` (via `@changesets/cli`)
3. Document changes in generated changeset file
4. On merge to main, changesets will create version PR
5. Merge version PR to trigger publish workflow

### Testing in External Projects

Use Yalc for local testing without publishing:

```bash
# In craft.js repo
yarn dev:yalc

# In your project
yalc add @craftjs/core
```

## Important Implementation Details

### Node Identity

- Each node has a unique `id` (string, generated via nanoid)
- `ROOT_NODE` constant from `@craftjs/utils` is the root node ID
- Nodes maintain parent-child relationships via `parent` and `nodes` fields
- **LinkedNodes** allow named children (e.g., header/footer sections)

### Canvas vs Element

- `<Element>` - Creates a regular node (draggable component)
- `<Canvas>` - Creates a node that accepts drops (container)
- Both use the same underlying `NodeElement` component
- `is` prop specifies the React component to render
- `canvas` prop marks a node as droppable

### Connectors

Nodes expose **connectors** via `useNode()` hook:

- `connect(dom)` - Register DOM element for event handling
- `drag(dom)` - Enable dragging
- `Usage: ref={ref => connect(drag(ref))}`

### Query Methods

Queries are **pure functions** that don't mutate state:

- `getNodes()` - Get all nodes
- `node(id)` - Get specific node helper
- `serialize()` - Export to JSON
- `createNode()` - Create node definition (doesn't add to state)

### Action Methods

Actions **mutate state** and support undo/redo:

- `addNodeTree()` - Add nodes to tree
- `delete(id)` - Remove node
- `move(id, parentId, index)` - Reposition node
- `setProp(id, cb)` - Update node props
- `setOptions()` - Update editor options

### Performance Considerations

- Component re-renders minimized via selector functions in hooks
- `useNode((node) => ({ ...selected state }))` pattern for granular updates
- DOM references stored in nodes to avoid lookups
- History normalized on undo/redo to clean up orphaned events

## Dependencies

### External Dependencies

- **react** (peer dependency) - Supports React 16.8+ through 19
- **lodash** - Utility functions
- **debounce** - Debouncing helpers
- **tiny-invariant** - Assertions

### Dev Dependencies

- **Lerna** - Monorepo management
- **Rollup** - Module bundler
- **TypeScript** - Type system
- **Jest** - Unit testing
- **Cypress** - E2E testing
- **Changesets** - Version management
- **ESLint/Prettier** - Code quality

## Documentation

- **Live demo**: https://craft.js.org/
- **Docs**: https://craft.js.org/docs/concepts/nodes
- **Examples**: See `examples/` directory for working implementations
