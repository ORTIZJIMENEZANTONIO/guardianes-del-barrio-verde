<template>
  <MinigameShell
    title="Recuperar el espacio"
    description="Cada punto de la calle tiene un problema. Elige la solución correcta para cada uno."
    :completed="itemsPlaced"
    :total="5"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="restore-game">
      <SceneSky :variant="transformLevel >= 4 ? 'nice' : 'hot'" />
      <SceneStreet :variant="transformLevel >= 4 ? 'clean' : 'dirty'" />

      <div class="scene-area">
        <!-- Problem zones -->
        <div
          v-for="zone in zones"
          :key="zone.id"
          class="place-zone game-zone"
          :class="{
            'place-zone--filled game-zone--filled': zone.filled,
            'place-zone--highlight game-zone--highlight':
              selectedItem && !zone.filled,
          }"
          :style="{ left: zone.x + '%', top: zone.y + '%' }"
          :data-zone="zone.id"
          @click="placeInZone(zone)"
        >
          <template v-if="zone.filled">
            <GameIcon :emoji="zone.placedEmoji" :size="28" class="placed-emoji" />
          </template>
          <template v-else>
            <GameIcon :emoji="zone.problemEmoji" :size="22" class="zone-problem-icon" />
            <span class="zone-problem">{{ zone.problem }}</span>
          </template>
        </div>

        <!-- Visual improvements -->
        <Transition name="fade">
          <div
            v-if="transformLevel >= 2"
            class="visual-improvement"
            style="right: 12%; top: 38%"
          >
            🌸
          </div>
        </Transition>
        <Transition name="fade">
          <div
            v-if="transformLevel >= 3"
            class="visual-improvement"
            style="left: 35%; top: 12%; animation-delay: 1s"
          >
            🦋
          </div>
        </Transition>
        <Transition name="fade">
          <div
            v-if="transformLevel >= 5"
            class="visual-improvement"
            style="right: 20%; bottom: 20%; animation-delay: 0.5s"
          >
            👨‍👩‍👧
          </div>
        </Transition>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div
          v-if="feedback"
          class="restore-feedback game-feedback"
          :class="
            feedback.ok
              ? 'fb--ok game-feedback--ok'
              : 'fb--no game-feedback--no'
          "
        >
          {{ feedback.message }}
        </div>
      </Transition>

      <!-- Items tray -->
      <div class="items-tray game-tray">
        <div class="tray-title game-tray__title">Soluciones disponibles:</div>
        <div class="items-row">
          <button
            v-for="item in items"
            :key="item.id"
            class="item-btn game-item"
            :class="{
              'item-btn--selected game-item--selected':
                selectedItem?.id === item.id,
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
import { useGameAnimations } from "~/composables/useGameAnimations";

const emit = defineEmits<{ complete: [] }>();
const { shakeWrong, celebrateSuccess, confettiBurst } = useGameAnimations();

interface PlaceZone {
  id: string;
  problem: string;
  problemEmoji: string;
  accepts: string;
  x: number;
  y: number;
  filled: boolean;
  placedEmoji: string | null;
  successMsg: string;
}

interface RestoreItem {
  id: string;
  name: string;
  emoji: string;
  type: string;
  used: boolean;
  rejected: boolean;
  isDistractor: boolean;
  distractorMsg: string;
}

// Zonas con PROBLEMAS — el jugador piensa qué solución aplica
const zonesData: PlaceZone[] = [
  {
    id: "z1",
    problem: "Esquina oscura",
    problemEmoji: "🌑",
    accepts: "lamp",
    x: 12,
    y: 50,
    filled: false,
    placedEmoji: null,
    successMsg:
      "Una calle iluminada es más segura y se siente más viva de noche.",
  },
  {
    id: "z2",
    problem: "Pared vacía y gris",
    problemEmoji: "🧱",
    accepts: "mural",
    x: 68,
    y: 20,
    filled: false,
    placedEmoji: null,
    successMsg:
      "Un mural hecho por la comunidad le da identidad al barrio y ahuyenta el vandalismo.",
  },
  {
    id: "z3",
    problem: "Nadie se detiene aquí",
    problemEmoji: "🚶",
    accepts: "bench",
    x: 40,
    y: 58,
    filled: false,
    placedEmoji: null,
    successMsg:
      "Una banca invita a la gente a quedarse, platicar y cuidar el espacio.",
  },
  {
    id: "z4",
    problem: "Basura en el piso",
    problemEmoji: "🛍️",
    accepts: "bin",
    x: 58,
    y: 65,
    filled: false,
    placedEmoji: null,
    successMsg:
      "Con un bote cerca, la gente tiene dónde tirar su basura correctamente.",
  },
  {
    id: "z5",
    problem: "Sol directo, sin sombra",
    problemEmoji: "☀️",
    accepts: "planter",
    x: 25,
    y: 30,
    filled: false,
    placedEmoji: null,
    successMsg: "Las plantas dan sombra, absorben calor y alegran la vista.",
  },
];

