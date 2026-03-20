<template>
  <MinigameShell
    title="Limpiar la banqueta"
    description="Arrastra cada residuo al contenedor correcto: orgánico, plástico, papel o no reciclable."
    :completed="correctSorts"
    :total="totalItems"
    :time-limit="60"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="cleanup-game">
      <!-- Hint -->
      <div class="cleanup-hint">
        {{ selectedItem ? '⬇️ Toca el contenedor correcto' : '⬆️ Toca un residuo para seleccionarlo' }}
      </div>

      <!-- Trash items -->
      <div class="trash-area">
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="trash-item"
          :class="{ 'trash-item--selected': selectedItem?.id === item.id }"
          :style="{ left: item.x + '%', top: item.y + '%' }"
          @click="selectTrashItem(item)"
        >
          <span class="trash-item__emoji">{{ item.emoji }}</span>
          <span class="trash-item__name">{{ item.name }}</span>
        </div>
      </div>

      <!-- Bins at bottom -->
      <div class="bins-area">
        <div
          v-for="bin in bins"
          :key="bin.id"
          class="bin"
          :class="{ 'bin--highlight': !!selectedItem }"
          :style="{ borderColor: bin.color }"
          @click="tapBin(bin.id)"
        >
          <div class="bin__icon" :style="{ background: bin.color }">{{ bin.emoji }}</div>
          <div class="bin__label">{{ bin.label }}</div>
          <div class="bin__count">{{ bin.count }}/{{ bin.target }}</div>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="feedback" :class="feedback.type === 'correct' ? 'feedback--correct' : 'feedback--wrong'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

interface TrashItem {
  id: string
  name: string
  emoji: string
  category: string
  x: number
  y: number
  sorted: boolean
}

interface Bin {
  id: string
  label: string
  emoji: string
  color: string
  count: number
  target: number
}

const trashItems: TrashItem[] = [
  { id: 't1', name: 'Cáscara', emoji: '🍌', category: 'organic', x: 15, y: 20, sorted: false },
  { id: 't2', name: 'Botella', emoji: '🧴', category: 'plastic', x: 55, y: 15, sorted: false },
  { id: 't3', name: 'Periódico', emoji: '📰', category: 'paper', x: 35, y: 35, sorted: false },
  { id: 't4', name: 'Bolsa', emoji: '🛍️', category: 'plastic', x: 70, y: 25, sorted: false },
  { id: 't5', name: 'Manzana', emoji: '🍎', category: 'organic', x: 25, y: 50, sorted: false },
  { id: 't6', name: 'Cartón', emoji: '📦', category: 'paper', x: 60, y: 45, sorted: false },
  { id: 't7', name: 'Pañal', emoji: '🧷', category: 'non-recyclable', x: 45, y: 55, sorted: false },
  { id: 't8', name: 'Lata', emoji: '🥫', category: 'plastic', x: 80, y: 40, sorted: false },
]

const items = ref<TrashItem[]>([])
const visibleItems = computed(() => items.value.filter(i => !i.sorted))
const totalItems = trashItems.length
const correctSorts = ref(0)
const isComplete = computed(() => correctSorts.value >= totalItems)
const showResult = ref(false)
const selectedItem = ref<TrashItem | null>(null)
const feedback = ref<{ message: string; type: 'correct' | 'wrong' } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

const bins = ref<Bin[]>([
  { id: 'organic', label: 'Orgánico', emoji: '🌿', color: '#52b788', count: 0, target: 2 },
  { id: 'plastic', label: 'Plástico', emoji: '♻️', color: '#577590', count: 0, target: 3 },
  { id: 'paper', label: 'Papel', emoji: '📄', color: '#f9c74f', count: 0, target: 2 },
  { id: 'non-recyclable', label: 'No recicl.', emoji: '🚫', color: '#8d8d8d', count: 0, target: 1 },
])

function onStart() {
  items.value = trashItems.map(t => ({ ...t }))
}

// Tap-to-select-then-tap-bin flow (mobile friendly)
function selectTrashItem(item: TrashItem) {
  if (item.sorted) return
  selectedItem.value = item
  showFeedback('Ahora toca el contenedor correcto ⬇️', 'correct')
}

function tapBin(binId: string) {
  if (!selectedItem.value) {
    showFeedback('Primero toca un residuo ⬆️', 'wrong')
    return
  }
  checkSort(selectedItem.value, binId)
}

function checkSort(item: TrashItem, binId: string) {
  if (item.category === binId) {
    item.sorted = true
    correctSorts.value++
    const bin = bins.value.find(b => b.id === binId)
    if (bin) bin.count++
    selectedItem.value = null
    showFeedback('¡Correcto! ✅', 'correct')
    if (isComplete.value) {
      setTimeout(() => { showResult.value = true }, 500)
    }
  } else {
    showFeedback('Ese no va ahí. ¡Intenta otro contenedor!', 'wrong')
  }
}

function showFeedback(message: string, type: 'correct' | 'wrong') {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, type }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 1200)
}

function onTimeout() {
  showResult.value = true
}

function resetGame() {
  items.value = trashItems.map(t => ({ ...t }))
  correctSorts.value = 0
  showResult.value = false
  selectedItem.value = null
  bins.value.forEach(b => { b.count = 0 })
}
</script>

<style scoped>
.cleanup-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #e8e0d0 0%, #d4cbb8 100%);
  position: relative;
}

.trash-area {
  flex: 1;
  position: relative;
  padding: 10px;
}

.cleanup-hint {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.9);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  z-index: 5;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}

.trash-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px;
  background: rgba(255,255,255,0.85);
  border: 2px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
  z-index: 2;
}

.trash-item:active { transform: scale(0.92); }
.trash-item--selected {
  border-color: var(--color-yellow);
  background: #fffde7;
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 0 16px rgba(251,191,36,0.4);
}

.trash-item__emoji { font-size: 28px; }
.trash-item__name { font-size: 10px; font-weight: 700; color: var(--color-text); }

.bins-area {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(255,255,255,0.6);
  justify-content: center;
}

.bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border: 3px dashed;
  border-radius: var(--radius-md);
  min-width: 70px;
  transition: all var(--transition-fast);
  background: rgba(255,255,255,0.85);
}

.bin--highlight {
  transform: scale(1.08);
  background: rgba(255,255,255,0.9);
  box-shadow: var(--shadow-md);
}

.bin__icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.bin__label { font-size: 11px; font-weight: 700; color: var(--color-text); }
.bin__count { font-size: 10px; font-weight: 600; color: var(--color-text); }

.feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 18px;
  z-index: 15;
  animation: scaleIn 0.3s ease;
}

.feedback--correct {
  background: var(--color-green-light);
  color: white;
}

.feedback--wrong {
  background: var(--color-orange);
  color: white;
}
</style>
