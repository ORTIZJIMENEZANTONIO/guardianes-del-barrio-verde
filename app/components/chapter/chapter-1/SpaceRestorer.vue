<template>
  <MinigameShell
    title="Recuperar el espacio"
    description="Coloca elementos para transformar la calle: bancas, macetas, murales y más."
    :completed="itemsPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="restore-game">
      <!-- Scene with placement zones -->
      <SceneSky :variant="transformLevel >= 4 ? 'nice' : 'hot'" />
      <SceneStreet :variant="transformLevel >= 4 ? 'clean' : 'dirty'" />
      <div class="scene-area" :class="{ 'scene--transformed': transformLevel >= 4 }">
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="place-zone"
          :class="{ 'place-zone--filled': zone.filled, 'place-zone--highlight': selectedItem && !zone.filled }"
          :style="{ left: zone.x + '%', top: zone.y + '%' }"
          :data-zone="zone.id"
          @click="placeInZone(zone)"
        >
          <template v-if="zone.filled">
            <span class="placed-emoji">{{ zone.placedEmoji }}</span>
          </template>
          <template v-else>
            <span class="zone-placeholder">{{ zone.placeholder }}</span>
            <span class="zone-label">{{ zone.label }}</span>
          </template>
        </div>

        <!-- Visual improvements that appear -->
        <Transition name="fade">
          <div v-if="transformLevel >= 2" class="visual-improvement improvement-1">
            🌸
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 3" class="visual-improvement improvement-2">
            🦋
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 5" class="visual-improvement improvement-3">
            👨‍👩‍👧
          </div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="restore-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
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
            :class="{ 'item-btn--selected': selectedItem?.id === item.id, 'item-btn--used': item.used }"
            :disabled="item.used"
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
const emit = defineEmits<{
  complete: []
}>()

interface PlaceZone {
  id: string
  label: string
  placeholder: string
  accepts: string
  x: number
  y: number
  filled: boolean
  placedEmoji: string | null
}

interface RestoreItem {
  id: string
  name: string
  emoji: string
  type: string
  used: boolean
}

const zonesData: PlaceZone[] = [
  { id: 'z1', label: 'Banca', placeholder: '⬜', accepts: 'bench', x: 15, y: 55, filled: false, placedEmoji: null },
  { id: 'z2', label: 'Maceta', placeholder: '⬜', accepts: 'planter', x: 45, y: 35, filled: false, placedEmoji: null },
  { id: 'z3', label: 'Mural', placeholder: '⬜', accepts: 'mural', x: 70, y: 20, filled: false, placedEmoji: null },
  { id: 'z4', label: 'Contenedor', placeholder: '⬜', accepts: 'bin', x: 60, y: 65, filled: false, placedEmoji: null },
  { id: 'z5', label: 'Letrero', placeholder: '⬜', accepts: 'sign', x: 25, y: 30, filled: false, placedEmoji: null },
]

const itemsData: RestoreItem[] = [
  { id: 'i1', name: 'Banca', emoji: '🪑', type: 'bench', used: false },
  { id: 'i2', name: 'Maceta', emoji: '🪴', type: 'planter', used: false },
  { id: 'i3', name: 'Mural', emoji: '🎨', type: 'mural', used: false },
  { id: 'i4', name: 'Contenedor', emoji: '🗑️', type: 'bin', used: false },
  { id: 'i5', name: 'Letrero', emoji: '🪧', type: 'sign', used: false },
]

const zones = ref<PlaceZone[]>([])
const items = ref<RestoreItem[]>([])
const selectedItem = ref<RestoreItem | null>(null)
const itemsPlaced = ref(0)
const transformLevel = ref(0)
const isComplete = computed(() => itemsPlaced.value >= 5)
const showResult = ref(false)

function onStart() {
  zones.value = zonesData.map(z => ({ ...z }))
  items.value = itemsData.map(i => ({ ...i }))
  itemsPlaced.value = 0
  transformLevel.value = 0
}

function selectItem(item: RestoreItem) {
  if (item.used) return
  selectedItem.value = item
}

import { useGameAnimations } from '~/composables/useGameAnimations'
const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations()

const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 1500)
}

function placeInZone(zone: PlaceZone) {
  if (zone.filled) return
  if (!selectedItem.value) {
    showFB('Primero selecciona un elemento de abajo', false)
    return
  }

  if (selectedItem.value.type === zone.accepts) {
    zone.filled = true
    zone.placedEmoji = selectedItem.value.emoji
    selectedItem.value.used = true
    itemsPlaced.value++
    transformLevel.value++
    showFB('¡Perfecto!', true)
    selectedItem.value = null

    nextTick(() => {
      const zoneEl = document.querySelector(`[data-zone="${zone.id}"] .placed-emoji`)
      if (zoneEl) celebrateSuccess(zoneEl)
    })

    if (isComplete.value) {
      const gameEl = document.querySelector('.restore-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    showFB('Ese elemento no va en este lugar', false)
    const zoneEl = document.querySelector(`[data-zone="${zone.id}"]`)
    if (zoneEl) shakeWrong(zoneEl)
  }
}

function resetGame() {
  zones.value = zonesData.map(z => ({ ...z }))
  items.value = itemsData.map(i => ({ ...i }))
  itemsPlaced.value = 0
  transformLevel.value = 0
  selectedItem.value = null
  showResult.value = false
}
</script>

<style scoped>
.restore-game {
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
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 2px dashed rgba(0,0,0,0.35);
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all var(--transition-fast);
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

.zone-placeholder { font-size: 24px; opacity: 0.5; }
.zone-label { font-size: 10px; font-weight: 800; color: var(--color-text); }

.placed-emoji {
  font-size: 36px;
  animation: scaleIn 0.5s ease;
}

.visual-improvement {
  position: absolute;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

.improvement-1 { right: 15%; top: 40%; }
.improvement-2 { left: 40%; top: 15%; animation-delay: 1s; }
.improvement-3 { right: 25%; bottom: 25%; animation-delay: 0.5s; }

.items-tray {
  padding: 12px 16px;
  background: rgba(255,255,255,0.95);
  position: relative;
  z-index: 5;
}

.tray-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.items-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.item-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: white;
  border: 2px solid var(--color-green-mid);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.item-btn:active { transform: scale(0.95); }

.item-btn--selected {
  border-color: var(--color-yellow);
  background: #fff8e1;
  box-shadow: 0 0 0 2px var(--color-yellow);
}

.item-btn--used {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-emoji { font-size: 24px; }
.item-name { font-size: 10px; font-weight: 700; color: var(--color-text); }

.restore-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 14px;
  z-index: 5;
  animation: scaleIn 0.3s ease;
  text-align: center;
  max-width: 260px;
}

.fb--ok { background: rgba(82,183,136,0.95); color: white; }
.fb--no { background: rgba(249,65,68,0.95); color: white; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
