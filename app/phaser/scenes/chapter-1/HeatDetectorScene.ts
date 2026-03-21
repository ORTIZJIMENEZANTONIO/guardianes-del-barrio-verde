import { BaseMinigameScene } from '../../BaseMinigameScene'
import { confettiBurst } from '../../effects/ConfettiEmitter'

interface HeatSpotData {
  id: string
  label: string
  emoji: string
  temp: number
  isHot: boolean
  x: number
  y: number
}

export class HeatDetectorScene extends BaseMinigameScene {
  private hotFound = 0
  private readonly totalHot = 3

  constructor() { super('HeatDetectorScene') }

  create() {
    this.hotFound = 0

    const spots: HeatSpotData[] = [
      { id: 's1', label: 'Pavimento', emoji: '🟫', temp: 58, isHot: true, x: 0.12, y: 0.55 },
      { id: 's2', label: 'Techo bajo', emoji: '🏠', temp: 52, isHot: true, x: 0.60, y: 0.15 },
      { id: 's3', label: 'Banca metal', emoji: '🪑', temp: 55, isHot: true, x: 0.40, y: 0.45 },
      { id: 's4', label: 'Sombra', emoji: '🌤️', temp: 32, isHot: false, x: 0.75, y: 0.40 },
      { id: 's5', label: 'Pared', emoji: '🧱', temp: 45, isHot: false, x: 0.08, y: 0.20 },
      { id: 's6', label: 'Maceta', emoji: '🪴', temp: 28, isHot: false, x: 0.50, y: 0.65 },
    ]

    const w = this.scale.width
    const h = this.scale.height
    const tapped = new Set<string>()

    for (const spot of spots) {
      const sx = spot.x * w
      const sy = spot.y * h
      const container = this.add.container(sx, sy).setDepth(10)

      // Background
      const bg = this.add.graphics()
      bg.fillStyle(0xffffff, 0.6)
      bg.fillRoundedRect(-38, -38, 76, 76, 12)
      bg.lineStyle(2, 0x000000, 0.25)
      bg.strokeRoundedRect(-38, -38, 76, 76, 12)
      container.add(bg)

      // Emoji
      const emoji = this.add.text(0, -8, spot.emoji, { fontSize: '24px' }).setOrigin(0.5)
      container.add(emoji)

      // Label
      const label = this.add.text(0, 18, spot.label, {
        fontSize: '10px', fontFamily: 'Nunito, sans-serif', fontStyle: '800',
        color: '#111827', align: 'center',
      }).setOrigin(0.5)
      container.add(label)

      container.setSize(76, 76)
      container.setInteractive({ useHandCursor: true })

      container.on('pointerdown', () => {
        if (tapped.has(spot.id)) return
        tapped.add(spot.id)

        // Show temperature
        const tempText = this.add.text(sx, sy - 45, `${spot.temp}°C`, {
          fontSize: '14px', fontFamily: 'Nunito, sans-serif', fontStyle: '800',
          color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.6)',
          padding: { x: 8, y: 2 },
        }).setOrigin(0.5).setDepth(20)

        // Color the background
        bg.clear()
        if (spot.isHot) {
          bg.fillStyle(0xf94144, 0.3)
          bg.fillRoundedRect(-38, -38, 76, 76, 12)
          bg.lineStyle(2, 0xf94144, 1)
          bg.strokeRoundedRect(-38, -38, 76, 76, 12)
          this.hotFound++
          this.shakeItem(container)
          this.bridge.onItemCompleted?.(spot.id, `¡${spot.label} alcanza ${spot.temp}°C!`)
          this.bridge.onFeedback?.(`¡${spot.label} alcanza ${spot.temp}°C!`, true)

          if (this.hotFound >= this.totalHot) {
            confettiBurst(this, 16)
            this.bridge.onAllCompleted?.()
          }
        } else {
          bg.fillStyle(0x52b788, 0.3)
          bg.fillRoundedRect(-38, -38, 76, 76, 12)
          bg.lineStyle(2, 0x52b788, 1)
          bg.strokeRoundedRect(-38, -38, 76, 76, 12)
          this.bridge.onFeedback?.(`${spot.label}: ${spot.temp}°C — no es de los más calientes`, false)
        }

        container.disableInteractive()
      })
    }
  }

  startGame() {}

  shutdown() {
    this.input.removeAllListeners()
  }
}
