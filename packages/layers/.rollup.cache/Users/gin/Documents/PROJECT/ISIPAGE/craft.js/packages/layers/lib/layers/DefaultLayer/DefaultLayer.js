import { useEditor } from '@craftjs/core';
import React from 'react';
import { styled } from 'styled-components';
import { DefaultLayerHeader } from './DefaultLayerHeader';
import { useLayerTheme } from '../ThemeContext';
import { useLayer } from '../useLayer';
const LayerNodeDiv = styled.div `
  background: ${(props) => props.$hovered ? props.$theme.bgHover : props.$theme.bgBase};
  display: block;
  padding-bottom: ${(props) => props.$hasCanvases && props.$expanded ? 5 : 0}px;
`;
const LayerChildren = styled.div `
  margin: 0 0 0 ${(props) => (props.$hasCanvases ? 35 : 0)}px;
  background: ${(props) => props.$hasCanvases ? props.$theme.bgCanvas : 'transparent'};
  position: relative;

  ${(props) => props.$hasCanvases
    ? `

  box-shadow: 0px 0px 44px -1px ${props.$theme.shadowColor};
  border-radius: 10px;
  margin-right: 5px;
  margin-bottom:5px;
  margin-top:5px;
  > * { overflow:hidden; }
    &:before {
      position:absolute;
      left:-19px;
      width: 2px;
      height:100%;
      content: " ";
      background:${props.$theme.borderColor};
    }
  `
    : ''}
`;
export const DefaultLayer = ({ children }) => {
    const theme = useLayerTheme();
    const { id, expanded, hovered, connectors: { layer }, } = useLayer((layer) => ({
        hovered: layer.event.hovered,
        expanded: layer.expanded,
    }));
    const { hasChildCanvases } = useEditor((state, query) => {
        return {
            hasChildCanvases: query.node(id).isParentOfTopLevelNodes(),
        };
    });
    return (React.createElement(LayerNodeDiv, { ref: (dom) => {
            layer(dom);
        }, "$expanded": expanded, "$hasCanvases": hasChildCanvases, "$hovered": hovered, "$theme": theme },
        React.createElement(DefaultLayerHeader, null),
        children ? (React.createElement(LayerChildren, { "$hasCanvases": hasChildCanvases, "$theme": theme, className: "craft-layer-children" }, children)) : null));
};
//# sourceMappingURL=DefaultLayer.js.map