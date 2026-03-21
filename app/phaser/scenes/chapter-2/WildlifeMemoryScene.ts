import { BaseMinigameScene } from '../../BaseMinigameScene'
import { MemoramaMechanic } from '../../mechanics/MemoramaMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { MemoryPairConfig } from '../../types'

export class WildlifeMemoryScene extends BaseMinigameScene {
  private memorama!: MemoramaMechanic

  constructor() { super('WildlifeMemoryScene') }

  create() {
    const pairs: MemoryPairConfig[] = [
      { pairId: 'p1', a: { emoji: '🦋', label: 'Mariposa' }, b: { emoji: '🌸', label: 'Flores con néctar' } },
      { pairId: 'p2', a: { emoji: '🐦', label: 'Pájaro' }, b: { emoji: '🌳', label: 'Árbol con sombra' } },
      { pairId: 'p3', a: { emoji: '🐝', label: 'Abeja' }, b: { emoji: '🌻', label: 'Plantas aromáticas' } },
      { pairId: 'p4', a: { emoji: '🐕', label: 'Bolillo (perro)' }, b: { emoji: '💧', label: 'Agua y sombra' } },
    ]

    this.memorama = new MemoramaMechanic(this, pairs, {
      onMatch: (pairId) => {
        this.bridge.onItemCompleted?.(pairId, '¡Pareja encontrada!')
        this.bridge.onFeedback?.('¡Pareja encontrada!', true)
      },
      onMismatch: () => {
        this.bridge.onFeedback?.('No es pareja, intenta de nuevo', false)
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
