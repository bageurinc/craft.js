import { useEditor } from '@craftjs/core';
import React, { useMemo } from 'react';
import { styled, keyframes } from 'styled-components';

import { useLayerManager } from '../manager/useLayerManager';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const StyledIndicator = styled.div<{ $error?: boolean }>`
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  box-shadow: ${(props) =>
    props.$error
      ? '0 0 8px rgba(239, 68, 68, 0.6)'
      : '0 0 8px rgba(59, 130, 246, 0.6)'};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

type RenderLayerIndicatorProps = {
  children?: React.ReactNode;
};

export const RenderLayerIndicator = ({
  children,
}: RenderLayerIndicatorProps) => {
  const { layers, events } = useLayerManager((state) => state);
  const { query } = useEditor((state) => ({ enabled: state.options.enabled }));
  const { indicator: indicatorStyles } = query.getOptions();

  const indicatorPosition = useMemo(() => {
    const { indicator } = events;

    if (indicator) {
      const {
        placement: { where, parent, currentNode },
        error,
      } = indicator;
      const layerId = currentNode ? currentNode.id : parent.id;

      let top;
      const color = error ? indicatorStyles.error : indicatorStyles.success;

      if (indicator.onCanvas && layers[parent.id].dom != null) {
        const parentPos = layers[parent.id].dom.getBoundingClientRect();
        const parentHeadingPos = layers[
          parent.id
        ].headingDom.getBoundingClientRect();
        return {
          top: parentHeadingPos.top,
          left: parentPos.left,
          width: parentPos.width,
          height: parentHeadingPos.height,
          background: 'transparent',
          borderWidth: '1px',
          borderColor: color,
        };
      } else {
        if (!layers[layerId]) return;
        const headingPos = layers[layerId].headingDom.getBoundingClientRect();
        const pos = layers[layerId].dom.getBoundingClientRect();

        if (where === 'after' || !currentNode) {
          top = pos.top + pos.height;
        } else {
          top = pos.top;
        }

        return {
          top,
          left: headingPos.left,
          width: pos.width + pos.left - headingPos.left,
          height: 4,
          borderWidth: 0,
          background: color,
        };
      }
    }
  }, [events, indicatorStyles.error, indicatorStyles.success, layers]);

  return (
    <div>
      {events.indicator ? (
        <StyledIndicator
          $error={!!events.indicator.error}
          style={indicatorPosition}
        />
      ) : null}
      {children}
    </div>
  );
};
