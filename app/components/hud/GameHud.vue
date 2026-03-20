<template>
  <div class="game-hud">
    <div class="hud-left">
      <button class="hud-btn" @click="$emit('pause')">⏸</button>
      <div class="hud-chapter">
        {{ chapterTitle }}
      </div>
    </div>
    <div class="hud-right">
      <div class="hud-stat">
        <span class="hud-stat__icon">🌿</span>
        <span class="hud-stat__value">{{ playerStore.score }}</span>
      </div>
      <div class="hud-stat">
        <span class="hud-stat__icon">🌱</span>
        <span class="hud-stat__value">{{ playerStore.seeds }}</span>
      </div>
      <div class="hud-stat">
        <span class="hud-stat__icon">🏅</span>
        <span class="hud-stat__value">{{ playerStore.totalBadges }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores/usePlayerStore'

defineProps<{
  chapterTitle?: string
}>()

defineEmits<{
  pause: []
}>()

const playerStore = usePlayerStore()
</script>

<style scoped>
.game-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(27, 94, 59, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  z-index: 30;
}

.hud-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hud-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms var(--ease-spring);
}

.hud-btn:hover {
  background: rgba(255,255,255,0.25);
  transform: scale(1.1);
}

.hud-btn:active {
  transform: scale(0.9);
}

.hud-chapter {
  color: white;
  font-weight: 800;
  font-size: 14px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.hud-right {
  display: flex;
  gap: 10px;
}

.hud-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  transition: all 200ms ease;
}

.hud-stat:hover {
  background: rgba(255,255,255,0.2);
}

.hud-stat__icon {
  font-size: 15px;
}

.hud-stat__value {
  color: white;
  font-weight: 800;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
</style>
