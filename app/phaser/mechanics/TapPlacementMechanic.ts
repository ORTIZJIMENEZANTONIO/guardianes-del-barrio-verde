import Phaser from 'phaser'
import type { BaseMinigameScene } from '../BaseMinigameScene'
import type { TrayItemConfig, PlacementZoneConfig } from '../types'

/**
 * Reusable tap-to-place mechanic.
 * Player selects an item from a tray, then taps a zone to place it.
 */
export class TapPlacementMechanic {
  private scene: BaseMinigameScene
  private trayItems: Map<string, Phaser.GameObjects.Container> = new Map()
  private zones: Map<string, Phaser.GameObjects.Container> = new Map()
  private selectedItemId: string | null = null
  private onPlace: (itemId: string, zoneId: string) => boolean
  private selectionHighlight: Phaser.GameObjects.Graphics | null = null

  constructor(
    scene: BaseMinigameScene,
    items: TrayItemConfig[],
    zones: PlacementZoneConfig[],
    onPlace: (itemId: string, zoneId: string) => boolean
  ) {
    this.scene = scene
    this.onPlace = onPlace
    this.createZones(zones)
    this.createTray(items)
  }

  private createTray(items: TrayItemConfig[]) {
    const w = this.scene.scale.width
    const h = this.scene.scale.height
    const trayY = h - 55
    const itemW = 64
    const totalW = items.length * itemW + (items.length - 1) * 10
    const startX = (w - totalW) / 2 + itemW / 2

    // Tray background
    const trayBg = this.scene.add.graphics()
    trayBg.fillStyle(0xffffff, 0.9)
    trayBg.fillRoundedRect(startX - itemW / 2 - 12, trayY - itemW / 2 - 8, totalW + 24, itemW + 16, 16)
    trayBg.setDepth(14)

    items.forEach((item, i) => {
      const x = startX + i * (itemW + 10)
      const container = this.scene.add.container(x, trayY).setDepth(15)

      const bg = this.scene.add.graphics()
      bg.fillStyle(0xffffff, 1)
      bg.fillRoundedRect(-30, -30, 60, 60, 10)
      bg.lineStyle(2, 0xd1d5db, 1)
      bg.strokeRoundedRect(-30, -30, 60, 60, 10)
      container.add(bg)

      const emoji = this.scene.add.text(0, -5, item.emoji, { fontSize: '24px' }).setOrigin(0.5)
      container.add(emoji)

      const label = this.scene.add.text(0, 18, item.label, {
        fontSize: '8px',
        fontFamily: 'Nunito, sans-serif',
        fontStyle: '800',
        color: '#111827',
        align: 'center',
        wordWrap: { width: 56 },
      }).setOrigin(0.5)
      container.add(label)

      container.setSize(60, 60)
      container.setInteractive({ useHandCursor: true })
      container.on('pointerdown', () => this.selectItem(item.id))
      container.setData('itemId', item.id)
      container.setData('bg', bg)

      this.trayItems.set(item.id, container)
    })
  }

  private createZones(zones: PlacementZoneConfig[]) {
    const w = this.scene.scale.width
    const h = this.scene.scale.height

    for (const cfg of zones) {
      const x = cfg.x * w
      const y = cfg.y * h
      const container = this.scene.add.container(x, y).setDepth(8)

      // Pulsing circle zone
      const circle = this.scene.add.graphics()
      circle.lineStyle(2, 0x22c55e, 0.6)
      circle.strokeCircle(0, 0, 25)
      circle.fillStyle(0x22c55e, 0.1)
      circle.fillCircle(0, 0, 25)
      container.add(circle)

      // Pulse animation
      this.scene.tweens.add({
        targets: circle,
        scale: 1.15,
        alpha: 0.5,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      container.setSize(50, 50)
      container.setInteractive({ useHandCursor: true })
      container.setData('zoneId', cfg.id)
      container.on('pointerdown', () => this.tapZone(cfg.id))

      this.zones.set(cfg.id, container)
    }
  }

  private selectItem(id: string) {
    // Deselect previous
    if (this.selectedItemId) {
      const prev = this.trayItems.get(this.selectedItemId)
      if (prev) {
        this.scene.tweens.add({ targets: prev, scale: 1, duration: 150, ease: 'Back.easeOut' })
      }
    }

    // Remove old highlight
    if (this.selectionHighlight) {
      this.selectionHighlight.destroy()
      this.selectionHighlight = null
    }

    this.selectedItemId = id
    const item = this.trayItems.get(id)
    if (item) {
      this.scene.tweens.add({ targets: item, scale: 1.15, duration: 150, ease: 'Back.easeOut' })

      // Draw selection ring
      this.selectionHighlight = this.scene.add.graphics()
      this.selectionHighlight.lineStyle(3, 0x8b5cf6, 1)
      this.selectionHighlight.strokeRoundedRect(
        item.x - 34, item.y - 34, 68, 68, 12
      )
      this.selectionHighlight.setDepth(16)
    }
  }

  private tapZone(zoneId: string) {
    if (!this.selectedItemId) return

    const accepted = this.onPlace(this.selectedItemId, zoneId)
    const zone = this.zones.get(zoneId)

    if (accepted) {
      // Place item: show emoji at zone + remove from tray
      const trayItem = this.trayItems.get(this.selectedItemId)
      if (trayItem && zone) {
        // Create placed emoji at zone
        const itemId = this.selectedItemId
        const emojiText = trayItem.list.find(
          (child: any) => child.type === 'Text' && child.style?.fontSize === '24px'
        ) as Phaser.GameObjects.Text | undefined

        if (emojiText) {
          const placed = this.scene.add.text(zone.x, zone.y, emojiText.text, { fontSize: '28px' })
            .setOrigin(0.5)
            .setDepth(9)
            .setScale(0)

          this.scene.tweens.add({
            targets: placed,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut',
          })
        }

        // Remove from tray
        this.scene.tweens.add({
          targets: trayItem,
          scale: 0,
          alpha: 0,
          duration: 200,
          ease: 'Back.easeIn',
          onComplete: () => {
            trayItem.destroy()
            this.trayItems.delete(itemId)
          },
        })

        // Hide zone
        this.scene.tweens.add({
          targets: zone,
          alpha: 0,
          duration: 300,
          onComplete: () => zone.disableInteractive(),
        })
      }

      // Clean up selection
      if (this.selectionHighlight) {
        this.selectionHighlight.destroy()
        this.selectionHighlight = null
      }
      this.selectedItemId = null
      this.scene.celebrateItem(zone!)
    } else {
      if (zone) this.scene.shakeItem(zone)
    }
  }

  destroy() {
    this.trayItems.forEach(item => item.destroy())
    this.zones.forEach(zone => zone.destroy())
    if (this.selectionHighlight) this.selectionHighlight.destroy()
    this.trayItems.clear()
    this.zones.clear()
  }
}
