import Phaser from 'phaser'
import type { BaseMinigameScene } from '../BaseMinigameScene'
import type { MemoryPairConfig } from '../types'

interface CardData {
  id: string
  pairId: string
  emoji: string
  label: string
  container: Phaser.GameObjects.Container
  backGroup: Phaser.GameObjects.Container
  frontGroup: Phaser.GameObjects.Container
  flipped: boolean
  matched: boolean
}

/**
 * Reusable memorama (memory match) mechanic.
 * Uses scaleX tween for flip animation (better than CSS rotateY on Android).
 */
export class MemoramaMechanic {
  private scene: BaseMinigameScene
  private cards: Map<string, CardData> = new Map()
  private flippedIds: string[] = []
  private lockBoard = false
  private matchedCount = 0
  private totalPairs: number
  private onMatch: (pairId: string) => void
  private onMismatch: () => void
  private onAllMatched: () => void

  constructor(
    scene: BaseMinigameScene,
    pairs: MemoryPairConfig[],
    callbacks: {
      onMatch: (pairId: string) => void
      onMismatch: () => void
      onAllMatched: () => void
    }
  ) {
    this.scene = scene
    this.totalPairs = pairs.length
    this.onMatch = callbacks.onMatch
    this.onMismatch = callbacks.onMismatch
    this.onAllMatched = callbacks.onAllMatched
    this.createCards(pairs)
  }

  private createCards(pairs: MemoryPairConfig[]) {
    // Build deck from pairs
    const deck: { id: string; pairId: string; emoji: string; label: string }[] = []
    for (const pair of pairs) {
      deck.push({ id: `${pair.pairId}-a`, pairId: pair.pairId, emoji: pair.a.emoji, label: pair.a.label })
      deck.push({ id: `${pair.pairId}-b`, pairId: pair.pairId, emoji: pair.b.emoji, label: pair.b.label })
    }

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]
    }

    // Layout grid
    const cardW = 80
    const cardH = 80
    const gap = 10
    const cols = 4
    const rows = Math.ceil(deck.length / cols)
    const totalW = cols * cardW + (cols - 1) * gap
    const totalH = rows * cardH + (rows - 1) * gap
    const startX = (this.scene.scale.width - totalW) / 2 + cardW / 2
    const startY = (this.scene.scale.height - totalH) / 2 + cardH / 2

    deck.forEach((card, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = startX + col * (cardW + gap)
      const y = startY + row * (cardH + gap)
      this.createCard(card.id, card.pairId, card.emoji, card.label, x, y, cardW, cardH)
    })
  }

  private createCard(
    id: string, pairId: string, emoji: string, label: string,
    x: number, y: number, w: number, h: number
  ) {
    const container = this.scene.add.container(x, y).setDepth(10)

    // --- Back group (visible initially) ---
    const backGroup = this.scene.add.container(0, 0)
    const backBg = this.scene.add.graphics()
    backBg.fillStyle(0x52b788, 1)
    backBg.fillRoundedRect(-w / 2, -h / 2, w, h, 12)
    backBg.lineStyle(2, 0xffffff, 0.3)
    backBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12)
    backGroup.add(backBg)

    const backEmoji = this.scene.add.text(0, 0, '🌱', { fontSize: '28px' }).setOrigin(0.5)
    backGroup.add(backEmoji)
    container.add(backGroup)

    // --- Front group (hidden: scaleX = 0) ---
    const frontGroup = this.scene.add.container(0, 0)
    const frontBg = this.scene.add.graphics()
    frontBg.fillStyle(0xffffff, 0.95)
    frontBg.fillRoundedRect(-w / 2, -h / 2, w, h, 12)
    frontBg.lineStyle(2, 0x000000, 0.1)
    frontBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12)
    frontGroup.add(frontBg)

    const frontEmoji = this.scene.add.text(0, -8, emoji, { fontSize: '26px' }).setOrigin(0.5)
    frontGroup.add(frontEmoji)

    const frontLabel = this.scene.add.text(0, 22, label, {
      fontSize: '9px',
      fontFamily: 'Nunito, sans-serif',
      fontStyle: '800',
      color: '#111827',
      align: 'center',
      wordWrap: { width: w - 10 },
    }).setOrigin(0.5)
    frontGroup.add(frontLabel)

    frontGroup.setScale(0, 1) // Hidden
    container.add(frontGroup)

    // Interactive
    container.setSize(w, h)
    container.setInteractive({ useHandCursor: true })
    container.on('pointerdown', () => this.flipCard(id))

    this.cards.set(id, {
      id, pairId, emoji, label,
      container, backGroup, frontGroup,
      flipped: false, matched: false,
    })
  }

  private flipCard(id: string) {
    if (this.lockBoard) return
    const card = this.cards.get(id)
    if (!card || card.flipped || card.matched) return
    if (this.flippedIds.length >= 2) return

    card.flipped = true
    this.flippedIds.push(id)

    // Animate: back → 0, then front 0 → 1
    this.scene.tweens.add({
      targets: card.backGroup,
      scaleX: 0,
      duration: 150,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.scene.tweens.add({
          targets: card.frontGroup,
          scaleX: 1,
          duration: 150,
          ease: 'Sine.easeOut',
        })
      },
    })

    if (this.flippedIds.length === 2) {
      this.scene.time.delayedCall(200, () => this.checkMatch())
    }
  }

  private checkMatch() {
    this.lockBoard = true
    const [id1, id2] = this.flippedIds
    const card1 = this.cards.get(id1)!
    const card2 = this.cards.get(id2)!

    if (card1.pairId === card2.pairId) {
      // Match
      card1.matched = true
      card2.matched = true
      this.matchedCount++

      // Success glow
      this.scene.celebrateItem(card1.container)
      this.scene.celebrateItem(card2.container)

      // Add green glow to matched cards
      for (const card of [card1, card2]) {
        const glow = this.scene.add.graphics()
        glow.lineStyle(3, 0x52b788, 0.8)
        glow.strokeRoundedRect(-42, -42, 84, 84, 14)
        card.container.add(glow)
      }

      this.flippedIds = []
      this.lockBoard = false
      this.onMatch(card1.pairId)

      if (this.matchedCount >= this.totalPairs) {
        this.scene.time.delayedCall(400, () => this.onAllMatched())
      }
    } else {
      // No match
      this.scene.shakeItem(card1.container)
      this.scene.shakeItem(card2.container)
      this.onMismatch()

      this.scene.time.delayedCall(1000, () => {
        this.unflipCard(id1)
        this.unflipCard(id2)
        this.flippedIds = []
        this.lockBoard = false
      })
    }
  }

  private unflipCard(id: string) {
    const card = this.cards.get(id)
    if (!card) return
    card.flipped = false

    this.scene.tweens.add({
      targets: card.frontGroup,
      scaleX: 0,
      duration: 150,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.scene.tweens.add({
          targets: card.backGroup,
          scaleX: 1,
          duration: 150,
          ease: 'Sine.easeOut',
        })
      },
    })
  }

  get matched(): number {
    return this.matchedCount
  }

  destroy() {
    this.cards.forEach(card => card.container.destroy())
    this.cards.clear()
  }
}
