import { BaseMinigameScene } from '../../BaseMinigameScene'
import { DragDropMechanic } from '../../mechanics/DragDropMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { DragItemConfig, DropZoneConfig } from '../../types'

export class FloodDragClearScene extends BaseMinigameScene {
  private dragDrop!: DragDropMechanic
  private cleared = 0
  private readonly total = 5
  private waterOverlay!: Phaser.GameObjects.Graphics

  constructor() { super('FloodDragClearScene') }

  create() {
    this.cleared = 0
    const w = this.scale.width
    const h = this.scale.height

    // Water overlay (left 80% of screen)
    this.waterOverlay = this.add.graphics().setDepth(3)
    this.drawWater(80)

    const items: DragItemConfig[] = [
      { id: 'o1', emoji: '🛍️', label: 'Bolsa de basura', x: 0.20, y: 0.40 },
      { id: 'o2', emoji: '🧱', label: 'Escombro', x: 0.45, y: 0.50 },
      { id: 'o3', emoji: '🛞', label: 'Llanta vieja', x: 0.30, y: 0.60 },
      { id: 'o4', emoji: '🪵', label: 'Ramas caídas', x: 0.60, y: 0.35 },
      { id: 'o5', emoji: '🥤', label: 'Plásticos', x: 0.50, y: 0.55 },
    ]

    // Safe zone on the right 20%
    const zones: DropZoneConfig[] = [
      { id: 'safe', x: 0.90, y: 0.50, width: 0.20, height: 1.0, label: 'Zona segura →' },
    ]

    this.dragDrop = new DragDropMechanic(this, items, zones, (itemId, zoneId) => {
      if (zoneId === 'safe') {
        this.cleared++
        const waterHeight = Math.max(20, 80 - this.cleared * 12)
        this.drawWater(waterHeight)
        this.bridge.onItemCompleted?.(itemId, '¡Despejado!')
        this.bridge.onFeedback?.('¡Despejado!', true)
        if (this.cleared >= this.total) {
          confettiBurst(this, 24)
          this.cameraShake(0.005, 150)
          this.bridge.onAllCompleted?.()
        }
        return true
      }
      this.bridge.onFeedback?.('Llévalo a la zona segura', false)
      this.cameraShake(0.003, 100)
      return false
    })
  }

  private drawWater(heightPercent: number) {
    const w = this.scale.width
    const h = this.scale.height
    this.waterOverlay.clear()
    this.waterOverlay.fillStyle(0x3b82f6, 0.25)
    const waterH = h * (heightPercent / 100)
    this.waterOverlay.fillRect(0, h - waterH, w * 0.80, waterH)
  }

  startGame() {}
  shutdown() { this.dragDrop?.destroy() }
}
