import { BaseMinigameScene } from '../../BaseMinigameScene'
import { DragDropMechanic } from '../../mechanics/DragDropMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { DragItemConfig, DropZoneConfig } from '../../types'

/**
 * PathClear minigame — drag obstacles off the senderos to the cleanup zone.
 * Phaser version of chapter-2/PathClear.vue
 */
export class PathClearScene extends BaseMinigameScene {
  private dragDrop!: DragDropMechanic
  private cleared = 0
  private readonly total = 6
  private paths: { id: string; y: number; segments: { id: string; cleared: boolean }[] }[] = []
  private pathGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()

  constructor() {
    super('PathClearScene')
  }

  create() {
    this.cleared = 0
    this.paths = [
      { id: 'p1', y: 0.30, segments: [{ id: 'p1-s1', cleared: false }, { id: 'p1-s2', cleared: false }] },
      { id: 'p2', y: 0.55, segments: [{ id: 'p2-s1', cleared: false }, { id: 'p2-s2', cleared: false }] },
      { id: 'p3', y: 0.65, segments: [{ id: 'p3-s1', cleared: false }, { id: 'p3-s2', cleared: false }] },
    ]

    this.drawPaths()

    const obstacles: DragItemConfig[] = [
      { id: 'o1', emoji: '🪵', label: 'Rama caída', x: 0.15, y: 0.30 },
      { id: 'o2', emoji: '🪨', label: 'Piedra grande', x: 0.35, y: 0.55 },
      { id: 'o3', emoji: '🌿', label: 'Arbusto seco', x: 0.50, y: 0.30 },
      { id: 'o4', emoji: '🧱', label: 'Escombro viejo', x: 0.25, y: 0.65 },
      { id: 'o5', emoji: '🪤', label: 'Cerca rota', x: 0.60, y: 0.55 },
      { id: 'o6', emoji: '🍂', label: 'Hojas acumuladas', x: 0.45, y: 0.65 },
    ]

    // Obstacle → path segment mapping
    const segmentMap: Record<string, { pathId: string; segmentId: string }> = {
      o1: { pathId: 'p1', segmentId: 'p1-s1' },
      o2: { pathId: 'p2', segmentId: 'p2-s1' },
      o3: { pathId: 'p1', segmentId: 'p1-s2' },
      o4: { pathId: 'p3', segmentId: 'p3-s1' },
      o5: { pathId: 'p2', segmentId: 'p2-s2' },
      o6: { pathId: 'p3', segmentId: 'p3-s2' },
    }

    const successMessages: Record<string, string> = {
      o1: '¡Rama retirada! El sendero se abre.',
      o2: '¡Piedra movida! Ya se puede pasar.',
      o3: '¡Arbusto despejado!',
      o4: 'Escombro retirado del camino.',
      o5: '¡Cerca retirada!',
      o6: '¡Hojas barridas!',
    }

    // Cleanup zone: right 20% of screen
    const cleanupZone: DropZoneConfig[] = [
      { id: 'cleanup', x: 0.90, y: 0.50, width: 0.20, height: 1.0, label: 'Zona de limpieza' },
    ]

    this.dragDrop = new DragDropMechanic(this, obstacles, cleanupZone, (itemId, zoneId) => {
      if (zoneId === 'cleanup') {
        this.cleared++

        // Mark path segment as cleared
        const mapping = segmentMap[itemId]
        if (mapping) {
          const path = this.paths.find(p => p.id === mapping.pathId)
          if (path) {
            const seg = path.segments.find(s => s.id === mapping.segmentId)
            if (seg) {
              seg.cleared = true
              this.drawPaths()
            }
          }
        }

        this.bridge.onFeedback?.(successMessages[itemId] ?? '¡Despejado!', true)
        this.bridge.onItemCompleted?.(itemId, successMessages[itemId] ?? '¡Despejado!')

        if (this.cleared >= this.total) {
          confettiBurst(this, 24)
          this.cameraShake(0.005, 150)
          this.bridge.onAllCompleted?.()
        }

        return true // Accept drop
      }

      // Dropped outside cleanup zone
      this.bridge.onFeedback?.('Arrastra al lado derecho, a la zona de limpieza', false)
      this.cameraShake(0.003, 100)
      return false
    })
  }

  private drawPaths() {
    // Clear old graphics
    this.pathGraphics.forEach(g => g.destroy())
    this.pathGraphics.clear()

    const w = this.scale.width
    const h = this.scale.height

    for (const path of this.paths) {
      const y = path.y * h
      const segW = (w * 0.75) / path.segments.length
      const startX = w * 0.05

      path.segments.forEach((seg, i) => {
        const g = this.add.graphics().setDepth(2)
        const sx = startX + i * segW
        const ex = sx + segW

        if (seg.cleared) {
          g.lineStyle(4, 0x22c55e, 1)
          g.beginPath()
          g.moveTo(sx, y)
          g.lineTo(ex, y)
          g.strokePath()
        } else {
          // Dashed line
          g.lineStyle(4, 0x787164, 0.5)
          const dashLen = 12
          const gapLen = 8
          let cx = sx
          while (cx < ex) {
            const end = Math.min(cx + dashLen, ex)
            g.beginPath()
            g.moveTo(cx, y)
            g.lineTo(end, y)
            g.strokePath()
            cx = end + gapLen
          }
        }

        this.pathGraphics.set(seg.id, g)
      })
    }
  }

  /** Called by PhaserCanvas after bridge is set */
  startGame() {
    // Game is already created in create()
  }

  shutdown() {
    this.dragDrop?.destroy()
    this.pathGraphics.forEach(g => g.destroy())
    this.pathGraphics.clear()
  }
}
