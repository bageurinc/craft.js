import { NodeId, Node, DerivedCoreEventHandlers } from '@craftjs/core';
import { LayerIndicator } from '../interfaces';
export declare class LayerHandlers extends DerivedCoreEventHandlers<{
  layerStore: any;
}> {
  static draggedElement: any;
  static events: {
    indicator: LayerIndicator;
    currentCanvasHovered: Node;
  };
  private autoScrollInterval;
  private readonly AUTO_SCROLL_THRESHOLD;
  private readonly AUTO_SCROLL_SPEED;
  getLayer(id: NodeId): any;
  private handleAutoScroll;
  private stopAutoScroll;
  handlers(): {
    layer: (el: HTMLElement, layerId: NodeId) => () => void;
    layerHeader: (el: HTMLElement, layerId: NodeId) => void;
    drag: (el: HTMLElement, layerId: NodeId) => () => void;
  };
}
