<template>
  <div class="sequence-game">
    <SceneSky :variant="skyVariant" />
    <SceneStreet :variant="streetVariant" />

    <div class="game-hint">
      {{ hint }} · Correctos: {{ correctCount }}/{{ steps.length }}
    </div>

    <div class="sequence-area">
      <!-- Drop slots (correct order positions) -->
      <div class="slots-column">
        <div
          v-for="(slot, i) in slots"
          :key="'slot-' + i"
          class="seq-slot"
          :class="{
            'seq-slot--filled': slot.item !== null,
            'seq-slot--correct': slot.correct,
            'seq-slot--wrong': slot.wrong,
          }"
          @click="placeInSlot(i)"
        >
          <span class="seq-slot__number">{{ i + 1 }}</span>
          <template v-if="slot.item">
            <GameIcon :emoji="slot.item.emoji" :size="22" class="seq-slot__emoji" />
            <span class="seq-slot__label">{{ slot.item.label }}</span>
          </template>
          <template v-else>
            <span class="seq-slot__placeholder">{{ slotLabels[i] || '?' }}</span>
          </template>
        </div>
      </div>

      <!-- Visual result column -->
      <div class="result-column">
        <div class="result-preview">
          <div
            v-for="(slot, i) in slots"
            :key="'preview-' + i"
            class="result-layer"
            :class="{ 'result-layer--active': slot.correct }"
          >
            <GameIcon v-if="slot.correct && slot.item" :emoji="slot.item.emoji" :size="18" />
          </div>
        </div>
        <div class="result-label">{{ correctCount }}/{{ steps.length }}</div>
      </div>
    </div>

    <!-- Items to pick from -->
    <div class="seq-tray game-tray">
      <div class="game-tray__title">{{ trayTitle }}</div>
      <div class="seq-items">
        <button
          v-for="item in availableItems"
          :key="item.id"
          class="seq-item game-item"
          :class="{
            'game-item--selected': selectedItem?.id === item.id,
            'game-item--used': item.placed,
          }"
          :disabled="item.placed"
          @click="selectItem(item)"
        >
          <GameIcon :emoji="item.emoji" :size="22" class="game-item__emoji" />
          <span class="game-item__label">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- Streak badge -->
    <div class="seq-streak">
      <StreakBadge :streak="streakState.streak.value" :label="streakState.streakLabel.value" />
    </div>

    <!-- Celebration flash -->
    <Transition name="fade">
      <div v-if="celebrations.showFlash.value" class="celebration-flash" />
    </Transition>

    <!-- Feedback -->
    <Transition name="fade">
      <div v-if="feedback" class="game-feedback" :class="feedback.ok ? 'game-feedback--ok' : 'game-feedback--no'">
        {{ feedback.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'
import { useGameFeedback } from '~/composables/useGameFeedback'
import { useStreakSystem } from '~/composables/useStreakSystem'
import { useSceneProgress } from '~/composables/useSceneProgress'
import { useMiniCelebrations } from '~/composables/useMiniCelebrations'

export interface SequenceStep {
  id: string
  emoji: string
  label: string
  correctPosition: number
  successMessage?: string
}

const props = withDefaults(defineProps<{
  steps: SequenceStep[]
  hint?: string
  trayTitle?: string
  slotLabels?: string[]
  errorMessage?: string
  skyVariant?: string
  streetVariant?: string
}>(), {
  hint: '👆 Selecciona un item y colócalo en el paso correcto',
  trayTitle: 'Arrastra en el orden correcto:',
  slotLabels: () => [],
  errorMessage: 'Ese no va en esa posición. 💡 Fíjate en el orden lógico del proceso.',
  skyVariant: 'nice',
  streetVariant: 'normal',
})

const emit = defineEmits<{
  complete: []
  update: [correct: number, total: number]
}>()

const { celebrateSuccess, confettiBurst, shakeWrong } = useGameAnimations()
const { feedback, showOk, showNo, clear: clearFeedback } = useGameFeedback()

// Streak + celebrations
const celebrations = useMiniCelebrations(() => document.querySelector('.sequence-game') as HTMLElement)
const streakState = useStreakSystem((milestone) => {
  celebrations.onStreakMilestone(milestone.streak)
})
const sceneState = useSceneProgress((pct) => {
  celebrations.onProgressMilestone(pct)
})

interface PlacedItem extends SequenceStep { placed: boolean }
interface Slot { item: PlacedItem | null; correct: boolean; wrong: boolean }

const items = ref<PlacedItem[]>([])
const slots = ref<Slot[]>([])
const selectedItem = ref<PlacedItem | null>(null)
const correctCount = computed(() => slots.value.filter(s => s.correct).length)
const isComplete = computed(() => correctCount.value >= props.steps.length)
const availableItems = computed(() => shuffle([...items.value]))

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function start() {
  items.value = props.steps.map(s => ({ ...s, placed: false }))
  slots.value = props.steps.map(() => ({ item: null, correct: false, wrong: false }))
  selectedItem.value = null
  streakState.reset()
  sceneState.reset(props.steps.length)
  clearFeedback()
  emit('update', 0, props.steps.length)
}

function selectItem(item: PlacedItem) {
  if (item.placed) return
  selectedItem.value = item
}

function placeInSlot(slotIndex: number) {
  const slot = slots.value[slotIndex]
  if (!selectedItem.value || slot.item) return

  const item = selectedItem.value
  const expectedPosition = slotIndex + 1

  if (item.correctPosition === expectedPosition) {
    // Correct placement
    slot.item = item
    slot.correct = true
    item.placed = true
    selectedItem.value = null
    streakState.hit()
    sceneState.increment()
    showOk(item.successMessage || '¡Correcto! Ese paso va ahí.')

    nextTick(() => {
      const el = document.querySelectorAll('.seq-slot')[slotIndex]
      if (el) celebrateSuccess(el)
    })

    emit('update', correctCount.value, props.steps.length)

    if (isComplete.value) {
      const gameEl = document.querySelector('.sequence-game')
      if (gameEl) confettiBurst(gameEl, 20)
      setTimeout(() => emit('complete'), 1000)
    }
  } else {
    // Wrong placement
    slot.wrong = true
    streakState.miss()
    showNo(props.errorMessage)
    const el = document.querySelectorAll('.seq-slot')[slotIndex]
    if (el) shakeWrong(el)
    setTimeout(() => { slot.wrong = false }, 600)
    selectedItem.value = null
  }
}

function reset() { start() }

defineExpose({ start, reset, correctCount, isComplete })
</script>

<style scoped>
.sequence-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.sequence-area {
  flex: 1;
  display: flex;
  gap: 8px;
  padding: 8px;
  z-index: 5;
  position: relative;
  overflow-y: auto;
}

.slots-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.seq-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.7);
  border: 2px dashed rgba(0,0,0,0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 200ms ease;
  min-height: 48px;
}

.seq-slot:active { transform: scale(0.98); }

.seq-slot--filled {
  border-style: solid;
  cursor: default;
}

.seq-slot--correct {
  border-color: var(--color-green-mid);
  background: rgba(34, 197, 94, 0.15);
}

.seq-slot--wrong {
  border-color: var(--color-coral);
  background: rgba(239, 68, 68, 0.15);
  animation: shake 300ms ease;
}

.seq-slot__number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  color: var(--color-text);
  flex-shrink: 0;
}

