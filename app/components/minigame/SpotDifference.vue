<template>
  <div class="spotdiff-game">
    <div class="game-hint">
      {{ hint }} · Encontradas: {{ foundCount }}/{{ total }}
    </div>

    <!-- Scene toggle on mobile, side-by-side on tablet+ -->
    <div class="spotdiff-scenes">
      <!-- Toggle button (mobile only) -->
      <div class="scene-toggle">
        <button
          class="toggle-btn"
          :class="{ 'toggle-btn--active': showingScene === 'before' }"
          @click="showingScene = 'before'"
        >
          Antes
        </button>
        <button
          class="toggle-btn"
          :class="{ 'toggle-btn--active': showingScene === 'after' }"
          @click="showingScene = 'after'"
        >
          Después
        </button>
      </div>

      <div class="scenes-container">
        <!-- Before scene -->
        <div
          class="scene-panel"
          :class="{ 'scene-panel--hidden-mobile': showingScene !== 'before' }"
        >
          <div class="scene-label">Antes</div>
          <div class="scene-viewport">
            <SceneSky :variant="beforeSky" />
            <SceneStreet :variant="beforeStreet" />
            <div
              v-for="diff in diffs"
              :key="'b-' + diff.id"
              class="diff-zone"
              :class="{ 'diff-zone--found': diff.found }"
              :style="{ left: diff.x + '%', top: diff.y + '%', width: (diff.w || 50) + 'px', height: (diff.h || 50) + 'px' }"
              @click="tapDiff(diff)"
            >
              <span v-if="!diff.found" class="diff-ping" />
              <span v-if="diff.found" class="diff-check">✅</span>
            </div>
          </div>
        </div>

        <!-- After scene -->
        <div
          class="scene-panel"
          :class="{ 'scene-panel--hidden-mobile': showingScene !== 'after' }"
        >
          <div class="scene-label scene-label--after">Después</div>
          <div class="scene-viewport">
            <SceneSky :variant="afterSky" />
            <SceneStreet :variant="afterStreet" />
            <div
              v-for="diff in diffs"
              :key="'a-' + diff.id"
              class="diff-zone"
              :class="{ 'diff-zone--found': diff.found }"
              :style="{ left: diff.x + '%', top: diff.y + '%', width: (diff.w || 50) + 'px', height: (diff.h || 50) + 'px' }"
              @click="tapDiff(diff)"
            >
              <span v-if="diff.found" class="diff-found-emoji">{{ diff.emoji }}</span>
              <span v-if="diff.found" class="diff-check">✅</span>
            </div>
          </div>
        </div>
      </div>
    </div>

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

export interface DiffSpot {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  emoji: string
  label: string
  message: string
}

const props = withDefaults(defineProps<{
  differences: DiffSpot[]
  total: number
  hint?: string
  beforeSky?: string
  beforeStreet?: string
  afterSky?: string
  afterStreet?: string
}>(), {
  hint: '👆 Encuentra las diferencias entre las dos escenas',
  beforeSky: 'hot',
  beforeStreet: 'dirty',
  afterSky: 'nice',
  afterStreet: 'clean',
})

const emit = defineEmits<{
  complete: []
  update: [found: number, total: number]
}>()

const { celebrateSuccess, confettiBurst } = useGameAnimations()
const { feedback, showOk, clear: clearFeedback } = useGameFeedback()

interface DiffState extends DiffSpot { found: boolean }

const diffs = ref<DiffState[]>([])
const foundCount = ref(0)
const isComplete = computed(() => foundCount.value >= props.total)
const showingScene = ref<'before' | 'after'>('before')

function start() {
  diffs.value = props.differences.map(d => ({ ...d, found: false }))
  foundCount.value = 0
  showingScene.value = 'before'
  clearFeedback()
  emit('update', 0, props.total)
}

function tapDiff(diff: DiffState) {
  if (diff.found) return
  diff.found = true
  foundCount.value++
  showOk(`${diff.label}: ${diff.message}`)

  nextTick(() => {
    const el = document.querySelector('.diff-zone--found:last-of-type')
    if (el) celebrateSuccess(el)
  })

  emit('update', foundCount.value, props.total)

  if (isComplete.value) {
    const gameEl = document.querySelector('.spotdiff-game')
    if (gameEl) confettiBurst(gameEl, 20)
    setTimeout(() => emit('complete'), 1000)
  }
}

function reset() { start() }

defineExpose({ start, reset, foundCount, isComplete })
</script>

<style scoped>
.spotdiff-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.spotdiff-scenes {
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 5;
  position: relative;
  overflow: hidden;
}

.scene-toggle {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
  z-index: 10;
}

.toggle-btn {
  padding: 4px 16px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(0,0,0,0.15);
  background: rgba(255,255,255,0.7);
  font-size: 11px;
  font-weight: 800;
  color: var(--color-text);
  cursor: pointer;
  transition: all 150ms;
}

.toggle-btn--active {
  background: var(--color-green-mid);
  border-color: var(--color-green-mid);
  color: white;
}

.scenes-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scene-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.scene-panel--hidden-mobile {
  display: none;
}

.scene-label {
  position: absolute;
  top: 4px;
  left: 8px;
  background: rgba(0,0,0,0.5);
  color: white;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 800;
  z-index: 8;
}

.scene-label--after { background: rgba(34, 197, 94, 0.8); }

.scene-viewport {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Difference zones */
.diff-zone {
  position: absolute;
  border: 2px dashed transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}

.diff-zone:active { transform: scale(0.95); }

.diff-zone--found {
  border-color: var(--color-green-mid);
  border-style: solid;
  background: rgba(34, 197, 94, 0.15);
  cursor: default;
}

.diff-ping {
  width: 12px;
  height: 12px;
  background: rgba(251, 191, 36, 0.6);
  border-radius: 50%;
  animation: ping 2s ease-in-out infinite;
}

.diff-check {
  font-size: 16px;
  animation: scaleIn 0.3s ease;
}

.diff-found-emoji {
  font-size: 20px;
  position: absolute;
  animation: scaleIn 0.3s ease;
}

@keyframes ping {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.5); opacity: 0.2; }
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Tablet+: side by side */
@media (min-width: 560px) {
  .scene-toggle { display: none; }
  .scenes-container { flex-direction: row; }
  .scene-panel--hidden-mobile { display: block; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
