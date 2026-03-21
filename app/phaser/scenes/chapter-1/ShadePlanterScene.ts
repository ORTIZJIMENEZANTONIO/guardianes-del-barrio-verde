import { BaseMinigameScene } from '../../BaseMinigameScene'
import { confettiBurst } from '../../effects/ConfettiEmitter'

interface PlantSlotData {
  id: string
  label: string
  emoji: string
  isValid: boolean
  x: number
  y: number
  reason: string
}

export class ShadePlanterScene extends BaseMinigameScene {
  private treesPlanted = 0
  private seedsRemaining = 6
  private readonly total = 4

  constructor() { super('ShadePlanterScene') }

  create() {
    this.treesPlanted = 0
    this.seedsRemaining = 6

    const slots: PlantSlotData[] = [
      { id: 'p1', label: 'Junto a banca', emoji: '🪑', isValid: true, x: 0.15, y: 0.50, reason: 'Perfecto: dará sombra a la banca.' },
      { id: 'p2', label: 'Banqueta', emoji: '🚶', isValid: true, x: 0.45, y: 0.38, reason: 'Los peatones tendrán sombra.' },
      { id: 'p3', label: 'Frente a casa', emoji: '🏠', isValid: true, x: 0.70, y: 0.28, reason: 'Bajará el calor en la fachada.' },
      { id: 'p4', label: 'Esquina', emoji: '📍', isValid: true, x: 0.30, y: 0.65, reason: 'Excelente punto de sombra urbana.' },
      { id: 'p5', label: 'Sobre tubería', emoji: '🔧', isValid: false, x: 0.55, y: 0.60, reason: 'Las raíces podrían dañar la tubería.' },
      { id: 'p6', label: 'Cable eléctrico', emoji: '⚡', isValid: false, x: 0.80, y: 0.18, reason: 'Hay cables cerca, no es seguro.' },
      { id: 'p7', label: 'Entrada garage', emoji: '🚗', isValid: false, x: 0.20, y: 0.22, reason: 'Bloquearía la entrada del garage.' },
    ]

    const w = this.scale.width
    const h = this.scale.height

    // Seed counter (updated in-place)
    const seedText = this.add.text(w / 2, h - 30, `🌱 Semillas: ${this.seedsRemaining}`, {
      fontSize: '14px', fontFamily: 'Nunito, sans-serif', fontStyle: '800',
      color: '#15803d', backgroundColor: 'rgba(255,255,255,0.95)',
      padding: { x: 14, y: 8 },
    }).setOrigin(0.5).setDepth(15)

    const planted = new Set<string>()

    for (const slot of slots) {
      const sx = slot.x * w
      const sy = slot.y * h
      const container = this.add.container(sx, sy).setDepth(10)

      const bg = this.add.graphics()
      bg.fillStyle(0xffffff, 0.7)
      bg.fillRoundedRect(-38, -38, 76, 76, 12)
      bg.lineStyle(3, slot.isValid ? 0x2d9d5e : 0x000000, 0.5)
      bg.strokeRoundedRect(-38, -38, 76, 76, 12)
      container.add(bg)

      const emoji = this.add.text(0, -8, slot.emoji, { fontSize: '22px' }).setOrigin(0.5)
      container.add(emoji)

      const label = this.add.text(0, 18, slot.label, {
        fontSize: '10px', fontFamily: 'Nunito, sans-serif', fontStyle: '800',
        color: '#111827', align: 'center',
      }).setOrigin(0.5)
      container.add(label)

      container.setSize(76, 76)
      container.setInteractive({ useHandCursor: true })

      container.on('pointerdown', () => {
        if (planted.has(slot.id) || this.seedsRemaining <= 0) return

        this.seedsRemaining--
        seedText.setText(`🌱 Semillas: ${this.seedsRemaining}`)

        if (slot.isValid) {
          planted.add(slot.id)
          this.treesPlanted++

          // Replace with tree
          bg.clear()
          bg.fillStyle(0x52b788, 0.2)
          bg.fillRoundedRect(-38, -38, 76, 76, 12)
          emoji.setText('🌳')
          emoji.setFontSize(36)
          emoji.setY(0)
          label.setVisible(false)

          this.celebrateItem(container)
          this.bridge.onItemCompleted?.(slot.id, slot.reason)
          this.bridge.onFeedback?.(slot.reason, true)

          if (this.treesPlanted >= this.total) {
            confettiBurst(this, 20)
            this.bridge.onAllCompleted?.()
          }

          container.disableInteractive()
        } else {
          // Wrong spot
          this.shakeItem(container)
          this.bridge.onFeedback?.(slot.reason, false)

          // Check if out of seeds
          if (this.seedsRemaining <= 0 && this.treesPlanted < this.total) {
            this.time.delayedCall(1000, () => this.bridge.onAllCompleted?.())
          }
        }
      })
    }
  }

  startGame() {}
}
