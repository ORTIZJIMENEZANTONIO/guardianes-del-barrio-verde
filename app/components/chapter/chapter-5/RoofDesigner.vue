<template>
  <MinigameShell
    title="Diseñar el espacio"
    description="Selecciona una solución y colócala en la zona correcta de la azotea."
    :completed="itemsPlaced"
    :total="6"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="design-game">
      <SceneSky :variant="transformLevel >= 4 ? 'nice' : 'hot'" />
      <SceneStreet variant="normal" />

      <div class="scene-area">
        <!-- Placement zones on the rooftop -->
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

        <!-- Visual improvements as items are placed -->
        <Transition name="fade">
          <div v-if="transformLevel >= 2" class="visual-improvement" style="right: 10%; top: 20%;">🦋</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 4" class="visual-improvement" style="left: 25%; top: 10%; animation-delay: 1s;">🐝</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 6" class="visual-improvement" style="right: 15%; bottom: 25%; animation-delay: 0.5s;">🌿</div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="design-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Items tray -->
      <div class="items-tray">
        <div class="tray-title">Elementos disponibles:</div>
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

interface DesignItem {
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
  { id: 'z1', need: 'Zona de cultivo', needEmoji: '🥬', accepts: 'huerto', x: 10, y: 25, filled: false, placedEmoji: null,
    successMsg: 'Un huerto urbano produce alimentos frescos y reduce la huella de carbono del transporte.' },
  { id: 'z2', need: 'Recolección de agua', needEmoji: '🌧️', accepts: 'captador', x: 65, y: 15, filled: false, placedEmoji: null,
    successMsg: 'Un captador de lluvia puede recolectar hasta 50 litros por m² en una tormenta.' },
  { id: 'z3', need: 'Espacio para estar', needEmoji: '🪑', accepts: 'descanso', x: 40, y: 55, filled: false, placedEmoji: null,
    successMsg: 'Una zona de descanso con sombra invita a los vecinos a disfrutar la azotea.' },
  { id: 'z4', need: 'Vegetación perimetral', needEmoji: '🌿', accepts: 'jardineras', x: 5, y: 60, filled: false, placedEmoji: null,
    successMsg: 'Las jardineras en el borde protegen del viento y dan color todo el año.' },
  { id: 'z5', need: 'Reciclaje orgánico', needEmoji: '♻️', accepts: 'composta', x: 60, y: 65, filled: false, placedEmoji: null,
    successMsg: 'La composta convierte los restos de comida en nutrientes para las plantas. ¡Ciclo perfecto!' },
  { id: 'z6', need: 'Energía limpia', needEmoji: '⚡', accepts: 'panel', x: 35, y: 18, filled: false, placedEmoji: null,
    successMsg: 'Un panel solar en la azotea genera energía limpia y reduce el gasto de luz.' },
]

const itemsData: DesignItem[] = [
  { id: 'i1', name: 'Huerto', emoji: '🥕', type: 'huerto', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i2', name: 'Captador', emoji: '🪣', type: 'captador', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i3', name: 'Zona descanso', emoji: '☂️', type: 'descanso', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i4', name: 'Jardineras', emoji: '🌺', type: 'jardineras', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i5', name: 'Composta', emoji: '🍂', type: 'composta', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i6', name: 'Panel solar', emoji: '☀️', type: 'panel', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i7', name: 'Alberca', emoji: '🏊', type: 'pool', used: false, rejected: false, isDistractor: true,
    distractorMsg: 'Una alberca pesa demasiado para la azotea y desperdicia agua. ¡No es buena idea aquí!' },
  { id: 'i8', name: 'Estacionamiento', emoji: '🚗', type: 'parking', used: false, rejected: false, isDistractor: true,
    distractorMsg: 'Un estacionamiento en la azotea no ayuda al medio ambiente. ¡Mejor más verde!' },
]

const zones = ref<PlaceZone[]>([])
const items = ref<DesignItem[]>([])
const selectedItem = ref<DesignItem | null>(null)
const itemsPlaced = ref(0)
const transformLevel = ref(0)
const isComplete = computed(() => itemsPlaced.value >= 6)
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

function selectItem(item: DesignItem) {
  if (item.used || item.rejected) return
  selectedItem.value = item
}

function placeInZone(zone: PlaceZone) {
  if (zone.filled) return
  if (!selectedItem.value) {
    showFB('Necesitas elegir un elemento primero. 💡 Toca uno del tray y luego toca la zona donde quieres colocarlo.', false)
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
      const gameEl = document.querySelector('.design-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    // Wrong zone for this item
    showFB('Ese elemento no es adecuado para esta zona. 💡 Lee la descripción de la zona: ¿qué función necesita cumplir?', false)
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
.design-game {
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
  border: 2px dashed rgba(0,0,0,0.35);
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.8);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 6px 4px;
}

.place-zone--highlight {
  border-color: var(--color-green-mid);
  background: rgba(82,183,136,0.2);
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
  background: rgba(255,255,255,0.95);
  position: relative;
  z-index: 5;
  border-top: 3px solid rgba(0,0,0,0.08);
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
  border: 2px solid var(--color-green-mid);
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
.design-feedback {
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

.fb--ok { background: rgba(82,183,136,0.95); color: white; }
.fb--no { background: rgba(249,65,68,0.95); color: white; }

@keyframes scaleIn {
  from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(82,183,136,0.3); }
  50% { box-shadow: 0 0 10px 4px rgba(82,183,136,0.3); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
