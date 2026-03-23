<template>
  <div class="spotdiff-game">
    <div class="game-hint">
      {{ hint }} · Encontradas: {{ foundCount }}/{{ total }}
    </div>

    <div class="spotdiff-scenes">
      <!-- BEFORE scene -->
      <div class="scene-panel">
        <div class="scene-tag">Antes</div>
        <div class="scene-viewport">
          <SceneSky :variant="beforeSky" />
          <SceneStreet :variant="beforeStreet" />
          <!-- Empty markers where differences will be (not visible) -->
          <div
            v-for="diff in diffs"
            :key="'before-' + diff.id"
            class="diff-marker diff-marker--before"
            :class="{ 'diff-marker--revealed': diff.found }"
            :style="{ left: diff.x + '%', top: diff.y + '%', width: (diff.w || 50) + 'px', height: (diff.h || 50) + 'px' }"
          >
            <span v-if="diff.found" class="diff-marker__old">✖</span>
          </div>
        </div>
      </div>

      <!-- AFTER scene (interactive) -->
      <div class="scene-panel">
        <div class="scene-tag scene-tag--after">Después</div>
        <div class="scene-viewport" @click="onSceneTap">
          <SceneSky :variant="afterSky" />
          <SceneStreet :variant="afterStreet" />

          <!-- Hidden diff zones: only subtle shimmer hints, no emojis visible until tapped -->
          <div
            v-for="diff in diffs"
            :key="diff.id"
            class="diff-zone"
            :class="{ 'diff-zone--found': diff.found, 'diff-zone--hint': !diff.found && showHints }"
            :style="{ left: diff.x + '%', top: diff.y + '%', width: (diff.w || 50) + 'px', height: (diff.h || 50) + 'px' }"
            :data-diff="diff.id"
            @click.stop="tapDiff(diff)"
          >
            <!-- Found state: reveal the improvement -->
            <template v-if="diff.found">
              <span class="diff-zone__emoji">{{ diff.emoji }}</span>
              <span class="diff-zone__label">{{ diff.label }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Hint button: shows shimmer on unfound zones for 2s -->
    <div class="spotdiff-toolbar">
      <button class="hint-btn" :disabled="hintsUsed >= maxHints || showHints" @click="useHint">
        💡 Pista ({{ maxHints - hintsUsed }})
      </button>
      <span class="spotdiff-score">{{ foundCount }}/{{ total }}</span>
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
  maxHints?: number
  beforeSky?: string
  beforeStreet?: string
  afterSky?: string
  afterStreet?: string
}>(), {
  hint: '👆 Compara "Antes" y "Después". Toca donde veas una mejora.',
  maxHints: 2,
  beforeSky: 'hot',
  beforeStreet: 'dirty',
  afterSky: 'nice',
  afterStreet: 'clean',
})

const emit = defineEmits<{
  complete: []
  update: [found: number, total: number]
}>()

const { celebrateSuccess, confettiBurst, shakeWrong } = useGameAnimations()
const { feedback, showOk, showNo, clear: clearFeedback } = useGameFeedback()

interface DiffState extends DiffSpot { found: boolean }

const diffs = ref<DiffState[]>([])
const foundCount = ref(0)
const isComplete = computed(() => foundCount.value >= props.total)
const hintsUsed = ref(0)
const showHints = ref(false)
const wrongTaps = ref(0)

function start() {
  diffs.value = props.differences.map(d => ({ ...d, found: false }))
  foundCount.value = 0
  hintsUsed.value = 0
  showHints.value = false
  wrongTaps.value = 0
  clearFeedback()
  emit('update', 0, props.total)
}

function tapDiff(diff: DiffState) {
  if (diff.found) return
  diff.found = true
  foundCount.value++
  showOk(`${diff.label}: ${diff.message}`)

  nextTick(() => {
    const el = document.querySelector(`[data-diff="${diff.id}"]`)
    if (el) celebrateSuccess(el)
  })

  emit('update', foundCount.value, props.total)

  if (isComplete.value) {
    const gameEl = document.querySelector('.spotdiff-game')
    if (gameEl) confettiBurst(gameEl, 20)
    setTimeout(() => emit('complete'), 1000)
  }
}

function onSceneTap(e: MouseEvent) {
  // Tapped on the scene but not on a diff zone → wrong tap
  const target = e.target as HTMLElement
  if (target.closest('.diff-zone')) return
  wrongTaps.value++
  if (wrongTaps.value <= 5) {
    showNo('No hay nada diferente ahí. 💡 Compara ambas escenas y busca lo que cambió.')
    const el = document.querySelector('.scene-panel:last-child .scene-viewport')
    if (el) shakeWrong(el)
  }
}

function useHint() {
  if (hintsUsed.value >= props.maxHints) return
  hintsUsed.value++
  showHints.value = true
  setTimeout(() => { showHints.value = false }, 2500)
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
  gap: 2px;
}

.scene-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.scene-tag {
  position: absolute;
  top: 4px;
  left: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 800;
  z-index: 8;
}

.scene-tag--after {
  background: rgba(34, 197, 94, 0.85);
}

.scene-viewport {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Before markers: show X on found spots to indicate what was missing */
.diff-marker--before {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 6;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diff-marker--revealed {
  border: 2px dashed rgba(239, 68, 68, 0.5);
  border-radius: var(--radius-md);
  background: rgba(239, 68, 68, 0.08);
}

.diff-marker__old {
  font-size: 18px;
  color: rgba(239, 68, 68, 0.6);
  font-weight: 900;
}

/* After diff zones: invisible until found */
.diff-zone {
  position: absolute;
  transform: translate(-50%, -50%);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: all 200ms ease;
}

.diff-zone:active { transform: translate(-50%, -50%) scale(0.92); }

/* Hint mode: subtle shimmer */
.diff-zone--hint {
  border-color: rgba(251, 191, 36, 0.4);
  background: rgba(251, 191, 36, 0.1);
  animation: hintShimmer 1s ease-in-out infinite;
}

/* Found state */
.diff-zone--found {
  border-color: var(--color-green-mid);
  border-style: solid;
  background: rgba(34, 197, 94, 0.2);
  cursor: default;
  animation: revealPop 0.4s ease;
}

.diff-zone--found:active { transform: translate(-50%, -50%); }

.diff-zone__emoji {
  font-size: 22px;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
}

.diff-zone__label {
  font-size: 8px;
  font-weight: 800;
  color: white;
  background: rgba(0,0,0,0.6);
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Toolbar */
.spotdiff-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.85);
  border-top: 2px solid rgba(0,0,0,0.08);
  z-index: 10;
  position: relative;
}

.hint-btn {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 2px solid #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  color: #92400e;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 150ms;
}

.hint-btn:active:not(:disabled) { transform: scale(0.95); }
.hint-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.spotdiff-score {
  font-size: 16px;
  font-weight: 900;
  color: var(--color-green-dark);
}

@keyframes hintShimmer {
  0%, 100% { border-color: rgba(251, 191, 36, 0.2); background: rgba(251, 191, 36, 0.05); }
  50% { border-color: rgba(251, 191, 36, 0.5); background: rgba(251, 191, 36, 0.15); }
}

@keyframes revealPop {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  60% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

/* Tablet+: side by side */
@media (min-width: 560px) {
  .spotdiff-scenes { flex-direction: row; gap: 4px; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
