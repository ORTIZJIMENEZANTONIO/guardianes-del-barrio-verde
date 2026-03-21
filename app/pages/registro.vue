<template>
  <div class="register-screen">
    <SceneSky variant="nice" />
    <SceneStreet variant="clean" />

    <div class="register-content">
      <!-- Step 1: Name -->
      <div v-if="step === 1" class="register-card animate-scale-in">
        <div class="register-emoji">👋</div>
        <h1 class="register-title">¿Cómo te llamas?</h1>
        <p class="register-subtitle">Escribe tu nombre para unirte a la brigada</p>
        <input
          ref="nameInputRef"
          v-model="name"
          class="register-input"
          type="text"
          placeholder="Tu nombre..."
          maxlength="20"
          autocomplete="off"
          @keyup.enter="goToStep2"
        />
        <GameButton
          variant="primary"
          size="lg"
          :disabled="name.trim().length < 2"
          @click="goToStep2"
        >
          Continuar ▶
        </GameButton>
      </div>

      <!-- Step 2: Age -->
      <div v-else-if="step === 2" class="register-card animate-scale-in">
        <div class="register-emoji">🎂</div>
        <h1 class="register-title">¡Hola, {{ name }}!</h1>
        <p class="register-subtitle">¿Cuántos años tienes?</p>
        <div class="age-grid">
          <button
            v-for="a in ages"
            :key="a"
            class="age-btn"
            :class="{ 'age-btn--selected': age === a }"
            @click="age = a"
          >
            {{ a }}
          </button>
        </div>
        <GameButton
          variant="primary"
          size="lg"
          :disabled="age === 0"
          @click="goToStep3"
        >
          ¡Listo! ▶
        </GameButton>
      </div>

      <!-- Step 3: Avatar customization -->
      <div v-else-if="step === 3" class="register-card animate-scale-in">
        <div class="register-emoji">🎨</div>
        <h1 class="register-title">Tu avatar</h1>
        <p class="register-subtitle">Personaliza tu guardián</p>

        <div class="avatar-preview">
          <PlayerAvatar :size="120" />
        </div>

        <!-- Skin tone -->
        <div class="avatar-section">
          <span class="avatar-label">Piel</span>
          <div class="avatar-options">
            <button
              v-for="(color, i) in skinColors"
              :key="'skin-' + i"
              class="avatar-color-btn"
              :class="{ 'avatar-color-btn--selected': avatarSkin === i }"
              :style="{ background: color }"
              @click="avatarSkin = i"
            />
          </div>
        </div>

        <!-- Hair style -->
        <div class="avatar-section">
          <span class="avatar-label">Cabello</span>
          <div class="avatar-options">
            <button
              v-for="(label, i) in hairLabels"
              :key="'hair-' + i"
              class="avatar-option-btn"
              :class="{ 'avatar-option-btn--selected': avatarHair === i }"
              :style="{ background: hairColors[i], color: '#fff' }"
              @click="avatarHair = i"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <!-- Accessory -->
        <div class="avatar-section">
          <span class="avatar-label">Accesorio</span>
          <div class="avatar-options">
            <button
              class="avatar-option-btn"
              :class="{ 'avatar-option-btn--selected': avatarAccessory === -1 }"
              @click="avatarAccessory = -1"
            >
              Ninguno
            </button>
            <button
              v-for="(label, i) in accessoryLabels"
              :key="'acc-' + i"
              class="avatar-option-btn"
              :class="{ 'avatar-option-btn--selected': avatarAccessory === i }"
              @click="avatarAccessory = i"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <GameButton variant="primary" size="lg" @click="goToWelcome">
          Continuar ▶
        </GameButton>
      </div>

      <!-- Step 4: Ready -->
      <div v-else class="register-card animate-scale-in">
        <div class="register-emoji">🌿</div>
        <h1 class="register-title">¡Bienvenid@, {{ name }}!</h1>
        <p class="register-subtitle">
          Tienes {{ age }} años. {{ ageMessage }}
        </p>
        <div class="register-character">
          <CharacterBody character-id="lila" emotion="excited" :is-speaking="true" />
        </div>
        <p class="register-lila">
          "{{ name }}, el barrio te necesita. ¿Vamos?"
        </p>
        <GameButton variant="primary" size="lg" @click="startGame">
          🎮 ¡A jugar!
        </GameButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/useGameStore'
import { usePlayerStore } from '~/stores/usePlayerStore'

const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()

const step = ref(1)
const name = ref('')
const age = ref(0)
const nameInputRef = ref<HTMLInputElement | null>(null)
const ages = [7, 8, 9, 10, 11, 12, 13]

// Avatar customization state
const avatarSkin = ref(0)
const avatarHair = ref(0)
const avatarAccessory = ref(-1)

