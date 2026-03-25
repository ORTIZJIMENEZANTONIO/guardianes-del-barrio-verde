<template>
  <MinigameShell
    title="La Ruta de Bolillo"
    mascot-character-id="bolillo"
    description="Sigue a Bolillo por el parque. En cada parada, dale lo que necesita."
    :completed="needsMet"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="bolillo-game">
      <SceneSky variant="nice" />
      <SceneStreet variant="clean" />

      <!-- Bolillo's route stops -->
      <div class="route-area">
        <!-- Path line connecting stops -->
        <svg class="route-path" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M12 30 L30 55 L50 35 L70 60 L88 40"
            fill="none"
            stroke="rgba(200,152,80,0.4)"
            stroke-width="1.5"
            stroke-dasharray="3 2"
          />
        </svg>

        <!-- Bolillo at current stop -->
        <div
          class="bolillo-marker"
          :class="{ 'bolillo-marker--complete': isComplete }"
          :style="{ left: stops[currentStop]?.x + '%', top: stops[currentStop]?.y + '%' }"
        >
          <CharacterFace
            character-id="bolillo"
            :emotion="bolilloEmotion"
            :is-speaking="false"
          />
        </div>

        <!-- Stops -->
        <div
          v-for="(stop, i) in stops"
          :key="stop.id"
          class="route-stop game-zone"
          :class="{
            'route-stop--active': i === currentStop && !stop.fulfilled,
            'route-stop--fulfilled game-zone--filled': stop.fulfilled,
            'route-stop--future': i > currentStop,
          }"
          :style="{ left: stop.x + '%', top: stop.y + '%' }"
          :data-stop="stop.id"
          @click="tryFulfill(stop, i)"
        >
          <span class="route-stop__emoji">{{ stop.fulfilled ? '✅' : stop.needEmoji }}</span>
          <span class="route-stop__label">{{ stop.label }}</span>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="bolillo-feedback game-feedback" :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Items tray -->
      <div class="items-tray game-tray">
        <div class="tray-title game-tray__title">¿Qué necesita Bolillo aquí?</div>
        <div class="items-row">
          <button
            v-for="item in items"
            :key="item.id"
            class="item-btn game-item"
            :class="{
              'item-btn--selected game-item--selected': selectedItem?.id === item.id,
              'item-btn--used game-item--used': item.used,
              'item-btn--wrong game-item--rejected': item.wrong,
            }"
            :disabled="item.used || item.wrong"
            @click="selectItem(item)"
          >
            <span class="item-emoji game-item__emoji">{{ item.emoji }}</span>
            <span class="item-name game-item__label">{{ item.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
import { useGameAnimations } from '~/composables/useGameAnimations'

import type { Emotion } from '~/shared/types/character'

const emit = defineEmits<{ complete: [] }>()
const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface RouteStop {
  id: string
  label: string
  needEmoji: string
  accepts: string
  x: number
  y: number
  fulfilled: boolean
  successMsg: string
}

interface CareItem {
  id: string
  name: string
  emoji: string
  type: string
  used: boolean
  wrong: boolean
  isDistractor: boolean
  distractorMsg: string
}

const stopsData: RouteStop[] = [
  { id: 's1', label: 'Tiene sed', needEmoji: '💧', accepts: 'water', x: 12, y: 30, fulfilled: false, successMsg: '¡Bolillo bebe agua fresca! Un plato de agua limpia puede salvar una vida.' },
  { id: 's2', label: 'Mucho sol', needEmoji: '☀️', accepts: 'shade', x: 30, y: 55, fulfilled: false, successMsg: '¡Sombra para Bolillo! Los perros callejeros necesitan refugio del sol.' },
  { id: 's3', label: 'Tiene hambre', needEmoji: '🍽️', accepts: 'food', x: 50, y: 35, fulfilled: false, successMsg: '¡Comida! Croquetas o comida para perro, nunca chocolate ni huesos de pollo.' },
  { id: 's4', label: 'Necesita descansar', needEmoji: '😴', accepts: 'bed', x: 70, y: 60, fulfilled: false, successMsg: '¡Un lugar seguro para dormir! Los perros callejeros buscan rincones tranquilos.' },
  { id: 's5', label: 'Se siente solo', needEmoji: '💛', accepts: 'company', x: 88, y: 40, fulfilled: false, successMsg: '¡Compañía respetuosa! Hablarle suave y dejar que él se acerque.' },
]

const itemsData: CareItem[] = [
  { id: 'i1', name: 'Plato de agua', emoji: '💧', type: 'water', used: false, wrong: false, isDistractor: false, distractorMsg: '' },
  { id: 'i2', name: 'Sombra/refugio', emoji: '🏕️', type: 'shade', used: false, wrong: false, isDistractor: false, distractorMsg: '' },
  { id: 'i3', name: 'Croquetas', emoji: '🥣', type: 'food', used: false, wrong: false, isDistractor: false, distractorMsg: '' },
  { id: 'i4', name: 'Camita', emoji: '🛏️', type: 'bed', used: false, wrong: false, isDistractor: false, distractorMsg: '' },
  { id: 'i5', name: 'Compañía', emoji: '🤝', type: 'company', used: false, wrong: false, isDistractor: false, distractorMsg: '' },
  { id: 'i6', name: 'Chocolate', emoji: '🍫', type: 'chocolate', used: false, wrong: false, isDistractor: true, distractorMsg: '¡No! El chocolate es tóxico para los perros. Puede enfermarlos mucho.' },
  { id: 'i7', name: 'Perseguirlo', emoji: '🏃', type: 'chase', used: false, wrong: false, isDistractor: true, distractorMsg: 'Nunca persigas a un perro callejero. Lo asustas. Deja que él se acerque.' },
]

const stops = ref<RouteStop[]>([])
const items = ref<CareItem[]>([])
const selectedItem = ref<CareItem | null>(null)
const needsMet = ref(0)
const currentStop = ref(0)
const isComplete = computed(() => needsMet.value >= 5)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

// Bolillo emotion mapped to progress — CharacterFace handles the PNG layers
const bolilloEmotion = computed<Emotion>(() => {
  const n = needsMet.value
  if (n >= 5) return 'excited'   // complete: super emocionado
  if (n >= 3) return 'happy'     // pasó la mitad: feliz
  if (n >= 2) return 'neutral'   // empezando a sentirse mejor
  if (n >= 1) return 'worried'   // todavía preocupado
  return 'sad'                    // triste al inicio
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function onStart() {
  stops.value = stopsData.map(s => ({ ...s }))
  items.value = shuffle(itemsData.map(i => ({ ...i })))
  needsMet.value = 0
  currentStop.value = 0
  selectedItem.value = null
}

function selectItem(item: CareItem) {
  if (item.used || item.wrong) return
  selectedItem.value = item
}

function tryFulfill(stop: RouteStop, index: number) {
  if (stop.fulfilled || index !== currentStop.value) return
  if (!selectedItem.value) {
    showFB('Bolillo necesita algo aquí. 💡 Primero elige un objeto del tray de abajo y luego toca la parada.', false)
    return
  }

  const item = selectedItem.value

  if (item.isDistractor) {
    showFB(item.distractorMsg, false)
    item.wrong = true
    selectedItem.value = null
    const el = document.querySelector(`[data-stop="${stop.id}"]`)
    if (el) shakeWrong(el)
    return
  }

  if (item.type === stop.accepts) {
    stop.fulfilled = true
    item.used = true
    needsMet.value++
    selectedItem.value = null
    showFB(stop.successMsg, true)

    nextTick(() => {
      const el = document.querySelector(`[data-stop="${stop.id}"]`)
      if (el) celebrateSuccess(el)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.bolillo-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    } else {
      // Advance Bolillo to next stop
      setTimeout(() => { currentStop.value++ }, 600)
    }
  } else {
    showFB('Eso no es lo que Bolillo necesita en esta parada. 💡 Mira el ícono: ¿tiene sed, hambre, frío o necesita descansar?', false)
    const el = document.querySelector(`[data-stop="${stop.id}"]`)
    if (el) shakeWrong(el)
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  stops.value = stopsData.map(s => ({ ...s }))
  items.value = shuffle(itemsData.map(i => ({ ...i })))
  needsMet.value = 0
  currentStop.value = 0
  selectedItem.value = null
  showResult.value = false
}
</script>

<style scoped>
.bolillo-game {
  width: 100%; height: 100%; display: flex; flex-direction: column;
  position: relative;
}

.route-area {
  flex: 1; position: relative; z-index: 5;
}

.route-path {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 1;
}

.bolillo-marker {
  position: absolute; z-index: 4;
  transform: translate(-50%, -110%);
  transition: left 600ms var(--ease-spring), top 600ms var(--ease-spring);
  filter: drop-shadow(0 3px 8px rgba(0,0,0,0.35));
  animation: float 2.5s ease-in-out infinite;
  width: 56px;
  height: 56px;
}

.bolillo-marker--complete {
  animation: floatExcited 0.8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -110%); }
  50% { transform: translate(-50%, -118%); }
}

@keyframes floatExcited {
  0%, 100% { transform: translate(-50%, -110%) scale(1); }
  50% { transform: translate(-50%, -122%) scale(1.12); }
}

.route-stop {
  position: absolute; display: flex; flex-direction: column;
  align-items: center; gap: 3px; padding: 8px 10px;
  border: 2px solid rgba(0,0,0,0.15); border-radius: var(--radius-md);
  background: rgba(255,255,255,0.7); cursor: pointer;
  transition: all 200ms var(--ease-spring);
  transform: translate(-50%, -50%); z-index: 3;
  min-width: 60px;
}

.route-stop--active {
  border-color: var(--color-yellow); background: rgba(251,191,36,0.2);
  box-shadow: 0 0 12px rgba(251,191,36,0.4);
  animation: pulse 1.2s ease-in-out infinite;
}

.route-stop--fulfilled {
  border-color: var(--color-green-mid); background: rgba(69,201,122,0.25);
  cursor: default; animation: none;
}

.route-stop--future {
  opacity: 0.4; cursor: default;
}

.route-stop__emoji { font-size: 20px; }
.route-stop__label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; }

/* Items tray */
.items-tray {
  padding: 10px 12px; background: rgba(255,255,255,0.80);
  position: relative; z-index: 10;
  border-top: 3px solid rgba(0,0,0,0.08);
}
.tray-title { font-size: 11px; font-weight: 700; color: var(--color-text); margin-bottom: 6px; }
.items-row { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }

.item-btn {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 6px 8px; background: white; border: 2px solid var(--color-green-mid);
  border-radius: var(--radius-md); transition: all var(--transition-fast);
  min-width: 52px;
}
.item-btn:active { transform: scale(0.95); }
.item-btn--selected { border-color: var(--color-yellow); background: #fff8e1; box-shadow: 0 0 0 2px var(--color-yellow); transform: scale(1.05); }
.item-btn--used { opacity: 0.3; cursor: not-allowed; }
.item-btn--wrong { opacity: 0.2; cursor: not-allowed; border-color: var(--color-coral); text-decoration: line-through; }
.item-emoji { font-size: 20px; }
.item-name { font-size: 8px; font-weight: 700; color: var(--color-text); text-align: center; }

/* feedback handled by global .game-feedback */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
