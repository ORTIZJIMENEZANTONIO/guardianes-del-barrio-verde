<template>
  <MinigameShell
    title="Separar residuos"
    description="Arrastra cada residuo al contenedor correcto por su tipo de material."
    :completed="correctSorts"
    :total="totalItems"
    :time-limit="90"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
    @timeout="onTimeout"
  >
    <div class="separator-game" @pointermove="onPointerMove" @pointerup="onPointerUp">
      <!-- Background -->
      <SceneSky variant="hot" />
      <SceneStreet variant="dirty" />

      <!-- Hint -->
      <div class="separator-hint" :class="{ 'hint--active': !!selectedItem }">
        {{ selectedItem ? '⬇️ Arrastra al contenedor o tócalo' : '👆 Toca o arrastra un residuo' }}
      </div>

      <!-- Waste items floating above the scene -->
      <div class="waste-area" ref="wasteAreaRef">
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="waste-item"
          :class="{
            'waste-item--selected': selectedItem?.id === item.id,
            'waste-item--dragging': dragging?.id === item.id,
          }"
          :style="itemStyle(item)"
          @pointerdown.prevent="onPointerDown(item, $event)"
          @click="onItemClick(item)"
        >
          <span class="waste-item__emoji">{{ item.emoji }}</span>
          <span class="waste-item__name">{{ item.name }}</span>
        </div>
      </div>

      <!-- 4 Bins at bottom -->
      <div class="bins-area">
        <div
          v-for="bin in bins"
          :key="bin.id"
          class="bin"
          :class="{
            'bin--highlight': !!selectedItem || !!dragging,
            'bin--hover': hoveredBin === bin.id,
            'bin--done': bin.count >= bin.target,
          }"
          :style="{ '--bin-color': bin.color, '--bin-color-light': bin.colorLight }"
          :data-bin-id="bin.id"
          @click="onBinClick(bin.id)"
        >
          <div class="bin__body">
            <div class="bin__lid" />
            <div class="bin__icon">{{ bin.emoji }}</div>
          </div>
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
import { useGameAnimations } from '~/composables/useGameAnimations'

defineEmits<{ complete: [] }>()

const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface WasteItem {
  id: string; name: string; emoji: string; category: string
  x: number; y: number; sorted: boolean
}

interface Bin {
  id: string; label: string; emoji: string; color: string; colorLight: string
  count: number; target: number
}

// Items con datos de degradación — enfoque en reciclaje educativo
interface WasteItemExt extends WasteItem {
  degradeTime: string
  recycleFact: string
}

const wasteItems: WasteItemExt[] = [
  { id: 'w1', name: 'Cáscara de naranja', emoji: '🍊', category: 'organic', x: 10, y: 12, sorted: false, degradeTime: '6 meses', recycleFact: 'Se convierte en composta para plantas' },
  { id: 'w2', name: 'Botella PET', emoji: '🧴', category: 'recyclable', x: 52, y: 8, sorted: false, degradeTime: '450 años', recycleFact: 'Se recicla en playeras y tela' },
  { id: 'w3', name: 'Periódico', emoji: '📰', category: 'paper', x: 28, y: 30, sorted: false, degradeTime: '1 año', recycleFact: 'Se recicla en papel nuevo sin talar árboles' },
  { id: 'w4', name: 'Bolsa de plástico', emoji: '🛍️', category: 'non-recyclable', x: 70, y: 22, sorted: false, degradeTime: '150 años', recycleFact: 'No se recicla fácil. Mejor usar bolsa reutilizable' },
  { id: 'w5', name: 'Restos de verdura', emoji: '🥕', category: 'organic', x: 18, y: 50, sorted: false, degradeTime: '3 meses', recycleFact: 'Es el ingrediente #1 de la composta' },
  { id: 'w6', name: 'Caja de cartón', emoji: '📦', category: 'paper', x: 58, y: 42, sorted: false, degradeTime: '1 año', recycleFact: 'Una caja se recicla hasta 7 veces' },
  { id: 'w7', name: 'Lata de aluminio', emoji: '🥫', category: 'recyclable', x: 40, y: 55, sorted: false, degradeTime: '200 años', recycleFact: 'El aluminio se recicla INFINITAS veces sin perder calidad' },
  { id: 'w8', name: 'Unicel', emoji: '🥡', category: 'non-recyclable', x: 76, y: 45, sorted: false, degradeTime: '1000 años', recycleFact: 'Casi imposible de reciclar. Evítalo siempre' },
]

