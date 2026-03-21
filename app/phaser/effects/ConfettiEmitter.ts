import Phaser from 'phaser'

const CONFETTI_EMOJIS = ['⭐', '🌟', '✨', '🎉', '💚', '🌱', '🌸', '🦋', '💫', '🎊']

/**
 * Burst of emoji confetti particles from center of screen.
 * Uses Phaser tweens (no particle plugin needed).
 */
export function confettiBurst(scene: Phaser.Scene, count = 20) {
  const cx = scene.scale.width / 2
  const cy = scene.scale.height / 2

  for (let i = 0; i < count; i++) {
    const emoji = CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]
    const text = scene.add.text(cx, cy, emoji, { fontSize: '20px' })
      .setOrigin(0.5)
      .setDepth(200)

    const angle = (i / count) * Math.PI * 2
    const distance = 80 + Math.random() * 120

    scene.tweens.add({
      targets: text,
      x: cx + Math.cos(angle) * distance,
      y: cy + Math.sin(angle) * distance - 40,
      scale: 1 + Math.random() * 0.5,
      alpha: 0,
      angle: Math.random() * 360,
      duration: 800 + Math.random() * 400,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    })
  }
}

/**
 * Burst confetti from a specific point.
 */
export function confettiBurstAt(scene: Phaser.Scene, x: number, y: number, count = 12) {
  for (let i = 0; i < count; i++) {
    const emoji = CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]
    const text = scene.add.text(x, y, emoji, { fontSize: '16px' })
      .setOrigin(0.5)
      .setDepth(200)

    const angle = (i / count) * Math.PI * 2
    const distance = 50 + Math.random() * 80

    scene.tweens.add({
      targets: text,
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance - 30,
      scale: 0.8 + Math.random() * 0.4,
      alpha: 0,
      angle: Math.random() * 360,
      duration: 600 + Math.random() * 300,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    })
  }
}
