<template>
  <MinigameShell
    title="Preparar el espacio"
    description="Coloca las 5 estaciones del festival en el barrio. Elige bien: no todas sirven."
    :completed="itemsPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="setup-game">
      <SceneSky variant="nice" />
      <SceneStreet variant="clean" />

      <div class="scene-area">
        <!-- Station zones -->
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="place-zone game-zone"
          :class="{
            'place-zone--filled game-zone--filled': zone.filled,
            'place-zone--highlight game-zone--highlight': selectedItem && !zone.filled,
          }"
          :style="{ left: zone.x + '%', top: zone.y + '%' }"
          :data-zone="zone.id"
          @click="placeInZone(zone)"
        >
          <template v-if="zone.filled">
            <GameIcon :emoji="zone.placedEmoji" :size="28" class="placed-emoji game-zone__placed" />
          </template>
          <template v-else>
            <GameIcon :emoji="zone.icon" :size="22" class="zone-icon game-zone__icon" />
            <span class="zone-label game-zone__label">{{ zone.label }}</span>
          </template>
        </div>

        <!-- Visual improvements -->
        <Transition name="fade">
          <div v-if="transformLevel >= 2" class="visual-improvement" style="right: 10%; top: 35%;">🎈</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 3" class="visual-improvement" style="left: 30%; top: 15%; animation-delay: 1s;">🦋</div>
        </Transition>
        <Transition name="fade">
          <div v-if="transformLevel >= 5" class="visual-improvement" style="right: 18%; bottom: 22%; animation-delay: 0.5s;">👨‍👩‍👧‍👦</div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="setup-feedback game-feedback" :class="feedback.ok ? 'fb--ok game-feedback--ok' : 'fb--no game-feedback--no'">
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Items tray -->
      <div class="items-tray game-tray">
        <div class="tray-title game-tray__title">Estaciones disponibles:</div>
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
            <GameIcon :emoji="item.emoji" :size="22" class="item-emoji game-item__emoji" />
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

interface PlaceZone {
  id: string
  label: string
  icon: string
  accepts: string
  x: number
  y: number
  filled: boolean
  placedEmoji: string | null
  successMsg: string
}

interface SetupItem {
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
  { id: 'z1', label: 'Composta', icon: '🌱', accepts: 'composta', x: 12, y: 45, filled: false, placedEmoji: null,
    successMsg: 'La composta transforma residuos organicos en tierra fertil. El ciclo de la naturaleza.' },
  { id: 'z2', label: 'Reciclaje', icon: '♻️', accepts: 'reciclaje', x: 55, y: 25, filled: false, placedEmoji: null,
    successMsg: 'Un taller de reciclaje ensena que la basura puede tener una segunda vida.' },
  { id: 'z3', label: 'Jardin', icon: '🌻', accepts: 'jardin', x: 75, y: 50, filled: false, placedEmoji: null,
    successMsg: 'Un jardin comunitario produce alimentos sanos y une a los vecinos.' },
  { id: 'z4', label: 'Foro', icon: '🎤', accepts: 'foro', x: 35, y: 60, filled: false, placedEmoji: null,
    successMsg: 'Un foro de charlas comparte conocimiento y motiva a mas personas a actuar.' },
  { id: 'z5', label: 'Juegos', icon: '⚽', accepts: 'juegos', x: 25, y: 28, filled: false, placedEmoji: null,
    successMsg: 'Los juegos al aire libre demuestran que la diversion no necesita pantallas ni plastico.' },
]

const itemsData: SetupItem[] = [
  { id: 'i1', name: 'Composta', emoji: '🌱', type: 'composta', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i2', name: 'Taller reciclaje', emoji: '♻️', type: 'reciclaje', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i3', name: 'Jardin', emoji: '🌻', type: 'jardin', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i4', name: 'Foro charlas', emoji: '🎤', type: 'foro', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i5', name: 'Zona juegos', emoji: '⚽', type: 'juegos', used: false, rejected: false, isDistractor: false, distractorMsg: '' },
  { id: 'i6', name: 'Comida chatarra', emoji: '🍔', type: 'chatarra', used: false, rejected: false, isDistractor: true,
    distractorMsg: 'La comida chatarra genera mucha basura y no es sustentable para un festival verde.' },
  { id: 'i7', name: 'Plasticos', emoji: '🛍️', type: 'plasticos', used: false, rejected: false, isDistractor: true,
    distractorMsg: 'Una tienda de plasticos va en contra del espiritu del festival. Mejor reducir.' },
]

const zones = ref<PlaceZone[]>([])
const items = ref<SetupItem[]>([])
const selectedItem = ref<SetupItem | null>(null)
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

function selectItem(item: SetupItem) {
  if (item.used || item.rejected) return
  selectedItem.value = item
}

function placeInZone(zone: PlaceZone) {
  if (zone.filled) return
  if (!selectedItem.value) {
    showFB('Necesitas elegir una estación primero. 💡 Toca una del tray y luego toca la zona donde quieres colocarla.', false)
    return
  }

  const item = selectedItem.value

  if (item.isDistractor) {
    showFB(item.distractorMsg, false)
    item.rejected = true
    selectedItem.value = null
    const zoneEl = document.querySelector(`[data-zone="${zone.id}"]`)
    if (zoneEl) shakeWrong(zoneEl)
    return
  }

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
      const gameEl = document.querySelector('.setup-game')
      if (gameEl) confettiBurst(gameEl, 24)
      setTimeout(() => { showResult.value = true }, 1000)
    }
  } else {
    showFB('Esa estación no es adecuada aquí. 💡 Busca qué actividad sustentable funcionaría aquí.', false)
    const zoneEl = document.querySelector(`[data-zone="${zone.id}"]`)
    if (zoneEl) shakeWrong(zoneEl)
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 3500)
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
.setup-game {
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
  border-color: #8b5cf6;
  background: rgba(139,92,246,0.2);
  animation: pulse 1s infinite;
}

.place-zone--filled {
  border: none;
  background: none;
  cursor: default;
}

.zone-icon { font-size: 22px; }
.zone-label { font-size: 9px; font-weight: 800; color: var(--color-text); text-align: center; line-height: 1.2; }

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
  background: rgba(255,255,255,0.80);
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
  border: 2px solid #8b5cf6;
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

/* feedback handled by global .game-feedback */


.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
