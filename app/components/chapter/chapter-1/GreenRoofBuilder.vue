<template>
  <MinigameShell
    title="Construir un techo verde"
    description="Coloca cada capa del techo verde en el orden correcto, de abajo hacia arriba."
    :completed="layersPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="greenroof-game">
      <SceneSky variant="hot" />
      <SceneStreet variant="dirty" />

      <!-- Rooftop building silhouette -->
      <div class="rooftop-area">
        <div class="building">
          <div class="building__roof">
            <!-- Layer slots stacked vertically -->
            <div
              v-for="(slot, i) in slots"
              :key="slot.id"
              class="roof-slot game-zone"
              :class="{
                'roof-slot--filled game-zone--filled': slot.filled,
                'roof-slot--highlight game-zone--highlight': selectedItem && !slot.filled,
                'roof-slot--next': !slot.filled && i === nextSlotIndex,
              }"
              :data-slot="slot.id"
              @click="placeInSlot(slot)"
            >
              <template v-if="slot.filled">
                <span class="slot-emoji">{{ slot.placedEmoji }}</span>
                <span class="slot-name">{{ slot.placedName }}</span>
              </template>
              <template v-else>
                <span class="slot-number">{{ i + 1 }}</span>
                <span class="slot-label">{{ slot.label }}</span>
              </template>
            </div>
          </div>
          <div class="building__body">
            <div class="building__window" />
            <div class="building__window" />
            <div class="building__door" />
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="greenroof-feedback game-feedback" :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Items tray -->
      <div class="items-tray game-tray">
        <div class="tray-title game-tray__title">Capas disponibles:</div>
        <div class="items-row">
          <button
            v-for="item in items"
            :key="item.id"
            class="item-btn game-item"
            :class="{
              'item-btn--selected game-item--selected': selectedItem?.id === item.id,
              'item-btn--used game-item--used': item.used,
              'item-btn--rejected game-item--rejected': item.rejected,
            }"
            :disabled="item.used || item.rejected"
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

const emit = defineEmits<{ complete: [] }>()
const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

interface RoofSlot {
  id: string
  label: string
  order: number
  accepts: string
  filled: boolean
  placedEmoji: string | null
  placedName: string | null
  message: string
}

interface RoofItem {
  id: string
  name: string
  emoji: string
  type: string
  used: boolean
  rejected: boolean
  isDistractor: boolean
  distractorMsg: string
}

// 5 capas del techo verde, de abajo (1) a arriba (5)
const slotsData: RoofSlot[] = [
  { id: 's1', label: 'Base impermeable', order: 1, accepts: 'waterproof', filled: false, placedEmoji: null, placedName: null, message: '¡Base impermeable! Protege el edificio del agua.' },
  { id: 's2', label: 'Capa de drenaje', order: 2, accepts: 'drainage', filled: false, placedEmoji: null, placedName: null, message: '¡Drenaje listo! El agua extra puede salir.' },
  { id: 's3', label: 'Tela filtro', order: 3, accepts: 'filter', filled: false, placedEmoji: null, placedName: null, message: '¡Filtro colocado! La tierra no tapa el drenaje.' },
  { id: 's4', label: 'Sustrato / tierra', order: 4, accepts: 'soil', filled: false, placedEmoji: null, placedName: null, message: '¡Sustrato! Tierra ligera donde crecerán las plantas.' },
  { id: 's5', label: 'Plantas', order: 5, accepts: 'plants', filled: false, placedEmoji: null, placedName: null, message: '¡Plantas! El techo verde está completo. 🌱' },
]

