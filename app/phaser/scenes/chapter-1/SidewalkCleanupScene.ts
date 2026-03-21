import { BaseMinigameScene } from '../../BaseMinigameScene'
import { DragDropMechanic } from '../../mechanics/DragDropMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { DragItemConfig, DropZoneConfig } from '../../types'

export class SidewalkCleanupScene extends BaseMinigameScene {
  private dragDrop!: DragDropMechanic
  private completed = 0
  private readonly total = 10

  constructor() { super('SidewalkCleanupScene') }

  create() {
    this.completed = 0

    const items: DragItemConfig[] = [
      { id: 't1', emoji: '🍌', label: 'Cáscara de plátano', x: 0.10, y: 0.12 },
      { id: 't2', emoji: '🧴', label: 'Botella de plástico', x: 0.52, y: 0.08 },
      { id: 't3', emoji: '📰', label: 'Periódico viejo', x: 0.28, y: 0.30 },
      { id: 't4', emoji: '🛍️', label: 'Bolsa de plástico', x: 0.70, y: 0.22 },
      { id: 't5', emoji: '🍎', label: 'Corazón de manzana', x: 0.18, y: 0.45 },
      { id: 't6', emoji: '📦', label: 'Caja de cartón', x: 0.58, y: 0.38 },
      { id: 't7', emoji: '🩲', label: 'Pañal usado', x: 0.40, y: 0.48 },
      { id: 't8', emoji: '🥫', label: 'Lata de aluminio', x: 0.76, y: 0.40 },
      { id: 't9', emoji: '🍂', label: 'Hojas secas', x: 0.45, y: 0.18 },
      { id: 't10', emoji: '🥤', label: 'Vaso de unicel', x: 0.82, y: 0.32 },
    ]

    // Item category map
    const categoryMap: Record<string, string> = {
      t1: 'organic', t2: 'plastic', t3: 'paper', t4: 'plastic',
      t5: 'organic', t6: 'paper', t7: 'non-recyclable', t8: 'plastic',
      t9: 'organic', t10: 'non-recyclable',
    }

    const categoryLabels: Record<string, string> = {
      organic: 'Orgánico', plastic: 'Reciclable', paper: 'Papel/Cartón', 'non-recyclable': 'No recicl.',
    }

    // 4 bins at the bottom
    const zones: DropZoneConfig[] = [
      { id: 'organic', x: 0.15, y: 0.88, width: 0.18, height: 0.18, label: '🌿 Orgánico' },
      { id: 'plastic', x: 0.38, y: 0.88, width: 0.18, height: 0.18, label: '♻️ Reciclable' },
      { id: 'paper', x: 0.62, y: 0.88, width: 0.18, height: 0.18, label: '📄 Papel' },
      { id: 'non-recyclable', x: 0.85, y: 0.88, width: 0.18, height: 0.18, label: '🚫 No recicl.' },
    ]

    this.dragDrop = new DragDropMechanic(this, items, zones, (itemId, zoneId) => {
      if (!zoneId) {
        this.bridge.onFeedback?.('Arrastra al contenedor correcto', false)
        return false
      }
      const category = categoryMap[itemId]
      if (category === zoneId) {
        this.completed++
        this.bridge.onItemCompleted?.(itemId, '¡Correcto! ✅')
        if (this.completed >= this.total) {
          confettiBurst(this, 24)
          this.cameraShake()
          this.bridge.onAllCompleted?.()
        }
        return true
      }
      const correctLabel = categoryLabels[category] ?? '?'
      this.bridge.onFeedback?.(`¡Ese no va ahí! Es: ${correctLabel}`, false)
      this.cameraShake(0.003, 100)
      return false
    })
  }

  startGame() {}
  shutdown() { this.dragDrop?.destroy() }
}
