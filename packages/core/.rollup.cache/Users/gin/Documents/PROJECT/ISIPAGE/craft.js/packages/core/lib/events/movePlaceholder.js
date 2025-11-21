export default function movePlaceholder(
  pos,
  canvasDOMInfo, // which canvas is cursor at
  bestTargetDomInfo, // closest element in canvas (null if canvas is empty)
  thickness = 2
) {
  let t = 0,
    l = 0,
    w = 0,
    h = 0,
    where = pos.where;
  let mode = 'line';
  const elDim = bestTargetDomInfo;
  // Show block area for empty containers or when dropping into container
  if (!elDim) {
    mode = 'block';
    if (canvasDOMInfo) {
      t = canvasDOMInfo.top + canvasDOMInfo.padding.top;
      l = canvasDOMInfo.left + canvasDOMInfo.padding.left;
      w =
        canvasDOMInfo.outerWidth -
        canvasDOMInfo.padding.right -
        canvasDOMInfo.padding.left -
        canvasDOMInfo.margin.left -
        canvasDOMInfo.margin.right;
      h =
        canvasDOMInfo.outerHeight -
        canvasDOMInfo.padding.top -
        canvasDOMInfo.padding.bottom -
        canvasDOMInfo.margin.top -
        canvasDOMInfo.margin.bottom;
      // Minimum height for better visibility
      h = Math.max(h, 40);
    }
  } else {
    // Line indicator for before/after
    mode = 'line';
    // If it's not in flow (like 'float' element)
    if (!elDim.inFlow) {
      w = thickness;
      h = elDim.outerHeight;
      t = elDim.top;
      l = where === 'before' ? elDim.left : elDim.left + elDim.outerWidth;
    } else {
      w = elDim.outerWidth;
      h = thickness;
      t = where === 'before' ? elDim.top : elDim.bottom;
      l = elDim.left;
    }
  }
  return {
    top: `${t}px`,
    left: `${l}px`,
    width: `${w}px`,
    height: `${h}px`,
    mode,
  };
}
//# sourceMappingURL=movePlaceholder.js.map
