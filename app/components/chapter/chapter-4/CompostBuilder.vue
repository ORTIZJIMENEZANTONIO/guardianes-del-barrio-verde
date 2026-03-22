<template>
  <MinigameShell
    title="Hacer composta"
    description="Coloca cada capa de la composta en el orden correcto, de abajo hacia arriba."
    :completed="layersPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="compost-game">
      <SceneSky variant="nice" />
      <SceneStreet variant="normal" />

      <!-- Compost bin area -->
      <div class="compost-area">
        <div class="compost-bin">
          <div class="bin__layers">
            <!-- Layer slots stacked vertically (bottom to top) -->
            <div
              v-for="(slot, i) in slots"
              :key="slot.id"
              class="compost-slot game-zone"
              :class="{
                'compost-slot--filled game-zone--filled': slot.filled,
                'compost-slot--highlight game-zone--highlight': selectedItem && !slot.filled,
                'compost-slot--next': !slot.filled && i === nextSlotIndex,
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
          <div class="bin__body">
            <div class="bin__label">Compostera</div>
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="compost-feedback game-feedback" :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'">
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

interface CompostSlot {
  id: string
  label: string
  order: number
  accepts: string
  filled: boolean
  placedEmoji: string | null
  placedName: string | null
  message: string
}

interface CompostItem {
  id: string
  name: string
  emoji: string
  type: string
  used: boolean
  rejected: boolean
  isDistractor: boolean
  distractorMsg: string
}

// 5 capas de la composta, de abajo (1) a arriba (5)
const slotsData: CompostSlot[] = [
  { id: 's1', label: 'Restos de comida', order: 1, accepts: 'food-scraps', filled: false, placedEmoji: null, placedName: null, message: 'Cascaras, restos de fruta y verdura. ¡La base de la composta!' },
  { id: 's2', label: 'Hojas secas', order: 2, accepts: 'dry-leaves', filled: false, placedEmoji: null, placedName: null, message: 'Las hojas secas aportan carbono y ayudan a que no se pudra.' },
  { id: 's3', label: 'Tierra', order: 3, accepts: 'soil', filled: false, placedEmoji: null, placedName: null, message: 'Un poco de tierra trae los microorganismos que descomponen todo.' },
  { id: 's4', label: 'Agua', order: 4, accepts: 'water', filled: false, placedEmoji: null, placedName: null, message: 'Humedad justa, como esponja exprimida. Ni encharcado ni seco.' },
  { id: 's5', label: 'Tapar', order: 5, accepts: 'cover', filled: false, placedEmoji: null, placedName: null, message: 'Tapar retiene calor y protege de animales. ¡Ahora a esperar!' },
]

// 5 correctas + 3 distractores, shuffled al iniciar
const itemsData: CompostItem[] = [
  { id: 'i1', name: 'Restos de comida', emoji: '🥕', type: 'food-scraps', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i2', name: 'Hojas secas', emoji: '🍂', type: 'dry-leaves', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i3', name: 'Tierra', emoji: '🏔️', type: 'soil', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i4', name: 'Agua', emoji: '💧', type: 'water', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i5', name: 'Tapa', emoji: '🪨', type: 'cover', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i6', name: 'Plastico', emoji: '🛍️', type: 'plastic', used: false, rejected: false, isDistractor: true, distractorMsg: '¡No! El plastico NO se descompone. Contamina la composta.' },
  { id: 'i7', name: 'Carne', emoji: '🥩', type: 'meat', used: false, rejected: false, isDistractor: true, distractorMsg: 'La carne atrae plagas y huele mal. Solo residuos vegetales.' },
  { id: 'i8', name: 'Metal', emoji: '🥫', type: 'metal', used: false, rejected: false, isDistractor: true, distractorMsg: 'El metal no se descompone. Va al contenedor de reciclaje.' },
]

const slots = ref<CompostSlot[]>([])
const items = ref<CompostItem[]>([])
const selectedItem = ref<CompostItem | null>(null)
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

function selectItem(item: CompostItem) {
  if (item.used) return
  selectedItem.value = item
}

function placeInSlot(slot: CompostSlot) {
  if (slot.filled) return
  if (!selectedItem.value) {
    showFB('Necesitas elegir una capa primero. 💡 Toca un material del tray y luego toca el nivel correcto.', false)
    return
  }

  const item = selectedItem.value

  // Distractor — wrong for any slot
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
      const gameEl = document.querySelector('.compost-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    showFB('Esa capa no va en ese nivel. 💡 El orden de abajo a arriba es: residuos → hojas → tierra → agua → tapar.', false)
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
.compost-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.compost-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
  padding: 8px;
}

.compost-bin {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 320px;
}

.bin__layers {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
  padding: 8px;
  background: rgba(139, 90, 43, 0.25);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  border: 2px dashed rgba(101, 67, 33, 0.4);
  border-bottom: none;
}

.bin__body {
  width: 100%;
  height: 40px;
  background: linear-gradient(180deg, #8B5E3C, #6B4226);
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bin__label {
  font-size: 12px;
  font-weight: 800;
  color: #fef3c7;
  letter-spacing: 0.5px;
}

/* Slots */
.compost-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
  min-height: 42px;
}

.compost-slot:active { transform: scale(0.97); }

.compost-slot--next {
  border-color: var(--color-green-mid);
  background: rgba(69, 201, 122, 0.15);
  animation: pulse 1.5s ease-in-out infinite;
}

.compost-slot--highlight {
  border-color: var(--color-green-mid);
  background: rgba(69, 201, 122, 0.1);
}

.compost-slot--filled {
  border: 2px solid var(--color-green-mid);
  background: rgba(69, 201, 122, 0.2);
  cursor: default;
}

.slot-number {
  width: 22px;
  height: 22px;
  background: rgba(0, 0, 0, 0.1);
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
  background: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 5;
  border-top: 3px solid rgba(0, 0, 0, 0.08);
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

/* Feedback */
.compost-feedback {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 14px;
  z-index: 50;
  animation: scaleIn 0.3s ease;
  text-align: center;
  max-width: 300px;
  box-shadow: var(--shadow-lg);
}

.fb--ok { background: rgba(82, 183, 136, 0.95); color: white; }
.fb--no { background: rgba(249, 65, 68, 0.95); color: white; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
