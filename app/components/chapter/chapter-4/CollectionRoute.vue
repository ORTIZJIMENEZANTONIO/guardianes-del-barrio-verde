<template>
  <MinigameShell
    title="Armar la ruta"
    description="Coloca los 5 puntos de recolección en los lugares correctos de la calle."
    :completed="itemsPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="route-game">
      <SceneSky :variant="transformLevel >= 4 ? 'nice' : 'hot'" />
      <SceneStreet :variant="transformLevel >= 4 ? 'clean' : 'dirty'" />

      <div class="scene-area">
        <!-- Need zones on the street -->
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="place-zone"
          :class="{
            'place-zone--filled': zone.filled,
            'place-zone--highlight': selectedItem && !zone.filled,
          }"
          :style="{ left: zone.x + '%', top: zone.y + '%' }"
          :data-zone="zone.id"
          @click="placeInZone(zone)"
        >
          <template v-if="zone.filled">
            <span class="placed-emoji">{{ zone.placedEmoji }}</span>
          </template>
          <template v-else>
            <span class="zone-need-icon">{{ zone.needEmoji }}</span>
            <span class="zone-need">{{ zone.need }}</span>
          </template>
        </div>

        <!-- Route line connecting placed points -->
        <Transition name="fade">
          <div v-if="transformLevel >= 2" class="visual-improvement" style="left: 50%; top: 10%; animation-delay: 0.3s;">🚛</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 4" class="visual-improvement" style="right: 15%; top: 35%; animation-delay: 1s;">♻️</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 5" class="visual-improvement" style="left: 30%; bottom: 15%; animation-delay: 0.5s;">👨‍👩‍👧‍👦</div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="route-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Items tray -->
      <div class="items-tray">
        <div class="tray-title">Puntos de recolección disponibles:</div>
        <div class="items-row">
          <button
            v-for="item in items"
            :key="item.id"
            class="item-btn"
            :class="{
              'item-btn--selected': selectedItem?.id === item.id,
              'item-btn--used': item.used,
              'item-btn--rejected': item.rejected,
            }"
            :disabled="item.used || item.rejected"
            @click="selectItem(item)"
          >
            <span class="item-emoji">{{ item.emoji }}</span>
            <span class="item-name">{{ item.name }}</span>
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

interface PlaceZone {
  id: string
  need: string
  needEmoji: string
  accepts: string
  x: number
  y: number
  filled: boolean
  placedEmoji: string | null
  successMsg: string
}

interface RouteItem {
  id: string
  name: string
  emoji: string
  type: string
  used: boolean
  rejected: boolean
  isDistractor: boolean
  distractorMsg: string
}

const zonesData: PlaceZone[] = [
  { id: 'z1', need: 'Frente a la tienda', needEmoji: '🏪', accepts: 'shop-bin', x: 12, y: 45, filled: false, placedEmoji: null,
    successMsg: 'Las tiendas generan muchos empaques. Un contenedor aquí evita que terminen en la calle.' },
  { id: 'z2', need: 'Junto a la escuela', needEmoji: '🏫', accepts: 'school-bin', x: 68, y: 22, filled: false, placedEmoji: null,
    successMsg: 'Los niños aprenden a separar si tienen dónde hacerlo.' },
  { id: 'z3', need: 'Entrada del parque', needEmoji: '🏞️', accepts: 'park-bin', x: 42, y: 55, filled: false, placedEmoji: null,
    successMsg: 'Los visitantes del parque necesitan contenedores accesibles.' },
  { id: 'z4', need: 'Esquina concurrida', needEmoji: '🚶‍♂️', accepts: 'corner-bin', x: 55, y: 35, filled: false, placedEmoji: null,
    successMsg: 'Donde pasa más gente, más basura se genera. Un punto aquí es clave.' },
  { id: 'z5', need: 'Zona de casas', needEmoji: '🏘️', accepts: 'house-bin', x: 25, y: 28, filled: false, placedEmoji: null,
    successMsg: 'Los hogares son el inicio de la ruta. Aquí empieza la separación.' },
]

