import { RenderIndicator, getDOMInfo } from '@craftjs/utils';
import React, { useEffect } from 'react';
import { useEventHandler } from './EventContext';
import movePlaceholder from './movePlaceholder';
import { useInternalEditor } from '../editor/useInternalEditor';
export const RenderEditorIndicator = () => {
  const { indicator, indicatorOptions, enabled } = useInternalEditor(
    (state) => ({
      indicator: state.indicator,
      indicatorOptions: state.options.indicator,
      enabled: state.options.enabled,
    })
  );
  const handler = useEventHandler();
  useEffect(() => {
    if (!handler) {
      return;
    }
    if (!enabled) {
      handler.disable();
      return;
    }
    handler.enable();
  }, [enabled, handler]);
  if (!indicator) {
    return null;
  }
  const placeholderInfo = movePlaceholder(
    indicator.placement,
    getDOMInfo(indicator.placement.parent.dom),
    indicator.placement.currentNode &&
      getDOMInfo(indicator.placement.currentNode.dom),
    indicatorOptions.thickness
  );
  const isBlockMode = placeholderInfo.mode === 'block';
  const baseColor = indicator.error
    ? indicatorOptions.error
    : indicatorOptions.success;
  return React.createElement(RenderIndicator, {
    className: indicatorOptions.className,
    style: {
      top: placeholderInfo.top,
      left: placeholderInfo.left,
      width: placeholderInfo.width,
      height: placeholderInfo.height,
      // Apply different styles based on mode
      ...(isBlockMode
        ? {
            // Block area styles - subtle outline with corner accents
            backgroundColor: `${baseColor}08`, // 08 = ~3% opacity (very subtle)
            border: `2px solid ${baseColor}`,
            borderRadius: '6px',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            // Add subtle shadow for depth
            boxShadow: `0 0 0 4px ${baseColor}10, inset 0 0 20px ${baseColor}15`,
            // Smooth transition
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        : {
            // Line styles (existing behavior)
            backgroundColor: baseColor,
            borderWidth: 0,
          }),
      transition: indicatorOptions.transition || '0.2s ease-in',
      ...(indicatorOptions.style ?? {}),
    },
    parentDom: indicator.placement.parent.dom,
  });
};
//# sourceMappingURL=RenderEditorIndicator.js.map
