/**
 * Reusable drag-and-drop pointer handling for minigames.
 * Handles pointerdown/move/up with requestAnimationFrame throttle,
 * drag position tracking, hover detection, and cleanup.
 *
 * Used by: SidewalkCleanup, ShadePlanter, PathClear, WaterDragDrop,
 * FloodDragClear, PipeDragFit, WasteSeparator, ParkDragRestore,
 * IrrigationBuilder, FestivalInauguration
 */

export interface DragItem {
  id: string
  [key: string]: any
}

export interface UseDragDropOptions {
  /** CSS selector to detect drop zones (e.g. '[data-zone]', '.game-bin') */
  zoneSelector: string
  /** Attribute to read zone ID from (e.g. 'data-zone', 'data-slot') */
  zoneAttr?: string
  /** Offset from pointer to item center (px) */
  offset?: number
}

export function useDragDrop<T extends DragItem>(options: UseDragDropOptions) {
  const dragging = ref<T | null>(null) as Ref<T | null>
  const dragPos = ref({ x: 0, y: 0 })
  const dragStarted = ref(false)
  const hoveredZone = ref<string | null>(null)
  let rafPending = false

  const { zoneSelector, zoneAttr = 'data-zone', offset = 32 } = options

  function onPointerDown(item: T, e: PointerEvent) {
    dragging.value = item
    dragStarted.value = false
    dragPos.value = { x: e.clientX, y: e.clientY }
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging.value) return
    if (!dragStarted.value) dragStarted.value = true

    dragPos.value = { x: e.clientX, y: e.clientY }

    if (!rafPending) {
      rafPending = true
      requestAnimationFrame(() => {
        rafPending = false
        // Detect hovered zone
        const els = document.elementsFromPoint(dragPos.value.x, dragPos.value.y)
        const zone = els.find(el => (el as HTMLElement).closest?.(zoneSelector))
        if (zone) {
          const zoneEl = (zone as HTMLElement).closest(zoneSelector) as HTMLElement | null
          hoveredZone.value = zoneEl?.getAttribute(zoneAttr) ?? null
        } else {
          hoveredZone.value = null
        }
      })
    }
  }

  function onPointerUp(_e?: PointerEvent): { item: T; zoneId: string | null; started: boolean } | null {
    const item = dragging.value
    const started = dragStarted.value
    const zoneId = hoveredZone.value

    dragging.value = null
    dragStarted.value = false
    hoveredZone.value = null

    if (!item) return null
    return { item, zoneId, started }
  }

  /** Returns inline style for the dragged item */
  function dragStyle(item: T, originalStyle?: Record<string, string>): Record<string, string> {
    if (dragging.value?.id === item.id && dragStarted.value) {
      return {
        position: 'fixed',
        left: `${dragPos.value.x - offset}px`,
        top: `${dragPos.value.y - offset}px`,
        zIndex: '100',
        pointerEvents: 'none',
        transition: 'none',
      }
    }
    return originalStyle ?? {}
  }

  function reset() {
    dragging.value = null
    dragStarted.value = false
    hoveredZone.value = null
  }

  return {
    dragging,
    dragPos,
    dragStarted,
    hoveredZone,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    dragStyle,
    reset,
  }
}
