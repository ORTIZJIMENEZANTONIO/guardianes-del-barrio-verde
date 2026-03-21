<template>
  <div class="home-screen">
    <!-- Animated background -->
    <SceneSky variant="nice" />
    <SceneStreet variant="clean" />

    <!-- Main content -->
    <div class="home-content">
      <div class="logo-area animate-slide-up">
        <div class="logo-badge">
          <span class="logo-icon">🌿</span>
        </div>
        <h1 class="game-title">Guardianes del<br>Barrio Verde</h1>
        <p class="game-subtitle">Transforma tu colonia. Cuida el agua.<br>Planta vida. Cambia tu barrio.</p>
      </div>

      <div class="menu-buttons animate-slide-up" style="animation-delay: 0.15s">
        <GameButton variant="primary" size="lg" @click="startNewGame">
          {{ hasSave ? '🌱  Nueva partida' : '🎮  Jugar' }}
        </GameButton>

        <GameButton v-if="hasSave" variant="secondary" size="lg" @click="continueGame">
          ▶  Continuar
        </GameButton>

        <GameButton variant="ghost" size="md" @click="showCreditsModal = true">
          Acerca de
        </GameButton>
      </div>

      <div class="home-footer animate-fade-in" style="animation-delay: 0.4s">
        <p class="tagline">"Pequeñas acciones pueden transformar un barrio entero."</p>
      </div>
    </div>

    <!-- Credits modal -->
    <Modal :show="showCreditsModal" @close="showCreditsModal = false" size="sm">
      <div class="credits">
        <div class="credits-icon">🌍</div>
        <h2>Guardianes del Barrio Verde</h2>
        <p>Un juego educativo sobre cuidado ambiental y comunidad.</p>
        <div class="credits-divider" />
        <p><strong>Para:</strong> Niños y niñas de 8 a 12 años</p>
        <p><strong>Tema:</strong> Medio ambiente urbano en México</p>
        <div class="credits-divider" />
        <p class="credits-msg">"Cada acción suma."</p>
        <div style="margin-top: 16px">
          <GameButton variant="primary" size="md" @click="showCreditsModal = false">
            Cerrar
          </GameButton>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/useGameStore'
import { usePlayerStore } from '~/stores/usePlayerStore'

const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()
const showCreditsModal = ref(false)

const hasSave = ref(false)

onMounted(() => {
  hasSave.value = playerStore.loadProgress()
})

function startNewGame() {
  playerStore.resetProgress()
  router.push('/registro')
}

function continueGame() {
  gameStore.continueGame()
  const lastChapter = playerStore.completedChapters.length > 0
    ? `chapter-${playerStore.completedChapters.length + 1}`
    : 'chapter-1'
  router.push(`/chapter/${lastChapter}`)
}
</script>

<style scoped>
.home-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* ===== CONTENT ===== */
.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  z-index: 2;
  padding: 24px;
  text-align: center;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.logo-badge {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid rgba(255,255,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2.5s ease-in-out infinite;
  box-shadow:
    0 8px 32px rgba(0,0,0,0.12),
    0 0 40px rgba(52, 211, 153, 0.2);
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.game-title {
  font-size: 36px;
  font-weight: 900;
  color: white;
  text-shadow:
    0 2px 0 rgba(0,0,0,0.3),
    0 4px 16px rgba(0,0,0,0.2);
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.game-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.95);
  text-shadow: 0 1px 8px rgba(0,0,0,0.3);
  max-width: 340px;
  line-height: 1.5;
}

/* ===== MENU ===== */
.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 260px;
  opacity: 0;
  animation: slideUp 500ms var(--ease-out) forwards;
}

.home-footer {
  margin-top: 8px;
  opacity: 0;
}

.tagline {
  font-size: 13px;
  font-style: italic;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 1px 6px rgba(0,0,0,0.3);
  background: rgba(255,255,255,0.1);
  padding: 8px 20px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* ===== CREDITS ===== */
.credits {
  text-align: center;
}

.credits-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.credits h2 {
  color: var(--color-green-dark);
  font-size: 20px;
  font-weight: 800;
}

.credits p {
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.6;
}

.credits-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gray-light), transparent);
  margin: 14px 0;
}

.credits-msg {
  color: var(--color-green-dark);
  font-weight: 800;
  font-size: 16px;
}
</style>
