import { BaseMinigameScene } from '../../BaseMinigameScene'
import { MemoramaMechanic } from '../../mechanics/MemoramaMechanic'
import { confettiBurst } from '../../effects/ConfettiEmitter'
import type { MemoryPairConfig } from '../../types'

export class SoilMemoryScene extends BaseMinigameScene {
  private memorama!: MemoramaMechanic

  constructor() { super('SoilMemoryScene') }

  create() {
    const pairs: MemoryPairConfig[] = [
      { pairId: 'p1', a: { emoji: '🪨', label: 'Suelo compacto' }, b: { emoji: '🔨', label: 'Aflojar tierra' } },
      { pairId: 'p2', a: { emoji: '🗑️', label: 'Basura enterrada' }, b: { emoji: '🧹', label: 'Limpiar residuos' } },
      { pairId: 'p3', a: { emoji: '🏜️', label: 'Tierra seca' }, b: { emoji: '💧', label: 'Agregar agua' } },
      { pairId: 'p4', a: { emoji: '🪹', label: 'Sin nutrientes' }, b: { emoji: '🌿', label: 'Añadir composta' } },
    ]

    this.memorama = new MemoramaMechanic(this, pairs, {
      onMatch: (pairId) => {
        this.bridge.onItemCompleted?.(pairId, '¡Pareja encontrada!')
        this.bridge.onFeedback?.('¡Pareja encontrada!', true)
      },
      onMismatch: () => {
        this.bridge.onFeedback?.('No son pareja, intenta de nuevo', false)
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