// 5 correctas + 3 distractores, shuffled al iniciar
const itemsData: RoofItem[] = [
  { id: 'i1', name: 'Impermeabilizante', emoji: '🛡️', type: 'waterproof', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i2', name: 'Drenaje', emoji: '🕳️', type: 'drainage', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i3', name: 'Filtro', emoji: '🧽', type: 'filter', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i4', name: 'Sustrato', emoji: '🏔️', type: 'soil', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i5', name: 'Plantas nativas', emoji: '🌿', type: 'plants', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i6', name: 'Cemento', emoji: '🧱', type: 'cement', used: false, rejected: false, isDistractor: true, distractorMsg: 'El cemento no deja crecer las raíces ni absorbe agua. ¡Es lo opuesto a un techo verde!' },
  { id: 'i7', name: 'Pintura verde', emoji: '🎨', type: 'paint', used: false, rejected: false, isDistractor: true, distractorMsg: 'Pintar el techo de verde no lo convierte en techo verde. ¡Se necesitan plantas de verdad!' },
  { id: 'i8', name: 'Plástico', emoji: '🛍️', type: 'plastic', used: false, rejected: false, isDistractor: true, distractorMsg: 'El plástico no deja respirar al techo y contamina. No sirve como capa.' },
]

const slots = ref<RoofSlot[]>([])
const items = ref<RoofItem[]>([])
const selectedItem = ref<RoofItem | null>(null)
const layersPlaced = ref(0)
const isComplete = computed(() => layersPlaced.value >= 5)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

// Next slot that should be filled (bottom to top)
const nextSlotIndex = computed(() => slots.value.findIndex(s => !s.filled))

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function onStart() {
  slots.value = slotsData.map(s => ({ ...s }))
  items.value = shuffle(itemsData.map(i => ({ ...i })))
  layersPlaced.value = 0
  selectedItem.value = null
}

function selectItem(item: RoofItem) {
  if (item.used) return
  selectedItem.value = item
}

function placeInSlot(slot: RoofSlot) {
  if (slot.filled) return
  if (!selectedItem.value) {
    showFB('Necesitas elegir una capa primero. 💡 Toca una capa del tray y luego toca el nivel correcto del techo.', false)
    return
  }

  const item = selectedItem.value

  // Distractor — wrong for any zone
  if (item.isDistractor) {
    showFB(item.distractorMsg, false)
    item.rejected = true
    selectedItem.value = null
    const slotEl = document.querySelector(`[data-slot="${slot.id}"]`)
    if (slotEl) shakeWrong(slotEl)
    return
  }

  // Correct match
  if (item.type === slot.accepts) {
    slot.filled = true
    slot.placedEmoji = item.emoji
    slot.placedName = item.name
    item.used = true
    layersPlaced.value++
    selectedItem.value = null
    showFB(slot.message, true)

    nextTick(() => {
      const slotEl = document.querySelector(`[data-slot="${slot.id}"] .slot-emoji`)
      if (slotEl) celebrateSuccess(slotEl)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.greenroof-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    showFB('Esa capa no va en ese nivel. 💡 El orden es de abajo a arriba: base → drenaje → filtro → tierra → plantas.', false)
    const slotEl = document.querySelector(`[data-slot="${slot.id}"]`)
    if (slotEl) shakeWrong(slotEl)
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
}

function resetGame() {
  slots.value = slotsData.map(s => ({ ...s }))
  items.value = shuffle(itemsData.map(i => ({ ...i })))
  layersPlaced.value = 0
  selectedItem.value = null
  showResult.value = false
}
</script>

<style scoped>
.greenroof-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.rooftop-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
  padding: 8px;
}

.building {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 320px;
}

.building__roof {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
  padding: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  border: 2px dashed rgba(0,0,0,0.15);
  border-bottom: none;
}

.building__body {
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, #a8a29e, #78716c);
  border-radius: 0 0 4px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 6px 12px;
}

.building__window {
  width: 20px;
  height: 22px;
  background: #fef3c7;
  border: 2px solid #57534e;
  border-radius: 2px;
}

.building__door {
  width: 18px;
  height: 30px;
  background: #92400e;
  border-radius: 2px 2px 0 0;
  border: 2px solid #78350f;
}

/* Slots */
.roof-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.5);
  border: 2px dashed rgba(0,0,0,0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
  min-height: 42px;
}

.roof-slot:active { transform: scale(0.97); }

.roof-slot--next {
  border-color: var(--color-green-mid);
  background: rgba(69,201,122,0.15);
  animation: pulse 1.5s ease-in-out infinite;
}

.roof-slot--highlight {
  border-color: var(--color-green-mid);
  background: rgba(69,201,122,0.1);
}

.roof-slot--filled {
  border: 2px solid var(--color-green-mid);
  background: rgba(69,201,122,0.2);
  cursor: default;
}

.slot-number {
  width: 22px;
  height: 22px;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: var(--color-text);
}

.slot-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
}

.slot-emoji {
  font-size: 22px;
}

.slot-name {
  font-size: 12px;
  font-weight: 800;
  color: var(--color-green-dark);
}

/* Items tray */
.items-tray {
  padding: 10px 16px;
  background: rgba(255,255,255,0.80);
  position: relative;
  z-index: 5;
  border-top: 3px solid rgba(0,0,0,0.08);
}

.tray-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 6px;
}

.items-row {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.item-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  background: white;
  border: 2px solid var(--color-green-mid);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-width: 58px;
}

.item-btn:active { transform: scale(0.95); }

.item-btn--selected {
  border-color: var(--color-yellow);
  background: #fff8e1;
  box-shadow: 0 0 0 2px var(--color-yellow);
  transform: scale(1.05);
}

.item-btn--used {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-btn--rejected {
  opacity: 0.2;
  cursor: not-allowed;
  border-color: var(--color-coral);
  text-decoration: line-through;
}

.item-emoji { font-size: 22px; }
.item-name { font-size: 9px; font-weight: 700; color: var(--color-text); text-align: center; }

/* feedback handled by global .game-feedback */


.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
