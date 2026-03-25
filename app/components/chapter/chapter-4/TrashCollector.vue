<template>
  <MinigameShell
    title="Recolectar basura"
    mascot-character-id="vale"
    description="Toca cada residuo tirado en la calle para recolectarlo."
    :completed="collected"
    :total="8"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="collector-game">
      <SceneSky variant="hot" />
      <SceneStreet variant="dirty" />

      <div class="game-hint">
        👆 Toca cada basura para recogerla · Recolectados: {{ collected }}/8
      </div>

      <!-- Trash items scattered on the scene -->
      <div class="trash-scene">
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="trash-item game-item"
          :style="{ left: item.x + '%', top: item.y + '%' }"
          @click="collectItem(item)"
        >
          <span class="trash-item__emoji game-item__emoji">{{ item.emoji }}</span>
          <span class="trash-item__name game-item__label">{{ item.name }}</span>
        </div>
      </div>

      <!-- Collection counter -->
      <div class="collection-counter">
        <div class="counter-bag">🗑️</div>
        <div class="counter-items">
          <span
            v-for="item in collectedItems"
            :key="item.id"
            class="counter-item"
          >
            {{ item.emoji }}
          </span>
        </div>
        <div class="counter-label">{{ collected }}/8 recolectados</div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="collector-feedback game-feedback game-feedback--ok">
          {{ feedback }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

defineEmits<{ complete: [] }>()

const { celebrateSuccess, confettiBurst } = useGameAnimations()

interface TrashItem {
  id: string
  name: string
  emoji: string
  x: number
  y: number
  collected: boolean
  message: string
}

const trashData: TrashItem[] = [
  { id: 't1', name: 'Bolsa de plástico', emoji: '🛍️', x: 12, y: 15, collected: false, message: '¡Bolsa recogida!' },
  { id: 't2', name: 'Vaso de unicel', emoji: '🥤', x: 55, y: 10, collected: false, message: '¡Vaso de unicel!' },
  { id: 't3', name: 'Caja de cartón', emoji: '📦', x: 30, y: 35, collected: false, message: '¡Cartón recolectado!' },
  { id: 't4', name: 'Cáscara de plátano', emoji: '🍌', x: 72, y: 25, collected: false, message: '¡Orgánico recogido!' },
  { id: 't5', name: 'Botella de plástico', emoji: '🧴', x: 20, y: 55, collected: false, message: '¡Botella recogida!' },
  { id: 't6', name: 'Periódico viejo', emoji: '🗞️', x: 48, y: 48, collected: false, message: '¡Periódico recogido!' },
  { id: 't7', name: 'Hojas secas', emoji: '🍂', x: 78, y: 52, collected: false, message: '¡Hojas recolectadas!' },
  { id: 't8', name: 'Lata de aluminio', emoji: '🥫', x: 62, y: 62, collected: false, message: '¡Lata recogida!' },
]

const items = ref<TrashItem[]>([])
const visibleItems = computed(() => items.value.filter(i => !i.collected))
const collectedItems = computed(() => items.value.filter(i => i.collected))
const collected = ref(0)
const isComplete = computed(() => collected.value >= 8)
const showResult = ref(false)
const feedback = ref<string | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  items.value = trashData.map(t => ({ ...t }))
  collected.value = 0
}

function collectItem(item: TrashItem) {
  if (item.collected) return

  item.collected = true
  collected.value++

  showFeedback(item.message)

  // Animate the counter
  nextTick(() => {
    const counterEl = document.querySelector('.collection-counter')
    if (counterEl) celebrateSuccess(counterEl)
  })

  if (isComplete.value) {
    const gameEl = document.querySelector('.collector-game')
    if (gameEl) confettiBurst(gameEl, 24)
    setTimeout(() => { showResult.value = true }, 800)
  }
}

function showFeedback(message: string) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = message
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  items.value = trashData.map(t => ({ ...t }))
  collected.value = 0
  showResult.value = false
  feedback.value = null
}
</script>

<style scoped>
.collector-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
}

.collector-hint {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 18px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text);
  z-index: 10;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
}

.trash-scene {
  flex: 1;
  position: relative;
  z-index: 5;
  padding: 40px 10px 10px;
}

.trash-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px 6px;
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 150ms var(--ease-spring), box-shadow 150ms ease, opacity 300ms ease;
  z-index: 6;
  box-shadow: var(--shadow-md);
  min-width: 62px;
  animation: pulse 2s ease-in-out infinite;
}

.trash-item:active {
  transform: scale(0.9);
}

.trash-item__emoji {
  font-size: 28px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

.trash-item__name {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  text-align: center;
  max-width: 70px;
}

/* Collection counter */
.collection-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 3px solid rgba(0, 0, 0, 0.08);
  z-index: 10;
  position: relative;
}

.counter-bag {
  font-size: 28px;
}

.counter-items {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  flex: 1;
}

.counter-item {
  font-size: 20px;
  animation: scaleIn 0.4s var(--ease-spring);
}

.counter-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--color-text);
  white-space: nowrap;
}

/* feedback handled by global .game-feedback */

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