const items = ref<WasteItem[]>([])
const visibleItems = computed(() => items.value.filter(i => !i.sorted))
const totalItems = wasteItems.length
const correctSorts = ref(0)
const isComplete = computed(() => correctSorts.value >= totalItems)
const showResult = ref(false)
const selectedItem = ref<WasteItem | null>(null)
const feedback = ref<{ message: string; type: 'correct' | 'wrong' } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

// Drag state
const dragging = ref<WasteItem | null>(null)
const dragPos = ref({ x: 0, y: 0 })
const dragStarted = ref(false)
let rafPending = false
const hoveredBin = ref<string | null>(null)
const wasteAreaRef = ref<HTMLElement | null>(null)

const bins = ref<Bin[]>([
  { id: 'organic', label: 'Orgánico', emoji: '🌿', color: '#16a34a', colorLight: '#dcfce7', count: 0, target: 2 },
  { id: 'recyclable', label: 'Reciclable', emoji: '♻️', color: '#2563eb', colorLight: '#dbeafe', count: 0, target: 2 },
  { id: 'paper', label: 'Papel/Cartón', emoji: '📄', color: '#d97706', colorLight: '#fef3c7', count: 0, target: 2 },
  { id: 'non-recyclable', label: 'No recicl.', emoji: '🚫', color: '#6b7280', colorLight: '#f3f4f6', count: 0, target: 2 },
])

function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    organic: 'Orgánico',
    recyclable: 'Reciclable',
    paper: 'Papel/Cartón',
    'non-recyclable': 'No reciclable',
  }
  return map[category] ?? '?'
}

function onStart() {
  items.value = wasteItems.map(t => ({ ...t }))
}

// --- Drag support ---
function onPointerDown(item: WasteItem, e: PointerEvent) {
  if (item.sorted) return
  dragging.value = item
  dragStarted.value = false
  dragPos.value = { x: e.clientX, y: e.clientY }
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  dragStarted.value = true
  dragPos.value = { x: e.clientX, y: e.clientY }
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    rafPending = false

  const el = document.elementFromPoint(e.clientX, e.clientY)
  const binEl = el?.closest('[data-bin-id]') as HTMLElement | null
  hoveredBin.value = binEl?.dataset.binId ?? null
  })
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return

  if (dragStarted.value) {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const binEl = el?.closest('[data-bin-id]') as HTMLElement | null
    const binId = binEl?.dataset.binId
    if (binId) {
      checkSort(dragging.value, binId)
    }
  }

  dragging.value = null
  dragStarted.value = false
  hoveredBin.value = null
}

// --- Tap support ---
function onItemClick(item: WasteItem) {
  if (item.sorted || dragStarted.value) return
  selectedItem.value = selectedItem.value?.id === item.id ? null : item
}

function onBinClick(binId: string) {
  if (!selectedItem.value) return
  checkSort(selectedItem.value, binId)
  selectedItem.value = null
}

// --- Shared ---
function itemStyle(item: WasteItem) {
  if (dragging.value?.id === item.id && dragStarted.value) {
    return {
      position: 'fixed' as const,
      left: (dragPos.value.x - 35) + 'px',
      top: (dragPos.value.y - 35) + 'px',
      zIndex: 200,
    }
  }
  return { left: item.x + '%', top: item.y + '%' }
}

function checkSort(item: WasteItem, binId: string) {
  const extItem = item as WasteItemExt
  if (item.category === binId) {
    item.sorted = true
    correctSorts.value++
    const bin = bins.value.find(b => b.id === binId)
    if (bin) bin.count++
    selectedItem.value = null
    // Educational feedback with degradation time and recycle fact
    showFeedback(`✅ ${extItem.recycleFact} (tarda ${extItem.degradeTime} en degradarse)`, 'correct')
    const binEl = document.querySelector(`[data-bin-id="${binId}"]`)
    if (binEl) celebrateSuccess(binEl)
    if (isComplete.value) {
      const gameEl = document.querySelector('.separator-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    const correctBin = categoryLabel(item.category)
    showFeedback(`${extItem.name} no va en ese contenedor. 💡 Tarda ${extItem.degradeTime} en degradarse. Fíjate en su material.`, 'wrong')
    const binsEl = document.querySelector('.bins-area')
    if (binsEl) shakeWrong(binsEl)
  }
}

function showFeedback(message: string, type: 'correct' | 'wrong') {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, type }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 1500)
}

