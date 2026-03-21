import { BaseMinigameScene } from '../../BaseMinigameScene'
import { MemoramaMechanic } from '../../mechanics/MemoramaMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { MemoryPairConfig } from '../../types'

export class WetlandMemoryScene extends BaseMinigameScene {
  private memorama!: MemoramaMechanic

  constructor() { super('WetlandMemoryScene') }

  create() {
    const pairs: MemoryPairConfig[] = [
      { pairId: 'p1', a: { emoji: '🌾', label: 'Juncos' }, b: { emoji: '🧹', label: 'Filtran el agua' } },
      { pairId: 'p2', a: { emoji: '🐸', label: 'Rana' }, b: { emoji: '🌡️', label: 'Indica agua sana' } },
      { pairId: 'p3', a: { emoji: '💧', label: 'Humedal' }, b: { emoji: '🧽', label: 'Retiene agua' } },
      { pairId: 'p4', a: { emoji: '🦆', label: 'Aves acuáticas' }, b: { emoji: '🏠', label: 'Necesitan hábitat' } },
    ]

    this.memorama = new MemoramaMechanic(this, pairs, {
      onMatch: (pairId) => {
        this.bridge.onItemCompleted?.(pairId, '¡Pareja encontrada!')
        this.bridge.onFeedback?.('¡Pareja encontrada!', true)
      },
      onMismatch: () => {
        this.bridge.onFeedback?.('No es pareja, intenta otra vez', false)
      },
      onAllMatched: () => {
        confettiBurst(this, 20)
        this.bridge.onAllCompleted?.()
      },
    })
  }

  startGame() {}
  shutdown() { this.memorama?.destroy() }
}
