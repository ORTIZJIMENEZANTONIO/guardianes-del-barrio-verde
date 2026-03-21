import { BaseMinigameScene } from '../../BaseMinigameScene'
import { TapPlacementMechanic } from '../../mechanics/TapPlacementMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { TrayItemConfig, PlacementZoneConfig } from '../../types'

export class SpaceRestorerScene extends BaseMinigameScene {
  private placement!: TapPlacementMechanic
  private completed = 0
  private readonly total = 5

  constructor() { super('SpaceRestorerScene') }

  create() {
    this.completed = 0

    const items: TrayItemConfig[] = [
      { id: 'bench', emoji: '🪑', label: 'Banca' },
      { id: 'planter', emoji: '🪴', label: 'Maceta' },
      { id: 'mural', emoji: '🎨', label: 'Mural' },
      { id: 'bin', emoji: '🗑️', label: 'Contenedor' },
      { id: 'sign', emoji: '🪧', label: 'Letrero' },
    ]

    const zones: PlacementZoneConfig[] = [
      { id: 'z1', x: 0.15, y: 0.50, acceptsItemIds: ['bench'] },
      { id: 'z2', x: 0.45, y: 0.32, acceptsItemIds: ['planter'] },
      { id: 'z3', x: 0.70, y: 0.18, acceptsItemIds: ['mural'] },
      { id: 'z4', x: 0.60, y: 0.60, acceptsItemIds: ['bin'] },
      { id: 'z5', x: 0.25, y: 0.28, acceptsItemIds: ['sign'] },
    ]

    this.placement = new TapPlacementMechanic(this, items, zones, (itemId, zoneId) => {
      const zone = zones.find(z => z.id === zoneId)
      if (zone?.acceptsItemIds?.includes(itemId)) {
        this.completed++
        this.bridge.onItemCompleted?.(zoneId, '¡Perfecto!')
        this.bridge.onFeedback?.('¡Perfecto!', true)
        if (this.completed >= this.total) {
          confettiBurst(this, 24)
          this.bridge.onAllCompleted?.()
        }
        return true
      }
      this.bridge.onFeedback?.('Ese elemento no va en este lugar', false)
      return false
    })
  }

  startGame() {}
  shutdown() { this.placement?.destroy() }
}
