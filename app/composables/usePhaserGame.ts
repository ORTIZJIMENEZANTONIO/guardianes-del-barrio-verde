import type { ShallowRef } from 'vue'

export interface PhaserGameOptions {
  /** Scene class (must extend Phaser.Scene) */
  sceneClass: any
  /** Optional Phaser config overrides */
  config?: Record<string, any>
}

/**
 * Mounts a Phaser game inside a container ref.
 * Lazy-imports Phaser to keep it out of the initial bundle (~300KB).
 * Destroys the game on component unmount.
 */
export function usePhaserGame(
  containerRef: Readonly<ShallowRef<HTMLElement | null>>,
  options: PhaserGameOptions
) {
  const game = shallowRef<any>(null)
  const scene = shallowRef<any>(null)
  const ready = ref(false)
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null

  onMounted(async () => {
    if (!containerRef.value) return

    const Phaser = await import('phaser')

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.value,
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: containerRef.value.clientWidth || 400,
        height: containerRef.value.clientHeight || 600,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: options.sceneClass,
      audio: { noAudio: true },
      input: {
        touch: { capture: true },
      },
      render: {
        antialias: true,
        roundPixels: true,
      },
      ...options.config,
    }

    game.value = new Phaser.Game(config)

    // Wait for scene to be ready
    game.value.events.once('ready', () => {
      scene.value = game.value!.scene.getScene(options.sceneClass)
      ready.value = true
    })

    // Fallback: grab scene after a short delay if 'ready' doesn't fire
    fallbackTimer = setTimeout(() => {
      if (!scene.value && game.value) {
        const scenes = game.value.scene.getScenes(true)
        if (scenes.length > 0) {
          scene.value = scenes[0]
          ready.value = true
        }
      }
    }, 200)
  })

  onUnmounted(() => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    if (game.value) {
      game.value.destroy(true)
      game.value = null
      scene.value = null
      ready.value = false
    }
  })

  return { game, scene, ready }
}
