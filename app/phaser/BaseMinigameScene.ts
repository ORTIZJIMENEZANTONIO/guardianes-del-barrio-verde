import Phaser from 'phaser'
import type { MinigameBridge } from './types'

/**
 * Base scene for all Phaser minigames.
 * Provides event bridge, emoji helpers, and common animations.
 */
export class BaseMinigameScene extends Phaser.Scene {
  protected bridge: MinigameBridge = {}

  constructor(key: string) {
    super({ key })
  }

  /** Connect Vue ↔ Phaser via callbacks */
  setBridge(bridge: MinigameBridge) {
    this.bridge = bridge
  }

  // --- Helpers ---

  /** Create an emoji text game object centered at (x, y) */
  createEmoji(x: number, y: number, emoji: string, size = 32): Phaser.GameObjects.Text {
    return this.add.text(x, y, emoji, { fontSize: `${size}px` }).setOrigin(0.5)
  }

  /** Create a text label with Nunito font */
  createLabel(
    x: number,
    y: number,
    text: string,
    size = 12,
    color = '#111827'
  ): Phaser.GameObjects.Text {
    return this.add.text(x, y, text, {
      fontSize: `${size}px`,
      fontFamily: 'Nunito, sans-serif',
      fontStyle: '800',
      color,
      align: 'center',
    }).setOrigin(0.5)
  }

  /** Create a rounded-rect card background */
  createCardBg(
    x: number,
    y: number,
    w: number,
    h: number,
    fill = 0xffffff,
    stroke = 0xd1d5db,
    radius = 12
  ): Phaser.GameObjects.Graphics {
    const g = this.add.graphics()
    g.fillStyle(fill, 1)
    g.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius)
    g.lineStyle(3, stroke, 1)
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius)
    return g
  }

  // --- Animations ---

  /** Success bounce */
  celebrateItem(target: Phaser.GameObjects.GameObject) {
    this.tweens.add({
      targets: target,
      scale: 1.3,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut',
    })
  }

  /** Error shake */
  shakeItem(target: Phaser.GameObjects.GameObject & { x: number }) {
    const startX = target.x
    this.tweens.add({
      targets: target,
      x: startX - 10,
      duration: 50,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
      onComplete: () => { target.x = startX },
    })
  }

  /** Camera shake for big events */
  cameraShake(intensity = 0.008, duration = 200) {
    this.cameras.main.shake(duration, intensity)
  }
}
