import { BaseMinigameScene } from '../../BaseMinigameScene'
import { confettiBurst } from '../../effects/ConfettiEmitter'

interface GridCell {
  id: string
  type: 'fixed' | 'leak'
  needsPiece: string | null
  pipeEmoji: string | null
}

interface PipePiece {
  id: string
  name: string
  emoji: string
  pipeType: string
}

export class LeakFixerScene extends BaseMinigameScene {
  private placed = 0
  private readonly total = 5
  private selectedPieceId: string | null = null

  constructor() { super('LeakFixerScene') }

  create() {
    this.placed = 0
    this.selectedPieceId = null

    const w = this.scale.width
    const h = this.scale.height

    const gridCells: GridCell[] = [
      { id: 'g0', type: 'fixed', needsPiece: null, pipeEmoji: '🔵' },
      { id: 'g1', type: 'leak', needsPiece: 'straight', pipeEmoji: null },
      { id: 'g2', type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
      { id: 'g3', type: 'leak', needsPiece: 'elbow', pipeEmoji: null },
      { id: 'g4', type: 'fixed', needsPiece: null, pipeEmoji: '⬇️' },
      { id: 'g5', type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
      { id: 'g6', type: 'leak', needsPiece: 'tee', pipeEmoji: null },
      { id: 'g7', type: 'fixed', needsPiece: null, pipeEmoji: '⬇️' },
      { id: 'g8', type: 'leak', needsPiece: 'valve', pipeEmoji: null },
      { id: 'g9', type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
      { id: 'g10', type: 'fixed', needsPiece: null, pipeEmoji: '➡️' },
      { id: 'g11', type: 'leak', needsPiece: 'cap', pipeEmoji: null },
    ]

    const pieces: PipePiece[] = [
      { id: 'pc1', name: 'Tubo recto', emoji: '🔧', pipeType: 'straight' },
      { id: 'pc2', name: 'Codo', emoji: '↪️', pipeType: 'elbow' },
      { id: 'pc3', name: 'Conector T', emoji: '🔩', pipeType: 'tee' },
      { id: 'pc4', name: 'Válvula', emoji: '🚰', pipeType: 'valve' },
      { id: 'pc5', name: 'Tapón', emoji: '🔴', pipeType: 'cap' },
    ]

    // Grid layout: 4 cols x 3 rows, centered
    const cols = 4
    const cellSize = 65
    const gap = 8
    const gridW = cols * cellSize + (cols - 1) * gap
    const gridH = 3 * cellSize + 2 * gap
    const gridStartX = (w - gridW) / 2 + cellSize / 2
    const gridStartY = (h - gridH) / 2 - 20 + cellSize / 2

    const cellContainers: Map<string, { container: Phaser.GameObjects.Container; cell: GridCell; bg: Phaser.GameObjects.Graphics; emoji: Phaser.GameObjects.Text }> = new Map()

    gridCells.forEach((cell, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const cx = gridStartX + col * (cellSize + gap)
      const cy = gridStartY + row * (cellSize + gap)

      const container = this.add.container(cx, cy).setDepth(10)
      const bg = this.add.graphics()

      if (cell.type === 'fixed') {
        bg.fillStyle(0xffffff, 0.4)
        bg.fillRoundedRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize, 8)
      } else {
        bg.fillStyle(0xf94144, 0.2)
        bg.fillRoundedRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize, 8)
        bg.lineStyle(2, 0xf94144, 1)
        bg.strokeRoundedRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize, 8)
      }
      container.add(bg)

      const emojiText = this.add.text(0, 0, cell.pipeEmoji ?? '💧', { fontSize: '28px' }).setOrigin(0.5)
      container.add(emojiText)

      if (cell.type === 'leak') {
        container.setSize(cellSize, cellSize)
        container.setInteractive({ useHandCursor: true })
        container.on('pointerdown', () => this.tryPlaceInCell(cell, container, bg, emojiText, cellSize))
      }

      cellContainers.set(cell.id, { container, cell, bg, emoji: emojiText })
    })

    // Piece tray at bottom
    const trayY = h - 50
    const pieceW = 60
    const totalTrayW = pieces.length * pieceW + (pieces.length - 1) * 10
    const trayStartX = (w - totalTrayW) / 2 + pieceW / 2
    const usedPieces = new Set<string>()

    const pieceContainers: Map<string, Phaser.GameObjects.Container> = new Map()
    let selectionRing: Phaser.GameObjects.Graphics | null = null

    pieces.forEach((piece, i) => {
      const px = trayStartX + i * (pieceW + 10)
      const container = this.add.container(px, trayY).setDepth(15)

      const bg = this.add.graphics()
      bg.fillStyle(0xffffff, 1)
      bg.fillRoundedRect(-28, -28, 56, 56, 10)
      bg.lineStyle(2, 0x3b82f6, 1)
      bg.strokeRoundedRect(-28, -28, 56, 56, 10)
      container.add(bg)

      const emoji = this.add.text(0, -5, piece.emoji, { fontSize: '22px' }).setOrigin(0.5)
      container.add(emoji)

      const label = this.add.text(0, 16, piece.name, {
        fontSize: '8px', fontFamily: 'Nunito, sans-serif', fontStyle: '800',
        color: '#111827', align: 'center', wordWrap: { width: 52 },
      }).setOrigin(0.5)
      container.add(label)

      container.setSize(56, 56)
      container.setInteractive({ useHandCursor: true })

      container.on('pointerdown', () => {
        if (usedPieces.has(piece.id)) return
        this.selectedPieceId = piece.id

        // Update selection ring
        if (selectionRing) selectionRing.destroy()
        selectionRing = this.add.graphics()
        selectionRing.lineStyle(3, 0x8b5cf6, 1)
        selectionRing.strokeRoundedRect(px - 32, trayY - 32, 64, 64, 12)
        selectionRing.setDepth(16)

        // Scale up selected
        pieceContainers.forEach((pc, pid) => {
          this.tweens.add({ targets: pc, scale: pid === piece.id ? 1.15 : 1, duration: 100 })
        })
      })

      pieceContainers.set(piece.id, container)
    })

    // Store refs for tryPlaceInCell
    this._pieces = pieces
    this._usedPieces = usedPieces
    this._pieceContainers = pieceContainers
    this._selectionRing = () => selectionRing
    this._setSelectionRing = (v: any) => { selectionRing = v }
  }

