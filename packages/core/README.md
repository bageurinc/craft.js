
<div align="center" style={{d}}>
<h1>craft.js</h1>
<a href="https://github.com/gin31259461/craft.js">
  <img src="https://img.shields.io/github/v/tag/gin31259461/craft.js?label=Version&style=for-the-badge&color=%232680eb">
</a>
<img src="https://img.shields.io/npm/l/@craftjs/core?color=%23000&style=for-the-badge">
<a href="https://github.com/gin31259461/craft.js/releases">
  <img src="https://img.shields.io/github/release-date/gin31259461/craft.js?label=Last%20Release&style=for-the-badge&color=%2300C853">
</a>
</div>

> **Note:** This is a forked and customized version of Craft.js for use in the isi-page project. For the original Craft.js, visit [prevwong/craft.js](https://github.com/prevwong/craft.js).

<div align="center" style={{d}}>
  <img src="https://user-images.githubusercontent.com/16416929/72202590-4d05f500-349c-11ea-9e43-1da1cb0c30e9.gif"/>
</div>

<p align="center">
  <strong>
    <a href="https://craft.js.org/">Live Demo</a>
  </strong>
</p>

Page editors are a great way to provide an excellent user experience. However, to build one is often a pretty dreadful task.

There're existing libraries that come with a fully working page editor out of the box with a user interface and editable components. However, if you wish to make customisations such as modifying the user interface and its behavior, it will most definitely involve modifying the library itself.

Craft.js solves this problem by modularising the building blocks of a page editor. It ships with a drag-n-drop system and handles the way user components should be rendered, updated and moved - among other things. With this, you'll be able to build your own page editor exactly how you want it to look and behave.

## Installation

### For isi-page-fe Project

Install directly from GitHub using the latest tagged version:

```bash
npm install github:gin31259461/craft.js#latest
```

Or install a specific version:

```bash
npm install github:gin31259461/craft.js#v1.0.0
```

### Using Automated Scripts

From the craft.js repository:

```bash
# Update isi-page-fe to latest version
./scripts/update-consumer.sh

# Or specify a tag
./scripts/update-consumer.sh v1.0.0

# Verify installation
./scripts/verify-install.sh
```

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

## Publishing New Versions

To create a new release:

```bash
# Create and push a new tag
./scripts/release.sh

# Or specify version
./scripts/release.sh 1.0.1 "Bug fixes and improvements"
```

See [PUBLISH-GUIDE.md](./PUBLISH-GUIDE.md) for complete publishing guidelines.

## Docs
- [Installation Guide](./INSTALLATION.md) - Complete installation and troubleshooting guide
- [Publishing Guide](./PUBLISH-GUIDE.md) - How to create releases and manage versions
- [Core concepts](https://craft.js.org/docs/concepts/nodes) - Original Craft.js documentation
- [Tutorial](https://craft.js.org/docs/guides/basic-tutorial) - Basic tutorial
- [API Reference](https://craft.js.org/docs/api/editor-state) - API documentation

## Examples
These examples should give you an idea on the flexibility of Craft.js.

Both these examples look very different from each other, with very different UI. But they are both built with Craft.js! 🤯

- [Landing](https://craft.js.org)
- [Basic](https://craft.js.org/examples/basic)


## Features :fire:
### It's just React
No need for complicated plugin systems. Design your editor from top to bottom the same way as you would design any other frontend application in React.

A simple user component can easily be defined as such:
```jsx
import { useNode } from "@craftjs/core";

const TextComponent = ({ text }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))}>
      <h2>{text}</h2>
    </div>
  );
};

```

Heck, the entire UI of your page editor is built using just React.
```jsx
import React from "react";
import { Editor, Frame, Element  } from "@craftjs/core";
const App = () => {
  return (
    <div>
      <header>Some fancy header or whatever</header>
      <Editor>
        // Editable area starts here
        <Frame resolver={{ TextComponent, Container }}>
          <Element canvas is={TextComponent} text="I'm already rendered here" />
        </Frame>
      </Editor>
    </div>
  );
};
```

### Control how your components are edited
An obvious requirement for page editors is that they need to allow users to edit components. With Craft.js, you control the process of which these components should be edited.

In the following example, when the user clicks on a component, we'll display a modal that requires the user to input a value for the `text` prop. As the input value changes, the component will be re-rendered with updated prop.

```jsx
import { useNode } from "@craftjs/core";

const TextComponent = ({ text }) => {
  const {
    connectors: { connect, drag },
    isClicked,
    actions: { setProp },
  } = useNode((state) => ({
    isClicked: state.events.selected,
  }));

  return (
    <div ref={(dom) => connect(drag(dom))}>
      <h2>{text}</h2>
      {isClicked ? (
        <Modal>
          <input
            type="text"
            value={text}
            onChange={(e) => setProp(e.target.value)}
          />
        </Modal>
      ) : null}
    </div>
  );
};
```
With this, you could easily implement content editable text or drag-to-resize components, just as any modern page editor would have.

### User components with droppable regions
Let's say we need a "Container" component which users can drop into the editor. Additionally, we would also like them to be able to drag and drop other components into the Container.

In Craft.js, it's as simple as calling the `<Canvas />`

```jsx
import {useNode} from "@craftjs/core";
const Container = () => {
  const { connectors: {drag} } = useNode();

  return (
    <div ref={drag}>
      <Canvas id="drop_section">
         // Now users will be able to drag/drop components into this section
        <TextComponent />
      </Canvas>
    </div>
  )
}
```

### Extensible
Craft.js provides an expressive API which allows you to easily read and manipulate the editor state. Let's say you would like to implement a copy function for a component:
```jsx
import {useEditor, useNode} from "@craftjs/core";
const Container = () => {
  const { actions: {add}, query: { createNode, node } } = useEditor();
  const { id, connectors: {drag, connect} } = useNode();
  return (
    <div ref={dom => connect(drag(dom))}>
      ...
      <a onClick={() => {
        const { data: {type, props}} = node(id).get();
        add(
          createNode(React.createElement(type, props));
        );
      }}>
        Make a copy of me
      </a>
    </div>
  )
}

```

### Serializable state
The editor's state can be serialized into JSON which you can then apply a compression technique of your choice for storage.

```jsx
const SaveButton = () => {
  const { query } = useEditor();
  return <a onClick={() => console.log(query.serialize()) }>Get JSON</a>
}
```

Of course, Craft.js will also able to recreate the entire state from the JSON string.
```jsx
const App = () => {
  const jsonString = /* retrieve JSON from server */
  return (
    <Editor>
      <Frame json={jsonString}>
        ...
      </Frame>
    </Editor>
  )
}
```

## Who is this for? 🤔
You should use this if:
- ✅ You want to design your page editor according to your own UI specifications. With Craft.js, you control almost every aspect of the look and feel of your page editor.
- ✅ You like the React ecosystem. Being a React framework, not only do you get to build your user interface declaratively, but you will also be able to extend upon thousands of existing React components for your page editor.
- ✅ You're the coolest kid in class 😎

You should not use this if:
- ❌ You need a page editor that works out of the box. Craft.js is an abstraction where you implement your own page editor upon. For example, it does not come with a ready-made user interface.
  - However, you could still consider using the [examples](https://github.com/prevwong/craft.js/tree/develop/examples) as a starting point.


## Additional Packages :tada:
- **[@craftjs/layers](https://github.com/prevwong/craft.js/tree/develop/packages/layers)** A Photoshop-like layers panel

## Acknowledgements :raised_hands:

- **[react-dnd](https://github.com/react-dnd/react-dnd)** The React drag-n-drop library.
Although it is not actually used here, many aspects of Craft.js are written with react-dnd as a reference along with some utilities and functions being borrowed.
- **[Grape.js](https://github.com/artf/grapesjs)** The HTML web builder framework. This has served as an inspiration for Craft.js. The element positioning logic used in Craft.js is borrowed from Grape.js
- **[use-methods](https://github.com/pelotom/use-methods)** A super handy hook when dealing with reducers. Craft.js uses a slightly modified version of `use-methods` to better fit our API.


## What's Different in This Fork?

This fork maintains the core functionality of Craft.js while adding improvements for the isi-page project:

- **Git-based Distribution**: Install directly from GitHub without npm publishing
- **Automated Scripts**: Helper scripts for release management and updates
- **Enhanced Documentation**: Complete installation and publishing guides
- **Custom Improvements**: Project-specific enhancements and bug fixes

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## Repository Structure

```
craft.js/
├── packages/
│   ├── core/              # @craftjs/core - Main library
│   ├── layers/            # @craftjs/layers - Layers panel
│   └── utils/             # @craftjs/utils - Shared utilities
├── scripts/
│   ├── release.sh         # Create and push git tags
│   ├── update-consumer.sh # Update isi-page-fe automatically
│   └── verify-install.sh  # Verify installation
├── INSTALLATION.md        # Complete installation guide
├── PUBLISH-GUIDE.md       # Publishing and release guide
└── CLAUDE.md             # Development documentation
```

## Getting Help :wave:

For this fork:
- Check [INSTALLATION.md](./INSTALLATION.md) for installation issues
- Check [PUBLISH-GUIDE.md](./PUBLISH-GUIDE.md) for release questions
- Open an issue on [GitHub](https://github.com/gin31259461/craft.js/issues)

For original Craft.js questions:
- Visit the [Discord](https://discord.gg/sPpF7fX) server
- Check the [official documentation](https://craft.js.org/)


## Sponsor :heart_decoration:

Craft.js is released under the [MIT license](https://github.com/prevwong/craft.js/blob/master/LICENSE) and is built with 100% love. If you found it useful and would like to ensure its continued development, please consider becoming a backer/sponsor or making a one-time donation via <a href="https://github.com/sponsors/prevwong" target="_blank">Github Sponsor</a>, <a href="https://opencollective.com/craftjs/contribute" target="_blank">Open Collective</a> or <a href="https://ko-fi.com/prevwong" target="_blank">Ko-fi</a>.


<img src="https://opencollective.com/craftjs/sponsors.svg?width=890">
<img src="https://opencollective.com/craftjs/backers.svg?width=890">

### Sponsors
- [eye-square](https://github.com/eye-square)
- [api4ui](https://github.com/api4ui)

### Backers
- [Tekeste Kidanu](https://opencollective.com/guest-1703f486)
- [CORS Digital](https://opencollective.com/cors-digital)
- [Mattermix](https://opencollective.com/mattermix)
- [muttenzer](https://github.com/muttenzer)
- [ITCuw](https://github.com/ITCuw)
- [Victor Vanegas](https://github.com/vicvans20)
- [Andreas Thoelke](https://github.com/andreasthoelke)
- [Saltcorn](https://github.com/saltcorn)
