<template>
  <Transition name="streak-pop">
    <div v-if="streak >= 2" class="streak-badge" :class="badgeClass">
      <span class="streak-fire">{{ fireEmoji }}</span>
      <span class="streak-count">{{ streak }}</span>
      <span v-if="streak >= 3 && label" class="streak-label">{{ label }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  streak: number
  label?: string
}>()

const badgeClass = computed(() => {
  if (props.streak >= 7) return 'streak-badge--legendary'
  if (props.streak >= 5) return 'streak-badge--fire'
  if (props.streak >= 3) return 'streak-badge--hot'
  return ''
})

const fireEmoji = computed(() => {
  if (props.streak >= 7) return '⭐'
  if (props.streak >= 5) return '🔥🔥'
  if (props.streak >= 3) return '🔥'
  return '✨'
})
</script>

<style scoped>
.streak-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(234, 88, 12, 0.9));
  color: white;
  font-weight: 800;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
  animation: streakPulse 0.6s ease infinite alternate;
  white-space: nowrap;
  z-index: 20;
}

.streak-badge--hot {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(249, 115, 22, 0.9));
  box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);
}

.streak-badge--fire {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.95), rgba(239, 68, 68, 0.9));
  box-shadow: 0 2px 16px rgba(220, 38, 38, 0.6);
  font-size: 14px;
}

.streak-badge--legendary {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(236, 72, 153, 0.9));
  box-shadow: 0 2px 20px rgba(168, 85, 247, 0.6);
  font-size: 15px;
}

.streak-fire { font-size: 16px; }
.streak-count { font-size: inherit; }

.streak-label {
  font-size: 10px;
  font-weight: 700;
  opacity: 0.9;
}

@keyframes streakPulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

/* Transition */
.streak-pop-enter-active {
  animation: popIn 0.4s var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) forwards;
}
.streak-pop-leave-active {
  transition: all 0.2s ease;
}
.streak-pop-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
