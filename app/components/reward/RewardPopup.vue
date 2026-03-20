<template>
  <Modal :show="show" :closable="false" size="sm">
    <div class="reward-popup">
      <div class="reward-popup__header">
        <span class="reward-popup__star">⭐</span>
        <h2 class="reward-popup__title">{{ title }}</h2>
      </div>

      <div class="reward-popup__items">
        <div v-if="points" class="reward-item" style="animation-delay: 0.15s">
          <span class="reward-item__icon">🌿</span>
          <span class="reward-item__text">+{{ points }} puntos verdes</span>
        </div>
        <div v-if="seeds" class="reward-item" style="animation-delay: 0.3s">
          <span class="reward-item__icon">🌱</span>
          <span class="reward-item__text">+{{ seeds }} semillas</span>
        </div>
        <div v-if="badge" class="reward-item" style="animation-delay: 0.45s">
          <span class="reward-item__icon">🏅</span>
          <span class="reward-item__text">{{ badge }}</span>
        </div>
      </div>

      <GameButton variant="primary" size="lg" @click="$emit('continue')">
        ¡Genial!
      </GameButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  points?: number
  seeds?: number
  badge?: string
}>()

defineEmits<{
  continue: []
}>()
</script>

<style scoped>
.reward-popup {
  text-align: center;
  padding: 8px 0;
}

.reward-popup__header {
  margin-bottom: 20px;
}

.reward-popup__star {
  font-size: 56px;
  display: block;
  animation: popIn 600ms var(--ease-spring) forwards;
  filter: drop-shadow(0 4px 12px rgba(251, 191, 36, 0.4));
}

.reward-popup__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-green-dark);
  margin-top: 10px;
}

.reward-popup__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, var(--color-green-bg), rgba(168, 230, 195, 0.4));
  border: 1px solid var(--color-green-pale);
  padding: 12px 18px;
  border-radius: var(--radius-md);
  opacity: 0;
  animation: popIn 400ms var(--ease-spring) forwards;
}

.reward-item__icon {
  font-size: 26px;
}

.reward-item__text {
  font-weight: 700;
  color: var(--color-green-dark);
  font-size: 15px;
}
</style>
