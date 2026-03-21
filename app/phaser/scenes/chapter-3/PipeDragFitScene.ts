import { BaseMinigameScene } from '../../BaseMinigameScene'
import { DragDropMechanic } from '../../mechanics/DragDropMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { DragItemConfig, DropZoneConfig } from '../../types'

export class PipeDragFitScene extends BaseMinigameScene {
  private dragDrop!: DragDropMechanic
  private placed = 0
  private readonly total = 4

  constructor() { super('PipeDragFitScene') }

  create() {
    this.placed = 0

    // Pieces in the tray at bottom
    const items: DragItemConfig[] = [
      { id: 'p1', emoji: '🔧', label: 'Codo', x: 0.10, y: 0.88 },
      { id: 'p2', emoji: '📏', label: 'Tubo recto', x: 0.27, y: 0.88 },
      { id: 'p3', emoji: '❌', label: 'Tubo roto', x: 0.44, y: 0.88 },
      { id: 'p4', emoji: '🔴', label: 'Válvula', x: 0.61, y: 0.88 },
      { id: 'p5', emoji: '🔗', label: 'Conector', x: 0.78, y: 0.88 },
      { id: 'p6', emoji: '⭕', label: 'Tapón', x: 0.92, y: 0.88 },
    ]

    // Piece type map
    const pieceType: Record<string, string> = {
      p1: 'elbow', p2: 'straight', p3: 'broken', p4: 'valve', p5: 'connector', p6: 'cap',
    }

    // Wrong pieces
    const wrongPieces = new Set(['p3', 'p6'])
    const wrongMessages: Record<string, string> = {
      p3: 'Esa pieza está rota, no sirve.',
      p6: 'Un tapón no resuelve la fuga.',
    }

    // 4 pipe slots along a route
    const zones: DropZoneConfig[] = [
      { id: 's1', x: 0.20, y: 0.30, width: 0.14, height: 0.14, label: '?' },
      { id: 's2', x: 0.40, y: 0.42, width: 0.14, height: 0.14, label: '?' },
      { id: 's3', x: 0.60, y: 0.50, width: 0.14, height: 0.14, label: '?' },
      { id: 's4', x: 0.75, y: 0.38, width: 0.14, height: 0.14, label: '?' },
    ]

    // What each slot accepts
    const slotAccepts: Record<string, string> = {
      s1: 'elbow', s2: 'straight', s3: 'valve', s4: 'connector',
    }

    const filledSlots = new Set<string>()

    this.dragDrop = new DragDropMechanic(this, items, zones, (itemId, zoneId) => {
      if (!zoneId) return false
      if (filledSlots.has(zoneId)) return false

      // Check for wrong pieces
      if (wrongPieces.has(itemId)) {
        this.bridge.onFeedback?.(wrongMessages[itemId] ?? 'Pieza incorrecta', false)
        this.cameraShake(0.003, 100)
        return false
      }

      // Check type match
      if (pieceType[itemId] === slotAccepts[zoneId]) {
        filledSlots.add(zoneId)
        this.placed++
        this.bridge.onItemCompleted?.(zoneId, '¡Pieza correcta!')
        this.bridge.onFeedback?.('¡Pieza correcta!', true)
        if (this.placed >= this.total) {
          confettiBurst(this, 24)
          this.cameraShake(0.005, 150)
          this.bridge.onAllCompleted?.()
        }
        return true
      }

      this.bridge.onFeedback?.('Esa pieza no encaja aquí.', false)
      this.cameraShake(0.003, 100)
      return false
    })
  }

  startGame() {}
  shutdown() { this.dragDrop?.destroy() }
}
