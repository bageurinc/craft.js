import { getDOMInfo } from '@craftjs/utils';
/**
 * SnapGuideCalculator computes alignment guides during drag operations
 * Option A: Basic center-line snapping only
 */
export class SnapGuideCalculator {
  store;
  static SNAP_THRESHOLD = 8; // pixels within which to snap
  siblingDimensions = [];
  canvasBounds = null;
  constructor(store) {
    this.store = store;
  }
  /**
   * Initialize with sibling elements to snap against
   */
  setSiblings(parentId, excludeIds) {
    const parentNode = this.store.query.node(parentId).get();
    if (!parentNode) return;
    // Get canvas/parent bounds
    if (parentNode.dom) {
      this.canvasBounds = parentNode.dom.getBoundingClientRect();
    }
    // Get all sibling dimensions except the ones being dragged
    this.siblingDimensions = parentNode.data.nodes
      .filter((id) => !excludeIds.includes(id))
      .map((id) => {
        const node = this.store.query.node(id).get();
        if (!node || !node.dom) return null;
        return {
          id,
          ...getDOMInfo(node.dom),
        };
      })
      .filter(Boolean);
  }
  /**
   * Calculate snap guides based on current drag position
   */
  calculate(draggedRect) {
    const guides = [];
    let snapX = null;
    let snapY = null;
    const draggedCenterX = draggedRect.left + draggedRect.width / 2;
    const draggedCenterY = draggedRect.top + draggedRect.height / 2;
    // Check alignment with each sibling
    for (const sibling of this.siblingDimensions) {
      const siblingCenterX = sibling.left + sibling.width / 2;
      const siblingCenterY = sibling.top + sibling.height / 2;
      // Vertical center alignment (creates a vertical guide line)
      const diffX = Math.abs(draggedCenterX - siblingCenterX);
      if (diffX < SnapGuideCalculator.SNAP_THRESHOLD) {
        snapX = siblingCenterX - draggedRect.width / 2;
        guides.push({
          type: 'vertical',
          position: siblingCenterX,
          start: Math.min(draggedRect.top, sibling.top),
          end: Math.max(draggedRect.bottom, sibling.bottom),
        });
      }
      // Horizontal center alignment (creates a horizontal guide line)
      const diffY = Math.abs(draggedCenterY - siblingCenterY);
      if (diffY < SnapGuideCalculator.SNAP_THRESHOLD) {
        snapY = siblingCenterY - draggedRect.height / 2;
        guides.push({
          type: 'horizontal',
          position: siblingCenterY,
          start: Math.min(draggedRect.left, sibling.left),
          end: Math.max(draggedRect.right, sibling.right),
        });
      }
    }
    // Also check alignment with canvas center
    if (this.canvasBounds) {
      const canvasCenterX =
        this.canvasBounds.left + this.canvasBounds.width / 2;
      const canvasCenterY =
        this.canvasBounds.top + this.canvasBounds.height / 2;
      const diffCanvasX = Math.abs(draggedCenterX - canvasCenterX);
      if (diffCanvasX < SnapGuideCalculator.SNAP_THRESHOLD) {
        snapX = canvasCenterX - draggedRect.width / 2;
        guides.push({
          type: 'vertical',
          position: canvasCenterX,
          start: this.canvasBounds.top,
          end: this.canvasBounds.bottom,
        });
      }
      const diffCanvasY = Math.abs(draggedCenterY - canvasCenterY);
      if (diffCanvasY < SnapGuideCalculator.SNAP_THRESHOLD) {
        snapY = canvasCenterY - draggedRect.height / 2;
        guides.push({
          type: 'horizontal',
          position: canvasCenterY,
          start: this.canvasBounds.left,
          end: this.canvasBounds.right,
        });
      }
    }
    // Deduplicate guides (same position)
    const uniqueGuides = this.deduplicateGuides(guides);
    return {
      guides: uniqueGuides,
      snapX,
      snapY,
    };
  }
  deduplicateGuides(guides) {
    const seen = new Map();
    for (const guide of guides) {
      const key = `${guide.type}-${Math.round(guide.position)}`;
      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, guide);
      } else {
        // Extend the existing guide
        existing.start = Math.min(existing.start, guide.start);
        existing.end = Math.max(existing.end, guide.end);
      }
    }
    return Array.from(seen.values());
  }
  clear() {
    this.siblingDimensions = [];
    this.canvasBounds = null;
  }
}
//# sourceMappingURL=SnapGuideCalculator.js.map
