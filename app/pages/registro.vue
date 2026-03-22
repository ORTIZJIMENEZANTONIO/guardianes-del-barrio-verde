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
          <button
            class="age-btn age-btn--plus"
            :class="{ 'age-btn--selected': age === 13 }"
            @click="age = 13"
          >
            13+
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

      <!-- Step 3: Choose character avatar -->
      <div v-else-if="step === 3" class="register-card animate-scale-in">
        <div class="register-emoji">🎨</div>
        <h1 class="register-title">Elige tu guardián</h1>
        <p class="register-subtitle">¿Quién te representa en la brigada?</p>

        <!-- Character preview -->
        <div class="avatar-character-preview">
          <CharacterBody
            :character-id="selectedCharacterId"
            emotion="happy"
            :is-speaking="false"
          />
        </div>
        <div class="avatar-selected-name" :style="{ color: avatarCharacters[selectedCharacterIdx]?.color }">
          {{ avatarCharacters[selectedCharacterIdx]?.name }}
          <span class="avatar-selected-role">{{ avatarCharacters[selectedCharacterIdx]?.role }}</span>
        </div>

        <!-- Character grid -->
        <div class="avatar-char-grid">
          <button
            v-for="(char, i) in avatarCharacters"
            :key="char.id"
            class="avatar-char-btn"
            :class="{ 'avatar-char-btn--selected': selectedCharacterIdx === i }"
            :style="{ '--char-color': char.color }"
            @click="selectedCharacterIdx = i"
          >
            <div class="avatar-char-btn__body">
              <CharacterFace :character-id="char.id" emotion="happy" />
            </div>
            <span class="avatar-char-btn__name">{{ char.name }}</span>
          </button>
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
import { characters as allCharacters } from '~/data/characters'

const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()

const step = ref(1)
const name = ref('')
const age = ref(0)
const nameInputRef = ref<HTMLInputElement | null>(null)
const ages = [6, 7, 8, 9, 10, 11, 12]

// Avatar: choose from existing characters (exclude bolillo and nube-gris)
const excludeIds = ['bolillo', 'nube-gris']
const avatarCharacters = Object.values(allCharacters).filter(c => !excludeIds.includes(c.id))
const selectedCharacterIdx = ref(0)
const selectedCharacterId = computed(() => avatarCharacters[selectedCharacterIdx.value]?.id ?? 'lila')

const ageMessage = computed(() => {
  if (age.value <= 7) return 'Vas a ser un gran guardián. ¡Te daremos tiempo extra!'
  if (age.value <= 10) return 'Perfecto para esta misión. ¡Vamos!'
  if (age.value <= 12) return 'Ya eres grande. ¡Los retos serán más intensos!'
  return '¡Modo experto! Solo los retos más difíciles. ¿Le entras?'
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
  playerStore.avatarCharacterId = selectedCharacterId.value
  playerStore.saveProgress()
  step.value = 4
}

function startGame() {
  gameStore.startGame()
  router.push('/capitulos')
}

onMounted(() => {
  // If already registered, skip to chapters
  if (playerStore.isRegistered && step.value === 1) {
    router.replace('/capitulos')
    return
  }
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

/* Avatar character selection */
.avatar-character-preview {
  width: 80px;
  height: 130px;
  margin: 0 auto;
}

.avatar-selected-name {
  font-size: 18px;
  font-weight: 800;
  text-align: center;
}

.avatar-selected-role {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.7;
}

.avatar-char-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.avatar-char-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 3px solid #e5e7eb;
  border-radius: var(--radius-md);
  background: white;
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
  width: 70px;
}

.avatar-char-btn:active { transform: scale(0.95); }

.avatar-char-btn--selected {
  border-color: var(--char-color);
  background: color-mix(in srgb, var(--char-color) 10%, white);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--char-color) 30%, transparent), var(--shadow-md);
  transform: scale(1.05);
}

.avatar-char-btn__body {
  width: 48px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
}

.avatar-char-btn__name {
  font-size: 10px;
  font-weight: 800;
  color: var(--color-text);
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
}
</style>
