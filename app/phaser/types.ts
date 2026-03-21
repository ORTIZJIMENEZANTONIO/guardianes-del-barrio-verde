/** Callback bridge: Phaser scene → Vue wrapper */
export interface MinigameBridge {
  onItemCompleted?: (id: string, message: string) => void
  onAllCompleted?: () => void
  onFeedback?: (message: string, ok: boolean) => void
}

/** Config for a draggable item */
export interface DragItemConfig {
  id: string
  emoji: string
  label: string
  x: number // 0–1 fraction of game width
  y: number // 0–1 fraction of game height
}

/** Config for a drop zone */
export interface DropZoneConfig {
  id: string
  x: number // 0–1 fraction
  y: number // 0–1 fraction
  width: number // 0–1 fraction
  height: number // 0–1 fraction
  label?: string
}

/** Config for a memorama pair */
export interface MemoryPairConfig {
  pairId: string
  a: { emoji: string; label: string }
  b: { emoji: string; label: string }
}

/** Config for a tray item (tap-placement) */
export interface TrayItemConfig {
  id: string
  emoji: string
  label: string
}

/** Config for a placement zone */
export interface PlacementZoneConfig {
  id: string
  x: number // 0–1 fraction
  y: number // 0–1 fraction
  acceptsItemIds?: string[]
}