const itemsData: RouteItem[] = [
  { id: 'i1', name: 'Contenedor tienda', emoji: '🏪', type: 'shop-bin', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i2', name: 'Contenedor escuela', emoji: '🏫', type: 'school-bin', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i3', name: 'Contenedor parque', emoji: '🏞️', type: 'park-bin', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i4', name: 'Contenedor esquina', emoji: '📍', type: 'corner-bin', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i5', name: 'Contenedor casas', emoji: '🏘️', type: 'house-bin', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i6', name: 'Lote baldío', emoji: '🏚️', type: 'abandoned-lot', used: false, rejected: false, isDistractor: true,
    distractorMsg: 'Un lote baldío no es un buen lugar para recolección. Nadie lo cuida y se convierte en tiradero.' },
  { id: 'i7', name: 'Carretera', emoji: '🛣️', type: 'highway', used: false, rejected: false, isDistractor: true,
    distractorMsg: 'La carretera es peligrosa para poner contenedores. La ruta debe estar en zonas habitadas.' },
]

const zones = ref<PlaceZone[]>([])
const items = ref<RouteItem[]>([])
const selectedItem = ref<RouteItem | null>(null)
const itemsPlaced = ref(0)
const transformLevel = ref(0)
const isComplete = computed(() => itemsPlaced.value >= 5)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function onStart() {
  zones.value = zonesData.map(z => ({ ...z }))
  items.value = shuffle(itemsData.map(i => ({ ...i })))
  itemsPlaced.value = 0
  transformLevel.value = 0
  selectedItem.value = null
}

function selectItem(item: RouteItem) {
  if (item.used || item.rejected) return
  selectedItem.value = item
}

function placeInZone(zone: PlaceZone) {
  if (zone.filled) return
  if (!selectedItem.value) {
    showFB('Primero selecciona un punto de recolección de abajo', false)
    return
  }

  const item = selectedItem.value

  // Distractor: wrong for ANY zone
  if (item.isDistractor) {
    showFB(item.distractorMsg, false)
    item.rejected = true
    selectedItem.value = null
    const zoneEl = document.querySelector(`[data-zone="${zone.id}"]`)
    if (zoneEl) shakeWrong(zoneEl)
    return
  }

  // Correct match
  if (item.type === zone.accepts) {
    zone.filled = true
    zone.placedEmoji = item.emoji
    item.used = true
    itemsPlaced.value++
    transformLevel.value++
    showFB(zone.successMsg, true)
    selectedItem.value = null

    nextTick(() => {
      const zoneEl = document.querySelector(`[data-zone="${zone.id}"] .placed-emoji`)
      if (zoneEl) celebrateSuccess(zoneEl)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.route-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    // Wrong zone for this item
    showFB('Ese punto no corresponde a este lugar. 💡 Fíjate en lo que hay en esta zona.', false)
    const zoneEl = document.querySelector(`[data-zone="${zone.id}"]`)
    if (zoneEl) shakeWrong(zoneEl)
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 2500)
}

function resetGame() {
  zones.value = zonesData.map(z => ({ ...z }))
  items.value = shuffle(itemsData.map(i => ({ ...i })))
  itemsPlaced.value = 0
  transformLevel.value = 0
  selectedItem.value = null
  showResult.value = false
}
</script>

<style scoped>
.route-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.scene-area {
  flex: 1;
  position: relative;
  z-index: 5;
  background: transparent;
}

.place-zone {
  position: absolute;
  width: 80px;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 2px dashed rgba(0, 0, 0, 0.35);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 6px 4px;
}

.place-zone--highlight {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.15);
  animation: pulse 1s infinite;
}

.place-zone--filled {
  border: none;
  background: none;
  cursor: default;
}

.zone-need-icon { font-size: 22px; }
.zone-need { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; line-height: 1.2; }

.placed-emoji {
  font-size: 36px;
  animation: scaleIn 0.5s ease;
}

.visual-improvement {
  position: absolute;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
  pointer-events: none;
}

/* Items tray */
.items-tray {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 5;
  border-top: 3px solid rgba(0, 0, 0, 0.08);
}

.tray-title {
  font-size: 11px;
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
  padding: 6px 8px;
  background: white;
  border: 2px solid #f97316;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-width: 56px;
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
.route-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
  z-index: 50;
  animation: scaleIn 0.3s ease;
  text-align: center;
  max-width: 280px;
  box-shadow: var(--shadow-lg);
}

.fb--ok { background: rgba(82, 183, 136, 0.95); color: white; }
.fb--no { background: rgba(249, 65, 68, 0.95); color: white; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
