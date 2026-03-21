<template>
  <Modal :show="show" :closable="false" size="sm">
    <div ref="popupRef" class="reward-popup">
      <div ref="confettiRef" class="reward-confetti" />
      <div class="reward-popup__header">
        <span ref="starRef" class="reward-popup__star">⭐</span>
        <h2 ref="titleRef" class="reward-popup__title">{{ title }}</h2>
      </div>

      <div class="reward-popup__items">
        <div v-if="points" ref="item1Ref" class="reward-item">
          <span class="reward-item__icon">🌿</span>
          <span class="reward-item__text">+{{ points }} puntos verdes</span>
        </div>
        <div v-if="seeds" ref="item2Ref" class="reward-item">
          <span class="reward-item__icon">🌱</span>
          <span class="reward-item__text">+{{ seeds }} semillas</span>
        </div>
        <div v-if="badge" ref="item3Ref" class="reward-item">
          <span class="reward-item__icon">🏅</span>
          <span class="reward-item__text">{{ badge }}</span>
        </div>
      </div>

      <div ref="btnRef" class="reward-btn-wrap">
        <GameButton variant="primary" size="lg" @click="$emit('continue')">
          ¡Genial! 🎉
        </GameButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

const props = defineProps<{
  show: boolean
  title: string
  points?: number
  seeds?: number
  badge?: string
}>()

defineEmits<{ continue: [] }>()

const { popIn, slideUpBounce, confettiBurst, celebrateSuccess } = useGameAnimations()

const popupRef = ref<HTMLElement | null>(null)
const confettiRef = ref<HTMLElement | null>(null)
const starRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const item1Ref = ref<HTMLElement | null>(null)
const item2Ref = ref<HTMLElement | null>(null)
const item3Ref = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)

watch(() => props.show, (v) => {
  if (v) {
    nextTick(() => {
      if (starRef.value) celebrateSuccess(starRef.value)
      if (titleRef.value) slideUpBounce(titleRef.value, 0.2)
      if (item1Ref.value) popIn(item1Ref.value, 0.35)
      if (item2Ref.value) popIn(item2Ref.value, 0.5)
      if (item3Ref.value) popIn(item3Ref.value, 0.65)
      if (btnRef.value) slideUpBounce(btnRef.value, 0.8)
      if (confettiRef.value) {
        setTimeout(() => confettiBurst(confettiRef.value!, 16), 200)
      }
    })
  }
})
</script>

<style scoped>
.reward-popup {
  text-align: center;
  padding: 8px 0;
  position: relative;
  overflow: hidden;
}

.reward-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.reward-popup__header {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.reward-popup__star {
  font-size: 64px;
  display: block;
  filter: drop-shadow(0 4px 16px rgba(251, 191, 36, 0.5));
}

.reward-popup__title {
  font-size: 24px;
  font-weight: 900;
  color: var(--color-green-dark);
  margin-top: 10px;
}

.reward-popup__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border: 2px solid #86efac;
  padding: 14px 20px;
  border-radius: var(--radius-md);
}

.reward-item__icon {
  font-size: 28px;
}

.reward-item__text {
  font-weight: 800;
  color: #166534;
  font-size: 16px;
}

.reward-btn-wrap {
  position: relative;
  z-index: 1;
}
</style>
