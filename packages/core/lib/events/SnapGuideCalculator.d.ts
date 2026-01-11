import { EditorStore } from '../editor/store';
import { NodeId } from '../interfaces';
export interface SnapGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
}
export interface SnapResult {
  guides: SnapGuide[];
  snapX: number | null;
  snapY: number | null;
}
/**
 * SnapGuideCalculator computes alignment guides during drag operations
 * Option A: Basic center-line snapping only
 */
export declare class SnapGuideCalculator {
  readonly store: EditorStore;
  static SNAP_THRESHOLD: number;
  private siblingDimensions;
  private canvasBounds;
  constructor(store: EditorStore);
  /**
   * Initialize with sibling elements to snap against
   */
  setSiblings(parentId: NodeId, excludeIds: NodeId[]): void;
  /**
   * Calculate snap guides based on current drag position
   */
  calculate(draggedRect: DOMRect): SnapResult;
  private deduplicateGuides;
  clear(): void;
}
