<template>
  <Transition
    @enter="onEnter"
    @leave="onLeave"
    :css="false"
  >
    <div v-if="visible" class="action-btn-wrap">
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

defineProps<{
  visible: boolean
}>()

function onEnter(el: Element, done: () => void) {
  gsap.fromTo(el,
    { y: 60, scale: 0.5, opacity: 0 },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.55)',
      onComplete: done,
    }
  )
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, {
    y: 30,
    scale: 0.7,
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: done,
  })
}
</script>

<style scoped>
.action-btn-wrap {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
}
</style>