function onTimeout() { showResult.value = true }

function resetGame() {
  items.value = wasteItems.map(t => ({ ...t }))
  correctSorts.value = 0
  showResult.value = false
  selectedItem.value = null
  dragging.value = null
  bins.value.forEach(b => { b.count = 0 })
}
</script>

<style scoped>
.separator-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  touch-action: none;
}

.separator-hint {
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
  transition: all 300ms ease;
}
.hint--active {
  background: #fef3c7;
  border: 2px solid #f59e0b;
}

/* Items area */
.waste-area {
  flex: 1;
  position: relative;
  padding: 40px 10px 10px;
  z-index: 5;
}

.waste-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 10px 6px;
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: var(--radius-md);
  cursor: grab;
  touch-action: none;
  transition: transform 150ms var(--ease-spring), box-shadow 150ms ease, border-color 150ms ease;
  z-index: 6;
  box-shadow: var(--shadow-md);
  min-width: 62px;
}

.waste-item:active { cursor: grabbing; }

.waste-item--selected {
  border-color: #f59e0b;
  background: #fffbeb;
  transform: scale(1.12);
  z-index: 15;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3), var(--shadow-lg);
  animation: pulse 1s ease-in-out infinite;
}

.waste-item--dragging {
  transform: scale(1.15) rotate(-3deg);
  box-shadow: var(--shadow-xl);
  border-color: #8b5cf6;
  background: #f5f3ff;
  z-index: 200;
  pointer-events: none;
  animation: none;
}

.waste-item__emoji { font-size: 28px; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15)); }
.waste-item__name { font-size: 10px; font-weight: 800; color: var(--color-text); line-height: 1.2; text-align: center; max-width: 70px; }

/* Bins */
.bins-area {
  display: flex;
  gap: 6px;
  padding: 10px 6px 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  justify-content: center;
  border-top: 3px solid rgba(0, 0, 0, 0.08);
  z-index: 10;
  position: relative;
}

.bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 6px 5px;
  border-radius: var(--radius-md);
  min-width: 68px;
  transition: all 250ms var(--ease-spring);
  background: var(--bin-color-light);
  border: 2px solid var(--bin-color);
  cursor: pointer;
}

.bin__body {
  position: relative;
  width: 36px;
  height: 32px;
  background: var(--bin-color);
  border-radius: 3px 3px 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bin__lid {
  position: absolute;
  top: -4px;
  left: -2px;
  right: -2px;
  height: 6px;
  background: var(--bin-color);
  border-radius: 3px 3px 0 0;
  filter: brightness(0.85);
}

.bin__icon {
  font-size: 16px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}

.bin--highlight {
  animation: pulse 1.2s ease-in-out infinite;
  box-shadow: 0 0 12px color-mix(in srgb, var(--bin-color) 30%, transparent);
}

.bin--hover {
  transform: scale(1.12);
  box-shadow: 0 0 20px color-mix(in srgb, var(--bin-color) 50%, transparent);
  animation: none;
}

.bin--hover .bin__lid {
  transform: rotate(-15deg) translateY(-3px);
  transform-origin: left center;
  transition: transform 200ms ease;
}

.bin--done {
  opacity: 0.4;
  animation: none;
  transform: scale(0.92);
  filter: grayscale(0.4);
}

.bin__label { font-size: 10px; font-weight: 800; color: var(--color-text); }
.bin__count { font-size: 9px; font-weight: 700; color: var(--color-text); opacity: 0.7; }

/* Feedback */
.feedback {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 14px 28px;
  border-radius: var(--radius-lg);
  font-weight: 800;
  font-size: 16px;
  z-index: 50;
  animation: popIn 400ms var(--ease-spring);
  box-shadow: var(--shadow-lg);
  text-align: center;
  max-width: 280px;
}

.feedback--correct {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.feedback--wrong {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
