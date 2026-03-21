<template>
  <div v-if="isDev" class="dev-catalog">
    <div class="dev-header">
      <h1>Catálogo de desarrollo</h1>
      <p class="dev-subtitle">Solo visible en modo local</p>
      <GameButton variant="ghost" size="md" @click="router.push('/')">
        ← Volver al juego
      </GameButton>
    </div>

    <!-- ===== PERSONAJES ===== -->
    <section class="dev-section">
      <div class="dev-section-header" @click="sections.characters = !sections.characters">
        <h2>Personajes ({{ characters.length }})</h2>
        <button class="skip-btn">{{ sections.characters ? 'Ocultar' : 'Mostrar' }}</button>
      </div>
      <div v-if="sections.characters" class="dev-section-body">
        <div v-for="char in characters" :key="char.id" class="char-card">
          <div class="char-info">
            <div class="char-name" :style="{ color: char.color }">
              {{ char.emoji }} {{ char.name }}
            </div>
            <div class="char-role">{{ char.role }}</div>
            <div class="char-voice">{{ char.voiceStyle }}</div>
            <div class="char-traits">
              <span v-for="p in char.personality" :key="p" class="trait-tag">{{ p }}</span>
            </div>
          </div>

          <!-- Emotions showcase -->
          <div class="char-emotions">
            <div class="emotion-label">Emociones:</div>
            <div class="emotions-grid">
              <div
                v-for="emo in emotions"
                :key="emo"
                class="emotion-cell"
                :class="{ 'emotion-cell--active': activeEmotion[char.id] === emo }"
                @click="activeEmotion[char.id] = emo"
              >
                <span class="emotion-name">{{ emo }}</span>
              </div>
            </div>
          </div>

          <!-- Character preview -->
          <div class="char-preview">
            <div class="preview-face">
              <CharacterFace
                :character-id="char.id"
                :emotion="activeEmotion[char.id] || 'neutral'"
                :is-speaking="speakingChar === char.id"
              />
            </div>
            <div class="preview-body">
              <CharacterBody
                :character-id="char.id"
                :emotion="activeEmotion[char.id] || 'neutral'"
                :is-speaking="speakingChar === char.id"
              />
            </div>
            <button class="speak-btn" @click="toggleSpeak(char.id)">
              {{ speakingChar === char.id ? '🔇 Dejar de hablar' : '🗣️ Hablar' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CAPÍTULOS ===== -->
    <section class="dev-section">
      <div class="dev-section-header" @click="sections.chapters = !sections.chapters">
        <h2>Capítulos ({{ chaptersData.length }})</h2>
        <button class="skip-btn">{{ sections.chapters ? 'Ocultar' : 'Mostrar' }}</button>
      </div>
      <div v-if="sections.chapters" class="dev-section-body">
        <div v-for="ch in chaptersData" :key="ch.id" class="chapter-card">
          <div class="chapter-header">
            <span class="chapter-icon">{{ ch.icon }}</span>
            <div>
              <div class="chapter-title" :style="{ color: ch.color }">{{ ch.title }}</div>
              <div class="chapter-sub">{{ ch.subtitle }}</div>
            </div>
          </div>
          <p class="chapter-desc">{{ ch.description }}</p>
          <div class="chapter-meta">
            <span>{{ ch.scenes.length }} escenas</span>
            <span>{{ ch.missionIds.length }} misiones</span>
            <span>{{ ch.completionReward.points }} pts</span>
            <span>🏅 {{ ch.completionReward.badgeTitle }}</span>
          </div>
          <div class="chapter-scenes">
            <div v-for="(scene, i) in ch.scenes" :key="scene.id" class="scene-pill" :class="'scene-pill--' + scene.type">
              {{ i }}. {{ scene.type }}
            </div>
          </div>
          <GameButton variant="primary" size="sm" @click="goToChapter(ch.id)">
            ▶ Jugar este capítulo
          </GameButton>
        </div>
      </div>
    </section>

    <!-- ===== MINIJUEGOS ===== -->
    <section class="dev-section">
      <div class="dev-section-header" @click="sections.missions = !sections.missions">
        <h2>Misiones / Minijuegos</h2>
        <button class="skip-btn">{{ sections.missions ? 'Ocultar' : 'Mostrar' }}</button>
      </div>
      <div v-if="sections.missions" class="dev-section-body">
        <div v-for="ch in allMissions" :key="ch.chapter" class="missions-group">
          <h3>{{ ch.chapter }}</h3>
          <div v-for="m in ch.missions" :key="m.id" class="mission-row">
            <span class="mission-type-tag" :class="'tag--' + m.type">{{ m.type }}</span>
            <span class="mission-title">{{ m.title }}</span>
            <span class="mission-pts">{{ m.reward.points }}pts</span>
            <span v-if="m.reward.badgeTitle" class="mission-badge">🏅 {{ m.reward.badgeTitle }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MECÁNICAS ===== -->
    <section class="dev-section">
      <div class="dev-section-header" @click="sections.mechanics = !sections.mechanics">
        <h2>Mecánicas de juego</h2>
        <button class="skip-btn">{{ sections.mechanics ? 'Ocultar' : 'Mostrar' }}</button>
      </div>
      <div v-if="sections.mechanics" class="dev-section-body">
        <div class="mechanics-grid">
          <div v-for="mech in mechanics" :key="mech.type" class="mechanic-card">
            <div class="mechanic-icon">{{ mech.icon }}</div>
            <div class="mechanic-type">{{ mech.type }}</div>
            <div class="mechanic-desc">{{ mech.desc }}</div>
            <div class="mechanic-chapters">{{ mech.chapters }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="dev-blocked">
    <p>Esta página solo está disponible en modo desarrollo.</p>
    <GameButton variant="primary" size="md" @click="router.push('/')">Ir al inicio</GameButton>
  </div>
</template>

<script setup lang="ts">
import { characters as charactersData } from '~/data/characters'
import { chapter1 } from '~/data/chapters/chapter-1'
import { chapter1Missions } from '~/data/chapters/chapter-1/missions'
import { chapter2 } from '~/data/chapters/chapter-2'
import { chapter2Missions } from '~/data/chapters/chapter-2/missions'
import { chapter3 } from '~/data/chapters/chapter-3'
import { chapter3Missions } from '~/data/chapters/chapter-3/missions'
import { useGameStore } from '~/stores/useGameStore'
import type { Emotion } from '~/shared/types/character'

const router = useRouter()
const gameStore = useGameStore()

const isDev = ref(false)
onMounted(() => {
  const host = window.location.hostname
  isDev.value = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168')
})

const characters = computed(() => Object.values(charactersData))

const emotions: Emotion[] = ['neutral', 'happy', 'sad', 'excited', 'angry', 'worried', 'thinking', 'surprised', 'proud', 'mischievous']

const activeEmotion = ref<Record<string, Emotion>>({})
const speakingChar = ref<string | null>(null)

const sections = ref({
  characters: true,
  chapters: true,
  missions: false,
  mechanics: false,
})

function toggleSpeak(charId: string) {
  speakingChar.value = speakingChar.value === charId ? null : charId
}

const chaptersData = [chapter1, chapter2, chapter3]

const allMissions = [
  { chapter: 'Cap. 1 — La Calle Caliente', missions: chapter1Missions },
  { chapter: 'Cap. 2 — El Parque Dormido', missions: chapter2Missions },
  { chapter: 'Cap. 3 — La Fuga Infinita', missions: chapter3Missions },
]

const mechanics = [
  { type: 'drag-drop', icon: '👆', desc: 'Arrastrar ítems con touch/mouse a zonas destino', chapters: 'Cap. 1, 2, 3' },
  { type: 'memorama', icon: '🃏', desc: 'Voltear cartas para encontrar parejas (flip 3D)', chapters: 'Cap. 2, 3' },
  { type: 'tap-detect', icon: '👉', desc: 'Tocar spots para descubrir/clasificar', chapters: 'Cap. 1' },
  { type: 'placement', icon: '📌', desc: 'Seleccionar ítem + tocar zona para colocar', chapters: 'Cap. 1' },
  { type: 'pipe-fit', icon: '🔧', desc: 'Colocar piezas de tubería en huecos', chapters: 'Cap. 1' },
]

function goToChapter(chapterId: string) {
  gameStore.setPhase('playing')
  gameStore.currentChapterId = chapterId
  gameStore.setScene(0)
  router.push(`/chapter/${chapterId}`)
}
</script>

<style scoped>
.dev-catalog {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #f8fafc;
  padding: 20px 20px 80px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.dev-blocked {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #f8fafc;
  color: var(--color-text);
}

.dev-header {
  text-align: center;
  margin-bottom: 24px;
}

.dev-header h1 {
  font-size: 28px;
  font-weight: 900;
  color: var(--color-green-dark);
}

.dev-subtitle {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  margin: 4px 0 12px;
}

/* Sections */
.dev-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

.dev-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.dev-section-header:hover { background: #e2e8f0; }

.dev-section-header h2 {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.skip-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: white;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
}

.dev-section-body {
  padding: 16px;
}

/* Character cards */
.char-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.char-info { flex: 1; min-width: 180px; }
.char-name { font-size: 18px; font-weight: 800; }
.char-role { font-size: 13px; color: #64748b; font-weight: 600; }
.char-voice { font-size: 11px; color: #94a3b8; font-style: italic; margin-top: 4px; }
.char-traits { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.trait-tag {
  padding: 2px 8px;
  background: #f1f5f9;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

/* Emotions */
.char-emotions { flex: 1; min-width: 200px; }
.emotion-label { font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 6px; }
.emotions-grid { display: flex; flex-wrap: wrap; gap: 4px; }
.emotion-cell {
  padding: 3px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  color: #64748b;
  transition: all 150ms;
}
.emotion-cell:hover { border-color: #94a3b8; background: #f8fafc; }
.emotion-cell--active {
  background: var(--color-green-mid);
  color: white;
  border-color: var(--color-green-mid);
}

/* Character preview */
.char-preview {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.preview-face { width: 60px; height: 50px; }
.preview-body { width: 50px; height: 110px; }

.speak-btn {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

/* Chapter cards */
.chapter-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.chapter-icon { font-size: 36px; }
.chapter-title { font-size: 18px; font-weight: 800; }
.chapter-sub { font-size: 12px; color: #64748b; font-weight: 600; }
.chapter-desc { font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 10px; }

.chapter-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.chapter-meta span {
  padding: 3px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
}

.chapter-scenes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.scene-pill {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: white;
}

.scene-pill--cinematic { background: #8b5cf6; }
.scene-pill--dialogue { background: #3b82f6; }
.scene-pill--exploration { background: #f59e0b; }
.scene-pill--mission { background: #ef4444; }
.scene-pill--transformation { background: #10b981; }
.scene-pill--summary { background: #6366f1; }
.scene-pill--hook { background: #ec4899; }

/* Missions */
.missions-group { margin-bottom: 16px; }
.missions-group h3 { font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }

.mission-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.mission-type-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
}

.tag--drag-drop { background: #f97316; }
.tag--memorama { background: #8b5cf6; }
.tag--tap-detect { background: #3b82f6; }
.tag--placement { background: #10b981; }
.tag--pipe-fit { background: #6366f1; }
.tag--scenario-choice { background: #ec4899; }

.mission-title { font-size: 13px; font-weight: 700; color: #1e293b; flex: 1; }
.mission-pts { font-size: 12px; font-weight: 800; color: var(--color-green-dark); }
.mission-badge { font-size: 11px; color: #64748b; }

/* Mechanics */
.mechanics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }

.mechanic-card {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-align: center;
}

.mechanic-icon { font-size: 32px; margin-bottom: 6px; }
.mechanic-type { font-size: 14px; font-weight: 800; color: #1e293b; text-transform: uppercase; }
.mechanic-desc { font-size: 12px; color: #64748b; margin: 6px 0; line-height: 1.4; }
.mechanic-chapters { font-size: 11px; font-weight: 700; color: var(--color-green-mid); }
</style>