// 5 soluciones correctas + 2 distractores
const itemsData: RestoreItem[] = [
  {
    id: "i1",
    name: "Banca",
    emoji: "🪑",
    type: "bench",
    used: false,
    rejected: false,
    isDistractor: false,
    distractorMsg: "",
  },
  {
    id: "i2",
    name: "Jardinera",
    emoji: "🪴",
    type: "planter",
    used: false,
    rejected: false,
    isDistractor: false,
    distractorMsg: "",
  },
  {
    id: "i3",
    name: "Mural",
    emoji: "🎨",
    type: "mural",
    used: false,
    rejected: false,
    isDistractor: false,
    distractorMsg: "",
  },
  {
    id: "i4",
    name: "Contenedor",
    emoji: "🗑️",
    type: "bin",
    used: false,
    rejected: false,
    isDistractor: false,
    distractorMsg: "",
  },
  {
    id: "i5",
    name: "Luminaria solar",
    emoji: "💡",
    type: "lamp",
    used: false,
    rejected: false,
    isDistractor: false,
    distractorMsg: "",
  },
  {
    id: "i6",
    name: "Carpa de circo",
    emoji: "🎪",
    type: "circus",
    used: false,
    rejected: false,
    isDistractor: true,
    distractorMsg: "Una carpa no resuelve un problema permanente de la calle.",
  },
  {
    id: "i7",
    name: "Alberca inflable",
    emoji: "🏊",
    type: "pool",
    used: false,
    rejected: false,
    isDistractor: true,
    distractorMsg:
      "La calle necesita soluciones urbanas, no diversión temporal.",
  },
];

const zones = ref<PlaceZone[]>([]);
const items = ref<RestoreItem[]>([]);
const selectedItem = ref<RestoreItem | null>(null);
const itemsPlaced = ref(0);
const transformLevel = ref(0);
const isComplete = computed(() => itemsPlaced.value >= 5);
const showResult = ref(false);
const feedback = ref<{ message: string; ok: boolean } | null>(null);
let feedbackTimer: ReturnType<typeof setTimeout> | null = null;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function onStart() {
  zones.value = zonesData.map((z) => ({ ...z }));
  items.value = shuffle(itemsData.map((i) => ({ ...i })));
  itemsPlaced.value = 0;
  transformLevel.value = 0;
  selectedItem.value = null;
}

function selectItem(item: RestoreItem) {
  if (item.used || item.rejected) return;
  selectedItem.value = item;
}

function placeInZone(zone: PlaceZone) {
  if (zone.filled) return;
  if (!selectedItem.value) {
    showFB(
      "Necesitas elegir una solución primero. 💡 Toca un elemento del tray y luego toca la zona del problema.",
      false
    );
    return;
  }

  const item = selectedItem.value;

  // Distractor: wrong for ANY zone
  if (item.isDistractor) {
    showFB(item.distractorMsg, false);
    item.rejected = true;
    selectedItem.value = null;
    const zoneEl = document.querySelector(`[data-zone="${zone.id}"]`);
    if (zoneEl) shakeWrong(zoneEl);
    return;
  }

  // Correct match
  if (item.type === zone.accepts) {
    zone.filled = true;
    zone.placedEmoji = item.emoji;
    item.used = true;
    itemsPlaced.value++;
    transformLevel.value++;
    showFB(zone.successMsg, true);
    selectedItem.value = null;

    nextTick(() => {
      const zoneEl = document.querySelector(
        `[data-zone="${zone.id}"] .placed-emoji`
      );
      if (zoneEl) celebrateSuccess(zoneEl);
    });

    if (isComplete.value) {
      const gameEl = document.querySelector(".restore-game");
      if (gameEl) confettiBurst(gameEl, 24);
      setTimeout(() => {
        showResult.value = true;
      }, 1000);
    }
  } else {
    // Wrong zone for this item
    showFB(
      "Esa solución no es para este problema. 💡 Lee el ícono de la zona: ¿qué falta aquí? ¿Luz, sombra, lugar para sentarse?",
      false
    );
    const zoneEl = document.querySelector(`[data-zone="${zone.id}"]`);
    if (zoneEl) shakeWrong(zoneEl);
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedback.value = { message, ok };
  feedbackTimer = setTimeout(() => {
    feedback.value = null;
  }, 3500);
}

function resetGame() {
  zones.value = zonesData.map((z) => ({ ...z }));
  items.value = shuffle(itemsData.map((i) => ({ ...i })));
  itemsPlaced.value = 0;
  transformLevel.value = 0;
  selectedItem.value = null;
  showResult.value = false;
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
  border-color: var(--color-green-mid);
  background: rgba(82, 183, 136, 0.2);
  animation: pulse 1s infinite;
}

.place-zone--filled {
  border: none;
  background: none;
  cursor: default;
}

.zone-problem-icon {
  font-size: 22px;
}
.zone-problem {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  line-height: 1.2;
}

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
  background: rgba(255, 255, 255, 0.80);
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
  border: 2px solid var(--color-green-mid);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-width: 56px;
}

.item-btn:active {
  transform: scale(0.95);
}

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

.item-emoji {
  font-size: 22px;
}
.item-name {
  font-size: 9px;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
}

/* feedback handled by global .game-feedback */


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
