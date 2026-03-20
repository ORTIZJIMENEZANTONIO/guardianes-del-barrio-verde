<template>
  <MinigameShell
    title="Plantar sombra"
    description="Coloca árboles en los puntos estratégicos de la calle para crear sombra donde más se necesita."
    :completed="treesPlanted"
    :total="4"
    :is-success="isComplete"
    :show-result="showResult"
    @start="onStart"
    @complete="$emit('complete')"
    @retry="resetGame"
  >
    <div class="planter-game">
      <!-- Street grid -->
      <div class="street-grid">
        <div
          v-for="slot in plantSlots"
          :key="slot.id"
          class="plant-slot"
          :class="{
            'plant-slot--valid': slot.isValid,
            'plant-slot--planted': slot.planted,
            'plant-slot--wrong': slot.wrongAttempt,
          }"
          :style="{ left: slot.x + '%', top: slot.y + '%' }"
          @click="tryPlant(slot)"
        >
          <template v-if="slot.planted">
            <span class="planted-tree">🌳</span>
            <div class="shade-circle" />
          </template>
          <template v-else>
            <span class="slot-icon">{{ slot.emoji }}</span>
            <span class="slot-label">{{ slot.label }}</span>
          </template>
        </div>
      </div>

      <!-- Seed counter -->
      <div class="seed-bar">
        <div class="seed-info">
          <span>🌱</span>
          <span>Semillas: {{ seedsRemaining }}</span>
        </div>
        <div class="seed-hint">Toca un buen lugar para plantar</div>
      </div>

      <!-- Feedback -->
      <Transition name="fade">
        <div v-if="feedback" class="plant-feedback" :class="feedback.ok ? 'fb--ok' : 'fb--no'">
          {{ feedback.message }}
        </div>
      </Transition>
    </div>
  </MinigameShell>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

interface PlantSlot {
  id: string
  label: string
  emoji: string
  isValid: boolean
  x: number
  y: number
  planted: boolean
  wrongAttempt: boolean
  reason: string
}

const slotsData: PlantSlot[] = [
  { id: 'p1', label: 'Junto a banca', emoji: '🪑', isValid: true, x: 15, y: 55, planted: false, wrongAttempt: false, reason: 'Perfecto: dará sombra a la banca.' },
  { id: 'p2', label: 'Banqueta', emoji: '🚶', isValid: true, x: 45, y: 40, planted: false, wrongAttempt: false, reason: 'Los peatones tendrán sombra.' },
  { id: 'p3', label: 'Frente a casa', emoji: '🏠', isValid: true, x: 70, y: 30, planted: false, wrongAttempt: false, reason: 'Bajará el calor en la fachada.' },
  { id: 'p4', label: 'Esquina', emoji: '📍', isValid: true, x: 30, y: 70, planted: false, wrongAttempt: false, reason: 'Excelente punto de sombra urbana.' },
  { id: 'p5', label: 'Sobre tubería', emoji: '🔧', isValid: false, x: 55, y: 65, planted: false, wrongAttempt: false, reason: 'Las raíces podrían dañar la tubería.' },
  { id: 'p6', label: 'Cable eléctrico', emoji: '⚡', isValid: false, x: 80, y: 20, planted: false, wrongAttempt: false, reason: 'Hay cables cerca, no es seguro.' },
  { id: 'p7', label: 'Entrada garage', emoji: '🚗', isValid: false, x: 20, y: 25, planted: false, wrongAttempt: false, reason: 'Bloquearía la entrada del garage.' },
]

const plantSlots = ref<PlantSlot[]>([])
const treesPlanted = ref(0)
const seedsRemaining = ref(6)
const isComplete = computed(() => treesPlanted.value >= 4)
const showResult = ref(false)
const feedback = ref<{ message: string; ok: boolean } | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

function onStart() {
  plantSlots.value = slotsData.map(s => ({ ...s }))
  seedsRemaining.value = 6
  treesPlanted.value = 0
}

function tryPlant(slot: PlantSlot) {
  if (slot.planted || seedsRemaining.value <= 0) return

  if (slot.isValid) {
    slot.planted = true
    treesPlanted.value++
    seedsRemaining.value--
    showFB(slot.reason, true)
    if (isComplete.value) {
      setTimeout(() => { showResult.value = true }, 800)
    }
  } else {
    slot.wrongAttempt = true
    seedsRemaining.value--
    showFB(slot.reason, false)
    setTimeout(() => { slot.wrongAttempt = false }, 1000)
    if (seedsRemaining.value <= 0 && !isComplete.value) {
      setTimeout(() => { showResult.value = true }, 1000)
    }
  }
}

function showFB(message: string, ok: boolean) {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { message, ok }
  feedbackTimer = setTimeout(() => { feedback.value = null }, 2000)
}

function resetGame() {
  plantSlots.value = slotsData.map(s => ({ ...s }))
  treesPlanted.value = 0
  seedsRemaining.value = 6
  showResult.value = false
}
</script>

<style scoped>
.planter-game {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #87ceeb 0%, #e8e0d0 40%, #c9b896 100%);
  position: relative;
}

.street-grid {
  flex: 1;
  position: relative;
}

.plant-slot {
  position: absolute;
  width: 75px;
  height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 3px dashed rgba(45,106,79,0.5);
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.plant-slot:active { transform: scale(0.95); }

.plant-slot--valid:not(.plant-slot--planted) {
  border-color: var(--color-green-mid);
}

.plant-slot--planted {
  border: none;
  background: rgba(82,183,136,0.2);
  cursor: default;
}

.plant-slot--wrong {
  border-color: var(--color-coral);
  background: rgba(249,65,68,0.1);
  animation: shake 0.4s ease;
}

.slot-icon { font-size: 22px; }
.slot-label { font-size: 10px; font-weight: 800; color: var(--color-text); text-align: center; }

.planted-tree {
  font-size: 36px;
  animation: scaleIn 0.5s ease;
}

.shade-circle {
  position: absolute;
  bottom: -5px;
  width: 50px;
  height: 20px;
  background: rgba(45,106,79,0.2);
  border-radius: 50%;
}

.seed-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(255,255,255,0.95);
}

.seed-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 14px;
  color: var(--color-green-dark);
}

.seed-hint { font-size: 12px; font-weight: 600; color: var(--color-text); }

.plant-feedback {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 13px;
  max-width: 280px;
  text-align: center;
  animation: slideUp 0.3s ease;
  z-index: 5;
}

.fb--ok { background: rgba(82,183,136,0.95); color: white; }
.fb--no { background: rgba(249,65,68,0.95); color: white; }
</style>
