import React from 'react';

import { useInternalEditor } from '../editor/useInternalEditor';

const GUIDE_COLOR = '#0096FF';
const GUIDE_WIDTH = 1;

/**
 * RenderSnapGuides renders visual alignment guide lines during drag operations
 */
export const RenderSnapGuides = () => {
  const { snapGuides, enabled } = useInternalEditor((state) => ({
    snapGuides: state.snapGuides || [],
    enabled: state.options.enabled,
  }));

  if (!enabled || !snapGuides || snapGuides.length === 0) {
    return null;
  }

  return (
    <>
      {snapGuides.map((guide, index) => {
        const isHorizontal = guide.type === 'horizontal';

        const style: React.CSSProperties = {
          position: 'fixed',
          backgroundColor: GUIDE_COLOR,
          pointerEvents: 'none',
          zIndex: 99999,
          ...(isHorizontal
            ? {
                left: guide.start,
                top: guide.position - GUIDE_WIDTH / 2,
                width: guide.end - guide.start,
                height: GUIDE_WIDTH,
              }
            : {
                left: guide.position - GUIDE_WIDTH / 2,
                top: guide.start,
                width: GUIDE_WIDTH,
                height: guide.end - guide.start,
              }),
        };

        return <div key={`snap-guide-${index}`} style={style} />;
      })}
    </>
  );
};