const skinColors = ['#c68642', '#f0c8a0', '#8d5524']
const hairColors = ['#2d1810', '#5c3a1e', '#8b4513', '#1a1a2e']
const hairLabels = ['Corto', 'Lacio', 'Rizado', 'Cola']
const accessoryLabels = ['Gorra', 'Lentes', 'Moño']

// Keep playerStore avatar in sync with local refs for live preview
watch(avatarSkin, (v) => { playerStore.avatarSkin = v })
watch(avatarHair, (v) => { playerStore.avatarHair = v })
watch(avatarAccessory, (v) => { playerStore.avatarAccessory = v })

const ageMessage = computed(() => {
  if (age.value <= 8) return 'Vas a ser un gran guardián. ¡Te daremos tiempo extra!'
  if (age.value <= 10) return 'Perfecto para esta misión. ¡Vamos!'
  return 'Ya eres grande. ¡Los retos serán más intensos!'
})

function goToStep2() {
  if (name.value.trim().length < 2) return
  step.value = 2
}

function goToStep3() {
  if (age.value === 0) return
  playerStore.setProfile(name.value.trim(), age.value)
  playerStore.saveProgress()
  step.value = 3
}

function goToWelcome() {
  playerStore.setAvatar(avatarSkin.value, avatarHair.value, avatarAccessory.value)
  playerStore.saveProgress()
  step.value = 4
}

function startGame() {
  gameStore.startGame()
  router.push('/capitulos')
}

onMounted(() => {
  nextTick(() => nameInputRef.value?.focus())
})
</script>

<style scoped>
.register-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-content {
  z-index: 5;
  padding: 20px;
  width: 100%;
  max-width: 420px;
}

.register-card {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: var(--radius-xl);
  padding: 32px 24px;
  text-align: center;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.register-emoji {
  font-size: 56px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

.register-title {
  font-size: 26px;
  font-weight: 900;
  color: var(--color-green-dark);
  line-height: 1.2;
}

.register-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

.register-input {
  width: 100%;
  padding: 16px 20px;
  font-size: 20px;
  font-weight: 700;
  font-family: var(--font-main);
  text-align: center;
  border: 3px solid var(--color-green-mid);
  border-radius: var(--radius-lg);
  background: white;
  color: var(--color-text);
  outline: none;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.register-input:focus {
  border-color: var(--color-green-dark);
  box-shadow: 0 0 0 4px rgba(45,157,94,0.2);
}

.register-input::placeholder {
  color: #9ca3af;
  font-weight: 600;
}

/* Age grid */
.age-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.age-btn {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  border: 3px solid #e5e7eb;
  background: white;
  font-size: 20px;
  font-weight: 800;
  font-family: var(--font-main);
  color: var(--color-text);
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
}

.age-btn:hover {
  transform: scale(1.08);
  border-color: var(--color-green-mid);
  box-shadow: var(--shadow-md);
}

.age-btn:active {
  transform: scale(0.95);
}

.age-btn--selected {
  background: var(--color-green-mid);
  color: white;
  border-color: var(--color-green-dark);
  box-shadow: 0 0 0 3px rgba(45,157,94,0.3), var(--shadow-md);
  transform: scale(1.1);
}

/* Character preview */
.register-character {
  width: 90px;
  height: 150px;
}

.register-lila {
  font-size: 16px;
  font-weight: 700;
  font-style: italic;
  color: var(--color-green-dark);
  line-height: 1.4;
}

/* Avatar customization */
.avatar-preview {
  display: flex;
  justify-content: center;
  margin: 4px 0;
}

.avatar-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.avatar-label {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.avatar-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.avatar-color-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
}

.avatar-color-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.avatar-color-btn:active {
  transform: scale(0.95);
}

.avatar-color-btn--selected {
  border-color: var(--color-green-dark);
  box-shadow: 0 0 0 3px rgba(45,157,94,0.3), var(--shadow-md);
  transform: scale(1.1);
}

.avatar-option-btn {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 3px solid #e5e7eb;
  background: white;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--font-main);
  color: var(--color-text);
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
  min-width: 44px;
  min-height: 44px;
}

.avatar-option-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.avatar-option-btn:active {
  transform: scale(0.95);
}

.avatar-option-btn--selected {
  background: var(--color-green-mid);
  color: white;
  border-color: var(--color-green-dark);
  box-shadow: 0 0 0 3px rgba(45,157,94,0.3), var(--shadow-md);
  transform: scale(1.05);
}

@media (hover: none) {
  .age-btn:hover {
    transform: none;
    border-color: #e5e7eb;
    box-shadow: none;
  }
  .age-btn--selected:hover {
    transform: scale(1.1);
  }
  .avatar-color-btn:hover {
    transform: none;
    box-shadow: none;
  }
  .avatar-color-btn--selected:hover {
    transform: scale(1.1);
  }
  .avatar-option-btn:hover {
    transform: none;
    box-shadow: none;
  }
  .avatar-option-btn--selected:hover {
    transform: scale(1.05);
  }
}
</style>
