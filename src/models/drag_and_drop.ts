/**
 * Implemented by any class that renders a draggable item.
 */
export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

/**
 * Implemented by any class that renders an item,
 * which can be used as a drag target.
 */
export interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
