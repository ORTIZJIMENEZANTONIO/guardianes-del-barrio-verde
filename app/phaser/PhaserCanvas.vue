<template>
  <div ref="containerRef" class="phaser-canvas" />
</template>

<script setup lang="ts">
import { usePhaserGame } from '~/composables/usePhaserGame'
import type { MinigameBridge } from '~/phaser/types'

const props = defineProps<{
  /** The Phaser.Scene class to instantiate */
  sceneClass: any
  /** Callbacks bridge: Phaser → Vue */
  bridge: MinigameBridge
}>()

const containerRef = ref<HTMLElement | null>(null)

const { game, scene, ready } = usePhaserGame(containerRef, {
  sceneClass: props.sceneClass,
})

// Pass bridge to scene once ready
watch(ready, (isReady) => {
  if (isReady && scene.value && typeof scene.value.setBridge === 'function') {
    scene.value.setBridge(props.bridge)
    scene.value.startGame?.()
  }
})

// Update bridge if props change
watch(() => props.bridge, (newBridge) => {
  if (scene.value && typeof scene.value.setBridge === 'function') {
    scene.value.setBridge(newBridge)
  }
}, { deep: true })

defineExpose({ game, scene })
</script>

<style scoped>
.phaser-canvas {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: auto;
}

.phaser-canvas :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