.seq-slot--correct .seq-slot__number {
  background: var(--color-green-mid);
  color: white;
}

.seq-slot__emoji { font-size: 22px; }
.seq-slot__label { font-size: 11px; font-weight: 700; color: var(--color-text); }
.seq-slot__placeholder { font-size: 11px; color: #94a3b8; font-style: italic; }

/* Result preview */
.result-column {
  width: 70px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  background: rgba(255,255,255,0.8);
  border-radius: var(--radius-md);
}

.result-preview {
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  flex: 1;
  justify-content: flex-start;
}

.result-layer {
  width: 50px;
  height: 28px;
  border-radius: 6px;
  background: rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 300ms ease;
}

.result-layer--active {
  background: rgba(34, 197, 94, 0.2);
  animation: scaleIn 0.3s ease;
}

.result-label {
  font-size: 12px;
  font-weight: 900;
  color: var(--color-green-dark);
}

/* Tray */
.seq-tray {
  padding: 8px 12px;
  background: rgba(255,255,255,0.85);
  border-top: 3px solid rgba(0,0,0,0.08);
  z-index: 10;
  position: relative;
}

.seq-items {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.seq-item {
  min-width: 60px;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.seq-streak {
  position: absolute;
  top: 8px;
  right: 80px;
  z-index: 20;
}

.celebration-flash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.2), transparent 70%);
  pointer-events: none;
  z-index: 30;
  animation: flashPulse 0.4s ease-out forwards;
}

@keyframes flashPulse {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
