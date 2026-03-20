<template>
  <div class="choice-panel animate-slide-up">
    <button
      v-for="(choice, i) in choices"
      :key="choice.id"
      class="choice-btn"
      :style="{ animationDelay: `${i * 80}ms` }"
      @click="$emit('select', choice)"
    >
      <span class="choice-arrow">▸</span>
      <span class="choice-text">{{ choice.text }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { DialogueChoice } from '~/shared/types/character'

defineProps<{
  choices: DialogueChoice[]
}>()

defineEmits<{
  select: [choice: DialogueChoice]
}>()
</script>

<style scoped>
.choice-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
}

.choice-btn {
  width: 100%;
  padding: 14px 20px;
  background: white;
  border: 2px solid var(--color-green-mid);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-green-dark);
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  transition:
    transform 300ms var(--ease-spring),
    box-shadow 300ms var(--ease-out),
    background 200ms ease,
    border-color 200ms ease;
  box-shadow: var(--shadow-sm);
  opacity: 0;
  animation: slideUp 300ms var(--ease-out) forwards;
}

.choice-arrow {
  font-size: 18px;
  color: var(--color-green-mid);
  transition: transform 300ms var(--ease-spring), color 200ms ease;
}

.choice-text {
  flex: 1;
}

.choice-btn:hover {
  transform: translateX(6px) scale(1.02);
  border-color: var(--color-green-dark);
  background: var(--color-green-bg);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--color-green-light);
}

.choice-btn:hover .choice-arrow {
  transform: translateX(4px);
  color: var(--color-green-dark);
}

.choice-btn:active {
  transform: translateX(3px) scale(0.98);
  background: var(--color-green-dark);
  color: white;
  border-color: var(--color-green-dark);
  transition-duration: 80ms;
}

.choice-btn:active .choice-arrow {
  color: white;
}

@media (hover: none) {
  .choice-btn:hover {
    transform: none;
    background: white;
    border-color: var(--color-green-mid);
    box-shadow: var(--shadow-sm);
  }
  .choice-btn:hover .choice-arrow {
    transform: none;
    color: var(--color-green-mid);
  }
}
</style>
