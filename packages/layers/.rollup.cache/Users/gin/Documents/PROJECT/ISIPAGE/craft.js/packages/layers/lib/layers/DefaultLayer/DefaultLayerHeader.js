import { useEditor } from '@craftjs/core';
import React from 'react';
import { styled } from 'styled-components';
import { EditableLayerName } from './EditableLayerName';
import Arrow from './svg/arrow.svg';
import Eye from './svg/eye.svg';
import Grip from './svg/grip.svg';
import Linked from './svg/linked.svg';
import { useLayerTheme } from '../ThemeContext';
import { useLayer } from '../useLayer';
const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  background: ${(props) =>
    props.$selected ? props.$theme.bgSelected : 'transparent'};
  color: ${(props) =>
    props.$selected ? props.$theme.textSelected : props.$theme.textPrimary};
  svg {
    fill: ${(props) =>
      props.$selected ? props.$theme.iconSelected : props.$theme.iconPrimary};
    margin-top: 2px;
  }
  .inner {
    flex: 1;
    > div {
      padding: 0px;
      flex: 1;
      display: flex;
      margin-left: ${(props) => Math.min(props.$depth * 8, 40)}px;
      align-items: center;
      div.layer-name {
        flex: 1;
        h2 {
          font-size: 15px;
          line-height: 26px;
        }
      }
    }
  }
`;
const Expand = styled.a`
  width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  transform: rotate(${(props) => (props.$expanded ? 180 : 0)}deg);
  opacity: 0.7;
  cursor: pointer;
`;
const Hide = styled.a`
  width: 14px;
  height: 14px;
  margin-right: 10px;
  position: relative;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: ${(props) => (props.$isHidden ? 0.2 : 1)};
  }
  &:after {
    content: ' ';
    width: 2px;
    height: ${(props) => (props.$isHidden ? 100 : 0)}%;
    position: absolute;
    left: 2px;
    top: 3px;
    background: ${(props) =>
      props.$selected ? props.$theme.iconSelected : props.$theme.iconPrimary};
    transform: rotate(-45deg);
    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: 0% 0%;
    opacity: ${(props) => (props.$isHidden ? 0.4 : 1)};
  }
`;
const TopLevelIndicator = styled.div`
  margin-left: -22px;
  margin-right: 10px;

  svg {
    width: 12px;
    height: 12px;
  }
`;
const DragHandle = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  margin-right: 4px;
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    cursor: grabbing;
    opacity: 1;
  }

  svg {
    width: 14px;
    height: 14px;
    pointer-events: none;
  }
`;
const ReorderButtons = styled.div`
  display: flex;
  gap: 2px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
`;
const ReorderButton = styled.button`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.3 : 0.6)};
  transition: opacity 0.2s ease;
  padding: 0;
  border-radius: 3px;

  &:hover {
    opacity: ${(props) => (props.$disabled ? 0.3 : 1)};
    background: ${(props) =>
      props.$disabled ? 'transparent' : props.$theme.bgHover};
  }

  svg {
    width: 12px;
    height: 12px;
    pointer-events: none;
  }
`;
export const DefaultLayerHeader = () => {
  const theme = useLayerTheme();
  const {
    id,
    depth,
    expanded,
    children,
    connectors: { drag, layerHeader },
    actions: { toggleLayer },
  } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });
  const {
    hidden,
    actions,
    selected,
    topLevel,
    parent,
    currentIndex,
    canMoveUp,
    canMoveDown,
  } = useEditor((state, query) => {
    // TODO: handle multiple selected elements
    const selected = query.getEvent('selected').first() === id;
    const node = state.nodes[id];
    const parent = node?.data?.parent ? state.nodes[node.data.parent] : null;
    const siblings = parent?.data?.nodes || [];
    const currentIndex = siblings.indexOf(id);
    return {
      hidden: node && node.data.hidden,
      selected,
      topLevel: query.node(id).isTopLevelCanvas(),
      parent,
      currentIndex,
      canMoveUp: currentIndex > 0,
      canMoveDown: currentIndex < siblings.length - 1 && currentIndex !== -1,
    };
  });
  const handleMoveUp = (e) => {
    e.stopPropagation();
    if (!canMoveUp || !parent) return;
    // Move to previous position
    actions.move(id, parent.id, currentIndex - 1);
  };
  const handleMoveDown = (e) => {
    e.stopPropagation();
    if (!canMoveDown || !parent) return;
    // When moving down, the node is removed first, so we need to add 2
    // to account for: current position removal + skip the next sibling
    actions.move(id, parent.id, currentIndex + 2);
  };
  const [isHovered, setIsHovered] = React.useState(false);
  return React.createElement(
    StyledDiv,
    {
      $selected: selected,
      $depth: depth,
      $theme: theme,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
    React.createElement(
      DragHandle,
      {
        ref: (dom) => {
          drag(dom);
        },
        $theme: theme,
      },
      React.createElement(Grip, null)
    ),
    React.createElement(
      Hide,
      {
        $selected: selected,
        $isHidden: hidden,
        $theme: theme,
        onClick: () => actions.setHidden(id, !hidden),
      },
      React.createElement(Eye, null)
    ),
    React.createElement(
      'div',
      { className: 'inner' },
      React.createElement(
        'div',
        {
          ref: (dom) => {
            layerHeader(dom);
          },
        },
        topLevel
          ? React.createElement(
              TopLevelIndicator,
              null,
              React.createElement(Linked, null)
            )
          : null,
        React.createElement(
          'div',
          { className: 'layer-name s' },
          React.createElement(EditableLayerName, null)
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
          !topLevel &&
            isHovered &&
            React.createElement(
              ReorderButtons,
              { $theme: theme, style: { opacity: isHovered ? 1 : 0 } },
              React.createElement(
                ReorderButton,
                {
                  $theme: theme,
                  $disabled: !canMoveUp,
                  onClick: handleMoveUp,
                  title: 'Move up',
                },
                React.createElement(
                  'svg',
                  { viewBox: '0 0 16 16', fill: 'currentColor' },
                  React.createElement('path', { d: 'M8 3l-5 5h10z' })
                )
              ),
              React.createElement(
                ReorderButton,
                {
                  $theme: theme,
                  $disabled: !canMoveDown,
                  onClick: handleMoveDown,
                  title: 'Move down',
                },
                React.createElement(
                  'svg',
                  { viewBox: '0 0 16 16', fill: 'currentColor' },
                  React.createElement('path', { d: 'M8 13l5-5H3z' })
                )
              )
            ),
          children && children.length
            ? React.createElement(
                Expand,
                { $expanded: expanded, onMouseDown: () => toggleLayer() },
                React.createElement(Arrow, null)
              )
            : null
        )
      )
    )
  );
};
//# sourceMappingURL=DefaultLayerHeader.js.map
