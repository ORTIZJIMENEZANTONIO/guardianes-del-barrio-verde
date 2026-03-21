import Phaser from 'phaser'
import type { BaseMinigameScene } from '../BaseMinigameScene'
import type { DragItemConfig, DropZoneConfig } from '../types'

/**
 * Reusable drag-and-drop mechanic for Phaser minigames.
 * Creates draggable emoji items and drop zones with native Phaser input.
 */
export class DragDropMechanic {
  private scene: BaseMinigameScene
  private items: Map<string, Phaser.GameObjects.Container> = new Map()
  private zones: Map<string, Phaser.GameObjects.Zone> = new Map()
  private zoneGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private onDrop: (itemId: string, zoneId: string | null) => boolean
  private activeZoneId: string | null = null

  constructor(
    scene: BaseMinigameScene,
    items: DragItemConfig[],
    zones: DropZoneConfig[],
    onDrop: (itemId: string, zoneId: string | null) => boolean
  ) {
    this.scene = scene
    this.onDrop = onDrop
    this.createZones(zones)
    this.createItems(items)
    this.setupDragEvents()
  }

  private createZones(configs: DropZoneConfig[]) {
    const w = this.scene.scale.width
    const h = this.scene.scale.height

    for (const cfg of configs) {
      const zx = cfg.x * w
      const zy = cfg.y * h
      const zw = cfg.width * w
      const zh = cfg.height * h

      const zone = this.scene.add.zone(zx, zy, zw, zh)
        .setRectangleDropZone(zw, zh)
        .setData('zoneId', cfg.id)
      this.zones.set(cfg.id, zone)

      // Visual border (dashed via segments)
      const g = this.scene.add.graphics()
      g.lineStyle(3, 0x22c55e, 0.5)
      g.strokeRect(zx - zw / 2, zy - zh / 2, zw, zh)
      g.setDepth(1)
      this.zoneGraphics.set(cfg.id, g)

      // Label
      if (cfg.label) {
        this.scene.add.text(zx, zy - zh / 2 + 14, cfg.label, {
          fontSize: '11px',
          fontFamily: 'Nunito, sans-serif',
          fontStyle: '800',
          color: '#15803d',
          align: 'center',
        }).setOrigin(0.5).setDepth(2)
      }
    }
  }

  private createItems(configs: DragItemConfig[]) {
    const w = this.scene.scale.width
    const h = this.scene.scale.height

    for (const cfg of configs) {
      const ix = cfg.x * w
      const iy = cfg.y * h
      const container = this.scene.add.container(ix, iy)

      // White card background
      const bg = this.scene.add.graphics()
      bg.fillStyle(0xffffff, 1)
      bg.fillRoundedRect(-35, -35, 70, 70, 12)
      bg.lineStyle(3, 0xd1d5db, 1)
      bg.strokeRoundedRect(-35, -35, 70, 70, 12)
      container.add(bg)

      // Emoji
      const emoji = this.scene.add.text(0, -8, cfg.emoji, { fontSize: '28px' }).setOrigin(0.5)
      container.add(emoji)

      // Label
      const label = this.scene.add.text(0, 20, cfg.label, {
        fontSize: '9px',
        fontFamily: 'Nunito, sans-serif',
        fontStyle: '800',
        color: '#111827',
        align: 'center',
        wordWrap: { width: 60 },
      }).setOrigin(0.5)
      container.add(label)

      container.setSize(70, 70)
      container.setInteractive({ draggable: true, useHandCursor: true })
      container.setData('itemId', cfg.id)
      container.setData('originX', ix)
      container.setData('originY', iy)
      container.setDepth(10)

      this.items.set(cfg.id, container)
    }
  }

  private setupDragEvents() {
    this.scene.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container) => {
      gameObject.setDepth(100)
      this.scene.tweens.add({
        targets: gameObject,
        scale: 1.1,
        duration: 100,
        ease: 'Back.easeOut',
      })
      // Highlight zones
      this.zoneGraphics.forEach(g => {
        g.clear()
        const zone = this.zones.get([...this.zoneGraphics].find(([_, v]) => v === g)![0])!
        const b = zone.getBounds()
        g.lineStyle(3, 0x22c55e, 0.8)
        g.strokeRect(b.x, b.y, b.width, b.height)
        g.fillStyle(0x22c55e, 0.12)
        g.fillRect(b.x, b.y, b.width, b.height)
      })
    })

    this.scene.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container, dragX: number, dragY: number) => {
      gameObject.x = dragX
      gameObject.y = dragY
    })

    this.scene.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container) => {
      gameObject.setScale(1)
      const itemId = gameObject.getData('itemId') as string

      // Find which zone the item was dropped on
      let droppedZoneId: string | null = null
      for (const [zoneId, zone] of this.zones) {
        const bounds = zone.getBounds()
        if (bounds.contains(pointer.x, pointer.y)) {
          droppedZoneId = zoneId
          break
        }
      }

      const accepted = this.onDrop(itemId, droppedZoneId)

      if (accepted) {
        // Item accepted: shrink and destroy
        this.scene.tweens.add({
          targets: gameObject,
          scale: 0,
          alpha: 0,
          duration: 300,
          ease: 'Back.easeIn',
          onComplete: () => {
            gameObject.destroy()
            this.items.delete(itemId)
          },
        })
      } else {
        // Return to origin with bounce
        this.scene.tweens.add({
          targets: gameObject,
          x: gameObject.getData('originX'),
          y: gameObject.getData('originY'),
          duration: 400,
          ease: 'Back.easeOut',
        })
        gameObject.setDepth(10)
      }

      // Reset zone highlights
      this.resetZoneHighlights()
    })
  }

  private resetZoneHighlights() {
    for (const [zoneId, g] of this.zoneGraphics) {
      g.clear()
      const zone = this.zones.get(zoneId)!
      const b = zone.getBounds()
      g.lineStyle(3, 0x22c55e, 0.5)
      g.strokeRect(b.x, b.y, b.width, b.height)
    }
  }

  /** Remove an item programmatically */
  removeItem(id: string) {
    const item = this.items.get(id)
    if (item) {
      this.scene.tweens.add({
        targets: item,
        scale: 0,
        alpha: 0,
        duration: 300,
        ease: 'Back.easeIn',
        onComplete: () => item.destroy(),
      })
      this.items.delete(id)
    }
  }

  /** Get remaining item count */
  get remainingCount(): number {
    return this.items.size
  }

  destroy() {
    this.scene.input.off('dragstart')
    this.scene.input.off('drag')
    this.scene.input.off('dragend')
    this.items.forEach(item => item.destroy())
    this.zones.forEach(zone => zone.destroy())
    this.zoneGraphics.forEach(g => g.destroy())
    this.items.clear()
    this.zones.clear()
    this.zoneGraphics.clear()
  }
}
