import { BaseMinigameScene } from '../../BaseMinigameScene'
import { DragDropMechanic } from '../../mechanics/DragDropMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { DragItemConfig, DropZoneConfig } from '../../types'

export class ParkDragRestoreScene extends BaseMinigameScene {
  private dragDrop!: DragDropMechanic
  private completed = 0
  private readonly total = 5

  constructor() { super('ParkDragRestoreScene') }

  create() {
    this.completed = 0

    // Items start at the bottom tray area
    const items: DragItemConfig[] = [
      { id: 'bench', emoji: '🛋️', label: 'Banca pintada', x: 0.12, y: 0.88 },
      { id: 'bin', emoji: '🗑️', label: 'Bote clasificador', x: 0.30, y: 0.88 },
      { id: 'sign', emoji: '🪧', label: 'Letrero', x: 0.50, y: 0.88 },
      { id: 'swing', emoji: '🎠', label: 'Columpio', x: 0.70, y: 0.88 },
      { id: 'reading', emoji: '📚', label: 'Rincón lectura', x: 0.88, y: 0.88 },
    ]

    // Drop zones positioned on the scene
    const zones: DropZoneConfig[] = [
      { id: 'z-bench', x: 0.15, y: 0.45, width: 0.16, height: 0.16, label: 'Banca' },
      { id: 'z-bin', x: 0.50, y: 0.30, width: 0.16, height: 0.16, label: 'Bote' },
      { id: 'z-sign', x: 0.75, y: 0.22, width: 0.16, height: 0.16, label: 'Letrero' },
      { id: 'z-swing', x: 0.35, y: 0.55, width: 0.16, height: 0.16, label: 'Columpio' },
      { id: 'z-reading', x: 0.65, y: 0.50, width: 0.16, height: 0.16, label: 'Lectura' },
    ]

    // Zone accepts matching
    const zoneAccepts: Record<string, string> = {
      'z-bench': 'bench', 'z-bin': 'bin', 'z-sign': 'sign',
      'z-swing': 'swing', 'z-reading': 'reading',
    }

    const successMessages: Record<string, string> = {
      'z-bench': '¡Banca pintada y lista!',
      'z-bin': '¡Bote clasificador instalado!',
      'z-sign': 'Letrero de cuidado colocado.',
      'z-swing': '¡Columpio arreglado!',
      'z-reading': '¡Rincón de lectura listo!',
    }

    this.dragDrop = new DragDropMechanic(this, items, zones, (itemId, zoneId) => {
      if (!zoneId) return false

      if (zoneAccepts[zoneId] === itemId) {
        this.completed++
        this.bridge.onItemCompleted?.(zoneId, successMessages[zoneId] ?? '¡Colocado!')
        this.bridge.onFeedback?.(successMessages[zoneId] ?? '¡Colocado!', true)
        if (this.completed >= this.total) {
          confettiBurst(this, 24)
          this.cameraShake(0.005, 150)
          this.bridge.onAllCompleted?.()
        }
        return true
      }

      this.bridge.onFeedback?.('Ese elemento no va en este lugar', false)
      this.cameraShake(0.003, 100)
      return false
    })
  }

  startGame() {}
  shutdown() { this.dragDrop?.destroy() }
}
