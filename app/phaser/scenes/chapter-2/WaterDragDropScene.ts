import { BaseMinigameScene } from '../../BaseMinigameScene'
import { DragDropMechanic } from '../../mechanics/DragDropMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { DragItemConfig, DropZoneConfig } from '../../types'

export class WaterDragDropScene extends BaseMinigameScene {
  private dragDrop!: DragDropMechanic
  private completed = 0
  private readonly total = 4

  constructor() { super('WaterDragDropScene') }

  create() {
    this.completed = 0

    // 6 water drops on the left side (well area)
    const items: DragItemConfig[] = [
      { id: 'd1', emoji: '💧', label: 'Gota 1', x: 0.08, y: 0.25 },
      { id: 'd2', emoji: '💧', label: 'Gota 2', x: 0.08, y: 0.40 },
      { id: 'd3', emoji: '💧', label: 'Gota 3', x: 0.08, y: 0.55 },
      { id: 'd4', emoji: '💧', label: 'Gota 4', x: 0.18, y: 0.25 },
      { id: 'd5', emoji: '💧', label: 'Gota 5', x: 0.18, y: 0.40 },
      { id: 'd6', emoji: '💧', label: 'Gota 6', x: 0.18, y: 0.55 },
    ]

    // Plant needs map
    const plantNeeds: Record<string, { needsWater: boolean; feedbackOk: string; feedbackBad: string }> = {
      z1: { needsWater: true, feedbackOk: '¡El árbol joven necesitaba esa agua!', feedbackBad: '' },
      z2: { needsWater: true, feedbackOk: '¡La jardinera revive!', feedbackBad: '' },
      z3: { needsWater: true, feedbackOk: 'Las plantas débiles ya se ven mejor.', feedbackBad: '' },
      z4: { needsWater: true, feedbackOk: '¡Bolillo tendrá agua fresca!', feedbackBad: '' },
      z5: { needsWater: false, feedbackOk: '', feedbackBad: 'La piedra no necesita agua.' },
      z6: { needsWater: false, feedbackOk: '', feedbackBad: 'La banqueta no la absorbe. ¡Agua desperdiciada!' },
    }

    // 6 plant zones in a grid on the right
    const zones: DropZoneConfig[] = [
      { id: 'z1', x: 0.45, y: 0.25, width: 0.22, height: 0.22, label: '🌳 Árbol joven' },
      { id: 'z2', x: 0.75, y: 0.25, width: 0.22, height: 0.22, label: '🪴 Jardinera' },
      { id: 'z3', x: 0.45, y: 0.50, width: 0.22, height: 0.22, label: '🌿 Plantas débiles' },
      { id: 'z4', x: 0.75, y: 0.50, width: 0.22, height: 0.22, label: '🐕 Plato Bolillo' },
      { id: 'z5', x: 0.45, y: 0.75, width: 0.22, height: 0.22, label: '🪨 Piedra' },
      { id: 'z6', x: 0.75, y: 0.75, width: 0.22, height: 0.22, label: '🧱 Banqueta' },
    ]

    const wateredZones = new Set<string>()

    this.dragDrop = new DragDropMechanic(this, items, zones, (itemId, zoneId) => {
      if (!zoneId) return false
      if (wateredZones.has(zoneId)) return false

      const plant = plantNeeds[zoneId]
      if (!plant) return false

      wateredZones.add(zoneId)

      if (plant.needsWater) {
        this.completed++
        this.bridge.onItemCompleted?.(zoneId, plant.feedbackOk)
        this.bridge.onFeedback?.(plant.feedbackOk, true)
        if (this.completed >= this.total) {
          confettiBurst(this, 24)
          this.bridge.onAllCompleted?.()
        }
        return true
      } else {
        this.bridge.onFeedback?.(plant.feedbackBad, false)
        this.cameraShake(0.003, 100)
        return true // Accept drop (water is consumed) but no progress
      }
    })
  }

  startGame() {}
  shutdown() { this.dragDrop?.destroy() }
}