  private _pieces: PipePiece[] = []
  private _usedPieces = new Set<string>()
  private _pieceContainers = new Map<string, Phaser.GameObjects.Container>()
  private _selectionRing: () => Phaser.GameObjects.Graphics | null = () => null
  private _setSelectionRing: (v: any) => void = () => {}

  private tryPlaceInCell(cell: GridCell, container: Phaser.GameObjects.Container, bg: Phaser.GameObjects.Graphics, emojiText: Phaser.GameObjects.Text, cellSize: number) {
    if (!this.selectedPieceId || cell.type !== 'leak' || cell.pipeEmoji) return

    const piece = this._pieces.find(p => p.id === this.selectedPieceId)
    if (!piece) return

    if (piece.pipeType === cell.needsPiece) {
      cell.pipeEmoji = piece.emoji
      cell.type = 'fixed' as any
      emojiText.setText(piece.emoji)
      bg.clear()
      bg.fillStyle(0x52b788, 0.4)
      bg.fillRoundedRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize, 8)
      bg.lineStyle(2, 0x22c55e, 1)
      bg.strokeRoundedRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize, 8)

      this._usedPieces.add(piece.id)
      const pc = this._pieceContainers.get(piece.id)
      if (pc) {
        this.tweens.add({ targets: pc, alpha: 0.3, scale: 0.9, duration: 200 })
        pc.disableInteractive()
      }

      this.placed++
      this.selectedPieceId = null
      const ring = this._selectionRing()
      if (ring) { ring.destroy(); this._setSelectionRing(null) }

      this.celebrateItem(container)
      container.disableInteractive()
      this.bridge.onItemCompleted?.(cell.id, '¡Pieza correcta!')
      this.bridge.onFeedback?.('¡Pieza correcta!', true)

      if (this.placed >= this.total) {
        confettiBurst(this, 20)
        this.bridge.onAllCompleted?.()
      }
    } else {
      this.shakeItem(container)
      this.bridge.onFeedback?.('Esa pieza no encaja aquí.', false)
    }
  }

  startGame() {}
}
