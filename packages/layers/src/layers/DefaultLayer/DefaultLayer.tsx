import { useEditor } from '@craftjs/core';
import React from 'react';
import { styled } from 'styled-components';

import { DefaultLayerHeader } from './DefaultLayerHeader';

import { LayersTheme } from '../../theme';
import { useLayerTheme } from '../ThemeContext';
import { useLayer } from '../useLayer';

const LayerNodeDiv = styled.div<{
  $expanded: boolean;
  $hasCanvases: boolean;
  $hovered: boolean;
  $theme: LayersTheme;
}>`
  background: ${(props) =>
    props.$hovered ? props.$theme.bgHover : props.$theme.bgBase};
  display: block;
  padding-bottom: ${(props) =>
    props.$hasCanvases && props.$expanded ? 5 : 0}px;
`;

const LayerChildren = styled.div<{
  $hasCanvases: boolean;
  $theme: LayersTheme;
}>`
  margin: 0 0 0 ${(props) => (props.$hasCanvases ? 28 : 0)}px;
  background: ${(props) =>
    props.$hasCanvases ? props.$theme.bgCanvas : 'transparent'};
  position: relative;

  ${(props) =>
    props.$hasCanvases
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

export type DefaultLayerProps = {
  children?: React.ReactNode;
};

export const DefaultLayer = ({ children }: DefaultLayerProps) => {
  const theme = useLayerTheme();
  const {
    id,
    expanded,
    hovered,
    connectors: { layer },
  } = useLayer((layer) => ({
    hovered: layer.event.hovered,
    expanded: layer.expanded,
  }));
  const { hasChildCanvases } = useEditor((state, query) => {
    return {
      hasChildCanvases: query.node(id).isParentOfTopLevelNodes(),
    };
  });

  return (
    <LayerNodeDiv
      ref={(dom) => {
        layer(dom);
      }}
      $expanded={expanded}
      $hasCanvases={hasChildCanvases}
      $hovered={hovered}
      $theme={theme}
    >
      <DefaultLayerHeader />
      {children ? (
        <LayerChildren
          $hasCanvases={hasChildCanvases}
          $theme={theme}
          className="craft-layer-children"
        >
          {children}
        </LayerChildren>
      ) : null}
    </LayerNodeDiv>
  );
};
