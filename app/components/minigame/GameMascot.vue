<template>
  <div v-if="characterId" ref="mascotRef" class="game-mascot" :class="mascotClass">
    <div class="mascot-face">
      <CharacterFace
        :character-id="characterId"
        :emotion="currentEmotion"
        :is-speaking="false"
      />
    </div>
    <Transition name="mascot-bubble">
      <div v-if="bubble" class="mascot-bubble">{{ bubble }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Emotion } from '~/shared/types/character'
import { useGameAnimations } from '~/composables/useGameAnimations'

const { shakeWrong, celebrateSuccess } = useGameAnimations()

const props = withDefaults(defineProps<{
  characterId: string
  progress: number // 0 to 1
  lastResult?: 'ok' | 'error' | null
  streak?: number
}>(), {
  lastResult: null,
  streak: 0,
})

const mascotRef = ref<HTMLElement | null>(null)
const bubble = ref<string | null>(null)
let bubbleTimer: ReturnType<typeof setTimeout> | undefined

const currentEmotion = computed<Emotion>(() => {
  // React to immediate result first
  if (props.lastResult === 'error') return 'worried'
  if (props.streak >= 5) return 'excited'
  if (props.streak >= 3) return 'happy'

  // Then progress-based
  if (props.progress >= 1) return 'proud'
  if (props.progress >= 0.75) return 'excited'
  if (props.progress >= 0.5) return 'happy'
  if (props.progress >= 0.25) return 'neutral'
  return 'thinking'
})

const mascotClass = computed(() => ({
  'game-mascot--error': props.lastResult === 'error',
  'game-mascot--fire': props.streak >= 3,
}))

function showBubble(msg: string, duration = 2000) {
  bubble.value = msg
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => { bubble.value = null }, duration)
}

// React to result changes
watch(() => props.lastResult, (result) => {
  if (!mascotRef.value) return
  if (result === 'ok') {
    celebrateSuccess(mascotRef.value)
    if (props.streak >= 3) showBubble('🔥')
  } else if (result === 'error') {
    shakeWrong(mascotRef.value)
    showBubble('💪', 1500)
  }
})

// React to progress milestones
watch(() => props.progress, (p, prev) => {
  if (prev < 0.5 && p >= 0.5) showBubble('¡Vas bien!')
  if (prev < 0.75 && p >= 0.75) showBubble('¡Casi!')
  if (prev < 1 && p >= 1) showBubble('🎉')
})

onUnmounted(() => clearTimeout(bubbleTimer))
</script>

<style scoped>
.game-mascot {
  position: absolute;
  bottom: 8px;
  left: 8px;
  z-index: 15;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  transition: transform 0.3s var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1));
}

.game-mascot--fire {
  filter: drop-shadow(0 0 6px rgba(249, 115, 22, 0.5));
}

.mascot-face {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--glass-bg-strong, rgba(255,255,255,0.85));
  border: 2px solid rgba(255,255,255,0.6);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  flex-shrink: 0;
}

.mascot-bubble {
  padding: 3px 8px;
  background: var(--glass-bg-strong, rgba(255,255,255,0.9));
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text, #1e293b);
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Bubble transition */
.mascot-bubble-enter-active { animation: popIn 0.3s ease forwards; }
.mascot-bubble-leave-active { transition: all 0.2s ease; }
.mascot-bubble-leave-to { opacity: 0; transform: scale(0.7) translateY(4px); }
</style>
