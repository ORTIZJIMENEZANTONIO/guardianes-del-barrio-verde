<template>
  <div class="chapters-screen">
    <SceneSky variant="nice" />
    <SceneStreet variant="clean" />

    <div class="chapters-content">
      <div class="chapters-header animate-slide-up">
        <h1 class="chapters-title">Elige tu misión</h1>
        <p class="chapters-subtitle">Hola, {{ playerStore.playerName }}. ¿A dónde vamos?</p>
      </div>

      <!-- All chapters complete message -->
      <div v-if="allComplete" class="all-complete-card animate-scale-in">
        <div class="all-complete-icon">🌍</div>
        <h2 class="all-complete-title">¡Felicidades, {{ playerStore.playerName }}!</h2>
        <p class="all-complete-text">
          Recorriste todo el barrio y lo transformaste. Limpiaste calles, despertaste parques y cuidaste a quienes lo habitan.
        </p>
        <p class="all-complete-reflection">
          "Cada pequeña acción que hiciste demuestra que un barrio mejor es posible. Y lo más importante: ya sabes cómo hacerlo."
        </p>
        <div class="all-complete-stats">
          <span>🌿 {{ playerStore.score }} puntos</span>
          <span>🏅 {{ playerStore.totalBadges }} insignias</span>
        </div>
      </div>

      <div class="chapters-grid animate-slide-up" style="animation-delay: 0.1s">
        <button
          v-for="ch in chapters"
          :key="ch.id"
          class="chapter-card"
          :class="{
            'chapter-card--locked': ch.locked,
            'chapter-card--complete': ch.complete,
            'chapter-card--available': !ch.locked && !ch.complete,
          }"
          :disabled="ch.locked"
          @click="selectChapter(ch.id)"
        >
          <span class="chapter-icon">{{ ch.icon }}</span>
          <span class="chapter-number">Capítulo {{ ch.number }}</span>
          <span class="chapter-name">{{ ch.title }}</span>
          <span v-if="ch.complete" class="chapter-badge">✅</span>
          <span v-else-if="ch.locked" class="chapter-lock">🔒</span>
        </button>
      </div>

      <div class="chapters-footer animate-slide-up" style="animation-delay: 0.2s">
        <GameButton variant="ghost" size="md" @click="goHome">
          🏠 Volver al inicio
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

interface ChapterEntry {
  id: string
  number: number
  title: string
  icon: string
  locked: boolean
  complete: boolean
}

const chapters = computed<ChapterEntry[]>(() => {
  const allChapters = [
    { id: 'chapter-1', number: 1, title: 'La Calle Caliente', icon: '🌡️' },
    { id: 'chapter-2', number: 2, title: 'El Parque Dormido', icon: '🏞️' },
    { id: 'chapter-3', number: 3, title: 'La Fuga Infinita', icon: '💧' },
    { id: 'chapter-4', number: 4, title: 'La Ruta de la Basura', icon: '🗑️' },
    { id: 'chapter-5', number: 5, title: 'Azoteas con Vida', icon: '🌱' },
    { id: 'chapter-6', number: 6, title: 'El Gran Festival Verde', icon: '🎉' },
  ]

  // Cap. 6 locked until chapters 1-5 are complete
  const first5Complete = ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5']
    .every(id => playerStore.isChapterComplete(id))

  return allChapters.map((ch) => {
    const complete = playerStore.isChapterComplete(ch.id)
    const locked = ch.id === 'chapter-6' && !first5Complete
    return { ...ch, complete, locked }
  })
})

const allComplete = computed(() => chapters.value.every(ch => ch.complete))

function selectChapter(chapterId: string) {
  const ch = chapters.value.find(c => c.id === chapterId)
  if (ch?.locked) return
  gameStore.setPhase('playing')
  gameStore.currentChapterId = chapterId
  gameStore.setScene(0)
  router.push(`/chapter/${chapterId}`)
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  // Load saved progress
  playerStore.loadProgress()
  // Guard: redirect if not registered
  if (!playerStore.isRegistered) {
    router.replace('/registro')
  }
})
</script>

<style scoped>
.chapters-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.chapters-content {
  z-index: 5;
  padding: 20px;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.chapters-header { text-align: center; }

.chapters-title {
  font-size: 28px;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 0 rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2);
}

.chapters-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.95);
  text-shadow: 0 1px 8px rgba(0,0,0,0.3);
  margin-top: 6px;
}

/* All complete */
.all-complete-card {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: var(--radius-xl);
  padding: 14px 16px;
  text-align: center;
  box-shadow: var(--shadow-xl), var(--glow-green);
  width: 100%;
}

.all-complete-icon { font-size: 36px; margin-bottom: 4px; }

.all-complete-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-green-dark);
  margin-bottom: 4px;
}

.all-complete-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
  margin-bottom: 4px;
}

.all-complete-reflection {
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
  color: var(--color-green-dark);
  line-height: 1.3;
  padding: 8px;
  background: linear-gradient(135deg, var(--color-green-bg), rgba(168,230,195,0.3));
  border: 1px solid var(--color-green-pale);
  border-radius: var(--radius-md);
  margin-bottom: 4px;
}

.all-complete-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-green-dark);
}

/* Chapters grid */
.chapters-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.chapter-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 200ms var(--ease-spring);
  text-align: left;
  width: 100%;
}

.chapter-card:active:not(:disabled) { transform: scale(0.97); }

.chapter-card--available {
  border-color: var(--color-green-mid);
}

.chapter-card--available:hover {
  box-shadow: var(--shadow-lg), var(--glow-green);
  transform: scale(1.02);
}

.chapter-card--complete {
  border-color: rgba(82,183,136,0.4);
  opacity: 0.85;
}

.chapter-card--locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.chapter-icon { font-size: 32px; flex-shrink: 0; }

.chapter-number {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-green-mid);
  display: block;
}

.chapter-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text);
  flex: 1;
}

.chapter-badge, .chapter-lock {
  font-size: 20px;
  flex-shrink: 0;
}

.chapters-footer { margin-top: 4px; }

@media (hover: none) {
  .chapter-card--available:hover {
    transform: none;
    box-shadow: var(--shadow-md);
  }
}
</style>
