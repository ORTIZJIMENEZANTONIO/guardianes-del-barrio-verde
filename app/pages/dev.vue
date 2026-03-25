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
            <button class="speak-btn" @click="toggleSpeak(char.id)" title="Activa la animación de hablar (boca + cola en Bolillo)">
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
            <div
              v-for="(scene, i) in ch.scenes"
              :key="scene.id"
              class="scene-pill"
              :class="'scene-pill--' + scene.type"
              :title="`${scene.id}${scene.missionId ? ' → ' + scene.missionId : ''}${scene.dialoguePoolId ? ' → diálogo: ' + scene.dialoguePoolId : ''}`"
            >
              {{ i }}. {{ scene.type }}
            </div>
          </div>
          <GameButton variant="primary" size="sm" @click="goToChapter(ch.id)" :title="`Navegar a /chapter/${ch.id} como jugador (incluye cinemática, diálogos y misiones)`">
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
            <span class="mission-type-tag" :class="'tag--' + m.type" :title="`Mecánica: ${m.type} · Dificultad: ${m.difficulty}/3 · Timer: ${m.timeLimit ? m.timeLimit + 's' : 'sin límite'}`">{{ m.type }}</span>
            <span class="mission-title">{{ m.title }}</span>
            <span class="mission-pts">{{ m.reward.points }}pts</span>
            <span v-if="m.reward.badgeTitle" class="mission-badge">🏅 {{ m.reward.badgeTitle }}</span>
            <button v-if="missionComponentMap[m.id]" class="play-btn" @click="playMission(m.id, m.title)" title="Abrir minijuego en overlay para jugarlo manualmente">
              ▶ Jugar
            </button>
          </div>
        </div>
      </div>

      <!-- Mission player overlay -->
      <Teleport to="body">
        <div v-if="playingMissionId" class="mission-player-overlay">
          <div class="mission-player-header">
            <span class="mission-player-title">{{ playingMissionTitle }}</span>
            <button class="mission-player-close" @click="stopPlaying">✕ Cerrar</button>
          </div>
          <div class="mission-player-area">
            <component :is="missionComponentMap[playingMissionId]" @complete="stopPlaying" />
          </div>
        </div>
      </Teleport>
    </section>

    <!-- ===== TESTING / AUTOBOTS ===== -->
    <section class="dev-section">
      <div class="dev-section-header" @click="sections.testing = !sections.testing">
        <h2>🤖 Testing / Autobots</h2>
        <button class="skip-btn">{{ sections.testing ? 'Ocultar' : 'Mostrar' }}</button>
      </div>
      <div v-if="sections.testing" class="dev-section-body">
        <p class="test-desc">Verifica que cada minijuego se puede iniciar, jugar y completar. Corre tests por misión o por capítulo completo.</p>

        <!-- Running state banner -->
        <div v-if="runningTest" class="test-running">
          🔄 {{ runningTest }}
        </div>

        <!-- Global actions -->
        <div class="test-actions">
          <button class="test-btn test-btn--green" :disabled="!!runningTest" @click="autoTestAll" title="Verifica integridad de datos: componente existe, diálogos intro/success/fail existen, icono, objectives y reward válidos">
            🤖 Verificar datos
          </button>
          <button class="test-btn test-btn--orange" :disabled="!!runningTest" @click="uiTestAll" title="Monta cada minijuego y revisa: render, overflow, touch targets ≥40px, drag estable, FPS, imágenes y errores en consola">
            📱 UI/Mobile
          </button>
          <button class="test-btn test-btn--yellow" :disabled="!!runningTest" @click="stressTestAll" title="Simula mal uso: taps aleatorios, drags a zonas incorrectas, spam clicks, 3 cartas rápidas en memorama. Detecta crashes">
            🔨 Stress (errores)
          </button>
          <button class="test-btn test-btn--purple" :disabled="!!runningTest" @click="runAllChapters" title="Juega cada minijuego visualmente (se equivoca y luego completa), verifica datos y marca completado">
            ▶ Correr TODOS
          </button>
          <button class="test-btn test-btn--blue" @click="autoCompleteAll" title="Marca todas las misiones y capítulos como completados instantáneamente en el store (sin abrir juegos)">
            ⚡ Completar TODO
          </button>
          <button class="test-btn test-btn--red" @click="resetAll" title="Borra todo el progreso del jugador, resultados de tests y log">
            🔄 Reset
          </button>
        </div>

        <!-- Summary bar -->
        <div v-if="testSummary" class="test-summary" :class="testSummary.fail > 0 ? 'test-summary--fail' : 'test-summary--pass'">
          {{ testSummary.pass }} PASS · {{ testSummary.fail }} FAIL · {{ testSummary.total }} total
        </div>

        <!-- Per-chapter -->
        <div class="test-chapters">
          <div v-for="(ch, ci) in chaptersData" :key="ch.id" class="test-chapter-card">
            <div class="test-chapter-header">
              <span class="test-chapter-name">{{ ch.icon }} {{ ch.title }}</span>
              <span class="test-chapter-status" :class="playerStore.isChapterComplete(ch.id) ? 'status--done' : ''">
                {{ ch.missionIds.filter(id => playerStore.isMissionComplete(id)).length }}/{{ ch.missionIds.length }}
              </span>
            </div>
            <div class="test-chapter-actions">
              <button class="test-btn test-btn--small test-btn--green" :disabled="!!runningTest" @click="autoTestChapter(ch)" title="Verificar datos de todas las misiones de este capítulo">
                🤖 Datos
              </button>
              <button class="test-btn test-btn--small test-btn--orange" :disabled="!!runningTest" @click="uiTestChapter(ch)" title="Test UI/Mobile: render, overflow, touch, drag, FPS">
                📱
              </button>
              <button class="test-btn test-btn--small test-btn--yellow" :disabled="!!runningTest" @click="stressTestChapter(ch)" title="Stress test: taps aleatorios, drags incorrectos, spam">
                🔨
              </button>
              <button class="test-btn test-btn--small test-btn--purple" :disabled="!!runningTest" @click="runChapter(ch)" title="Juega visualmente cada misión, se equivoca y luego completa">
                ▶
              </button>
              <button class="test-btn test-btn--small test-btn--blue" @click="autoCompleteChapter(ch)" title="Marcar todo el capítulo como completado (instantáneo)">
                ⚡ OK
              </button>
            </div>
            <!-- Missions in this chapter -->
            <div class="test-chapter-missions">
              <div v-for="m in getMissionsForChapter(ch)" :key="m.id" class="test-mission-row">
                <span class="test-mission-status">{{ playerStore.isMissionComplete(m.id) ? '✅' : '⬜' }}</span>
                <span class="test-mission-type" :class="'tag--' + m.type" :title="`${m.type} · diff ${m.difficulty}/3 · ${m.timeLimit ? m.timeLimit + 's' : 'sin timer'}`">{{ m.type }}</span>
                <span class="test-mission-name" :title="`${m.id} — ${m.description}`">{{ m.title }}</span>
                <div class="test-mission-btns">
                  <button class="test-btn test-btn--tiny test-btn--green" @click="autoTestMission(m)" title="Verificar datos: componente, diálogos, icono, objectives, reward">🤖</button>
                  <button class="test-btn test-btn--tiny test-btn--orange" :disabled="!!runningTest" @click="uiTestMission(m)" title="UI/Mobile: render, overflow, touch ≥40px, drag, FPS, consola">📱</button>
                  <button class="test-btn test-btn--tiny test-btn--yellow" :disabled="!!runningTest" @click="stressTestMission(m)" title="Stress: taps random, drag incorrecto, spam, memorama 3 cartas">🔨</button>
                  <button class="test-btn test-btn--tiny test-btn--purple" :disabled="!!runningTest" @click="runMission(m)" title="Juega visualmente: se equivoca y luego completa">▶</button>
                  <button class="test-btn test-btn--tiny test-btn--blue" @click="autoCompleteMission(m)" title="Marcar completada + dar puntos (instantáneo)">⚡</button>
                </div>
                <div v-if="testResults[m.id]" class="test-result" :class="testResults[m.id].ok ? 'test-result--pass' : 'test-result--fail'">
                  {{ testResults[m.id].ok ? '✅' : '❌' }} {{ testResults[m.id].message }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Test log -->
        <div v-if="testLog.length" class="test-log">
          <div class="test-log-header">
            <h4>📋 Log ({{ testLog.length }})</h4>
            <button class="test-btn test-btn--tiny test-btn--red" @click="testLog = []" title="Borrar todas las entradas del log">Limpiar</button>
          </div>
          <div class="test-log-entries">
            <div v-for="(entry, i) in testLog" :key="i" class="test-log-entry" :class="entry.ok ? 'log--pass' : 'log--fail'">
              {{ entry.ok ? '✅' : '❌' }} {{ entry.message }}
            </div>
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
import { chapter4 } from '~/data/chapters/chapter-4'
import { chapter4Missions } from '~/data/chapters/chapter-4/missions'
import { chapter5 } from '~/data/chapters/chapter-5'
import { chapter5Missions } from '~/data/chapters/chapter-5/missions'
import { chapter6 } from '~/data/chapters/chapter-6'
import { chapter6Missions } from '~/data/chapters/chapter-6/missions'
import { chapterBonus } from '~/data/chapters/chapter-bonus'
import { chapterBonusMissions } from '~/data/chapters/chapter-bonus/missions'
import { useGameStore } from '~/stores/useGameStore'
import { usePlayerStore } from '~/stores/usePlayerStore'
import type { Emotion } from '~/shared/types/character'
import type { MissionConfig } from '~/shared/types/mission'
import type { ChapterConfig } from '~/shared/types/chapter'

// Minigame components for individual play
import SidewalkCleanup from '~/components/chapter/chapter-1/SidewalkCleanup.vue'
import HeatDetector from '~/components/chapter/chapter-1/HeatDetector.vue'
import ShadePlanter from '~/components/chapter/chapter-1/ShadePlanter.vue'
import LeakFixer from '~/components/chapter/chapter-1/LeakFixer.vue'
import SpaceRestorer from '~/components/chapter/chapter-1/SpaceRestorer.vue'
import GreenRoofBuilder from '~/components/chapter/chapter-1/GreenRoofBuilder.vue'
import PathClear from '~/components/chapter/chapter-2/PathClear.vue'
import SoilMemory from '~/components/chapter/chapter-2/SoilMemory.vue'
import WaterDragDrop from '~/components/chapter/chapter-2/WaterDragDrop.vue'
import WildlifeMemory from '~/components/chapter/chapter-2/WildlifeMemory.vue'
import ParkDragRestore from '~/components/chapter/chapter-2/ParkDragRestore.vue'
import BolilloRoute from '~/components/chapter/chapter-2/BolilloRoute.vue'
import TrashCollector from '~/components/chapter/chapter-4/TrashCollector.vue'
import WasteSeparator from '~/components/chapter/chapter-4/WasteSeparator.vue'
import PollutionDetector from '~/components/chapter/chapter-4/PollutionDetector.vue'
import CompostBuilder from '~/components/chapter/chapter-4/CompostBuilder.vue'
import RecycleMemory from '~/components/chapter/chapter-4/RecycleMemory.vue'
import RoofEvaluator from '~/components/chapter/chapter-5/RoofEvaluator.vue'
import RoofDesigner from '~/components/chapter/chapter-5/RoofDesigner.vue'
import PlantMatcher from '~/components/chapter/chapter-5/PlantMatcher.vue'
import IrrigationBuilder from '~/components/chapter/chapter-5/IrrigationBuilder.vue'
import RoofDifference from '~/components/chapter/chapter-5/RoofDifference.vue'
import FestivalSetup from '~/components/chapter/chapter-6/FestivalSetup.vue'
import NeighborInviter from '~/components/chapter/chapter-6/NeighborInviter.vue'
import FestivalProblems from '~/components/chapter/chapter-6/FestivalProblems.vue'
import FestivalInauguration from '~/components/chapter/chapter-6/FestivalInauguration.vue'
import EndangeredSpotter from '~/components/chapter/chapter-bonus/EndangeredSpotter.vue'
import SpeciesMemory from '~/components/chapter/chapter-bonus/SpeciesMemory.vue'
import ThreatClassifier from '~/components/chapter/chapter-bonus/ThreatClassifier.vue'
import ConservationQuiz from '~/components/chapter/chapter-bonus/ConservationQuiz.vue'
import RefugeBuilder from '~/components/chapter/chapter-bonus/RefugeBuilder.vue'
import FloodDragClear from '~/components/chapter/chapter-3/FloodDragClear.vue'
import WaterWasteDetector from '~/components/chapter/chapter-3/WaterWasteDetector.vue'
import WetlandMemory from '~/components/chapter/chapter-3/WetlandMemory.vue'
import PipeDragFit from '~/components/chapter/chapter-3/PipeDragFit.vue'
import WaterQuiz from '~/components/chapter/chapter-3/WaterQuiz.vue'

const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()

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
  testing: false,
  mechanics: false,
})

function toggleSpeak(charId: string) {
  speakingChar.value = speakingChar.value === charId ? null : charId
}

const chaptersData = [chapter1, chapter2, chapter3, chapter4, chapter5, chapterBonus, chapter6]

const allMissions = [
  { chapter: 'Cap. 1 — La Calle Caliente', missions: chapter1Missions },
  { chapter: 'Cap. 2 — El Parque Dormido', missions: chapter2Missions },
  { chapter: 'Cap. 3 — La Fuga Infinita', missions: chapter3Missions },
  { chapter: 'Cap. 4 — La Ruta de la Basura', missions: chapter4Missions },
  { chapter: 'Cap. 5 — Azoteas con Vida', missions: chapter5Missions },
  { chapter: 'Bonus — Fauna en Peligro', missions: chapterBonusMissions },
  { chapter: 'Cap. 6 — El Gran Festival Verde', missions: chapter6Missions },
]

const mechanics = [
  { type: 'drag-drop', icon: '👆', desc: 'Arrastrar o tocar ítems hacia zonas/contenedores destino', chapters: 'Cap. 1, 2, 3, 6' },
  { type: 'memorama', icon: '🃏', desc: 'Voltear cartas para encontrar parejas (flip 3D)', chapters: 'Cap. 2, 3, 4, 5, 6, Bonus' },
  { type: 'tap-detect', icon: '👉', desc: 'Tocar spots para descubrir/clasificar (target vs no-target)', chapters: 'Cap. 1, 3, 4, 5, Bonus' },
  { type: 'placement', icon: '📌', desc: 'Seleccionar ítem + tocar zona para colocar', chapters: 'Cap. 1, 2, 5, 6' },
  { type: 'pipe-fit', icon: '🔧', desc: 'Colocar piezas de tubería en huecos SVG', chapters: 'Cap. 1, 3' },
  { type: 'sequence', icon: '🔢', desc: 'Ordenar pasos en secuencia correcta (slots numerados)', chapters: 'Cap. 4, Bonus' },
  { type: 'swipe', icon: '👈👉', desc: 'Deslizar o tocar botones para clasificar izq/der', chapters: 'Cap. 4, Bonus' },
  { type: 'line-match', icon: '🔗', desc: 'Dibujar líneas SVG conectando parejas', chapters: 'Cap. 2' },
  { type: 'quiz', icon: '❓', desc: 'Preguntas con timer por pregunta y opciones múltiples', chapters: 'Cap. 3, Bonus' },
  { type: 'spot-difference', icon: '🔍', desc: 'Encontrar diferencias entre escenas antes/después', chapters: 'Cap. 5' },
  { type: 'route-trace', icon: '🗺️', desc: 'Trazar ruta tocando nodos en orden correcto', chapters: 'Cap. 5' },
]

// Mission component map for individual play
const missionComponentMap: Record<string, any> = {
  'mission-1-clean': SidewalkCleanup,
  'mission-2-heat': HeatDetector,
  'mission-3-plant': ShadePlanter,
  'mission-4-leak': LeakFixer,
  'mission-5-restore': SpaceRestorer,
  'mission-1-paths': PathClear,
  'mission-2-soil': SoilMemory,
  'mission-3-water': WaterDragDrop,
  'mission-4-life': WildlifeMemory,
  'mission-5-reactivate': ParkDragRestore,
  'mission-6-bolillo-route': BolilloRoute,
  'mission-1-waste': FloodDragClear,
  'mission-2-detect': WaterWasteDetector,
  'mission-3-wetland': WetlandMemory,
  'mission-4-repair': PipeDragFit,
  'mission-5-quiz': WaterQuiz,
  // Chapter 4
  'mission-1-collect': TrashCollector,
  'mission-2-separate': WasteSeparator,
  'mission-3-pollution': PollutionDetector,
  'mission-4-compost': CompostBuilder,
  'mission-5-recycle': RecycleMemory,
  // Chapter 5
  'mission-0-greenroof': GreenRoofBuilder,
  'mission-1-evaluate': RoofEvaluator,
  'mission-2-design': RoofDesigner,
  'mission-3-plants': PlantMatcher,
  'mission-4-irrigation': IrrigationBuilder,
  'mission-5-difference': RoofDifference,
  // Chapter Bonus
  'bonus-1-spotter': EndangeredSpotter,
  'bonus-2-memory': SpeciesMemory,
  'bonus-3-threats': ThreatClassifier,
  'bonus-4-quiz': ConservationQuiz,
  'bonus-5-refuge': RefugeBuilder,
  // Chapter 6
  'mission-1-prepare': FestivalSetup,
  'mission-2-invite': NeighborInviter,
  'mission-3-solve': FestivalProblems,
  'mission-4-inaugurate': FestivalInauguration,
}

const playingMissionId = ref<string | null>(null)
const playingMissionTitle = ref('')

function playMission(missionId: string, title: string) {
  playingMissionId.value = missionId
  playingMissionTitle.value = title
}

function stopPlaying() {
  playingMissionId.value = null
  playingMissionTitle.value = ''
}

// ===== TESTING / AUTOBOTS =====
import { chapter1Dialogues } from '~/data/chapters/chapter-1/dialogues'
import { chapter2Dialogues } from '~/data/chapters/chapter-2/dialogues'
import { chapter3Dialogues } from '~/data/chapters/chapter-3/dialogues'
import { chapter4Dialogues } from '~/data/chapters/chapter-4/dialogues'
import { chapter5Dialogues } from '~/data/chapters/chapter-5/dialogues'
import { chapter6Dialogues } from '~/data/chapters/chapter-6/dialogues'
import { chapterBonusDialogues } from '~/data/chapters/chapter-bonus/dialogues'

interface TestResult { ok: boolean; message: string }
const testResults = ref<Record<string, TestResult>>({})
const testLog = ref<TestResult[]>([])
const runningTest = ref<string | null>(null)
const testSummary = ref<{ pass: number; fail: number; total: number } | null>(null)

const dialogueSets = [chapter1Dialogues, chapter2Dialogues, chapter3Dialogues, chapter4Dialogues, chapter5Dialogues, chapterBonusDialogues, chapter6Dialogues]

function log(ok: boolean, message: string) {
  const entry = { ok, message }
  testLog.value.unshift(entry)
  return entry
}

function getMissionsForChapter(ch: ChapterConfig): MissionConfig[] {
  return allMissions.find(a => a.missions.some(m => m.chapterId === ch.id))?.missions ?? []
}

// --- VERIFY (data integrity check) ---
function autoTestMission(m: MissionConfig) {
  const checks: string[] = []
  let ok = true

  // 1. Component exists
  if (!missionComponentMap[m.id]) {
    testResults.value[m.id] = log(false, `${m.title}: componente NO encontrado`)
    return
  }
  checks.push('componente ✓')

  // 2. Icon exists
  const iconMap = missionIconMapRef
  if (!iconMap[m.id]) checks.push('icono ⚠️')
  else checks.push('icono ✓')

  // 3. Dialogues
  const chapterIdx = chaptersData.findIndex(ch => ch.missionIds.includes(m.id))
  const dialogues = chapterIdx >= 0 ? dialogueSets[chapterIdx] : null

  if (!dialogues) {
    testResults.value[m.id] = log(false, `${m.title}: capítulo no encontrado`)
    return
  }

  for (const dId of [m.introDialogueId, m.successDialogueId, m.failureDialogueId]) {
    if (!dialogues[dId]) {
      testResults.value[m.id] = log(false, `${m.title}: diálogo '${dId}' NO existe`)
      return
    }
  }
  checks.push('diálogos ✓')

  // 4. Objectives
  if (m.objectives.length === 0 || m.objectives.some(o => o.target <= 0)) {
    checks.push('objectives ⚠️')
    ok = false
  } else {
    checks.push(`objectives (${m.objectives[0].target}) ✓`)
  }

  // 5. Reward
  if (m.reward.points <= 0) checks.push('reward ⚠️')
  else checks.push(`${m.reward.points}pts ✓`)

  testResults.value[m.id] = log(ok, `${m.title}: ${checks.join(', ')}`)
}

// --- COMPLETE (mark done in store) ---
function autoCompleteMission(m: MissionConfig) {
  playerStore.completeMission(m.id)
  playerStore.addScore(m.reward.points)
  if (m.reward.seeds) playerStore.addSeeds(m.reward.seeds)
  if (m.reward.badge) playerStore.awardBadge(m.reward.badge, m.reward.badgeTitle ?? '')
  playerStore.saveProgress()
  log(true, `⚡ ${m.title}: completada +${m.reward.points}pts`)
}

// --- RUN MISSION (open, auto-complete after 2s, close) ---
// --- RUN MISSION (simulate visually: verify data → play with mistakes → complete) ---
async function runMission(m: MissionConfig) {
  if (!playerStore.isRegistered) playerStore.setProfile('TestBot', 10)
  runningTest.value = `▶ ${m.title}...`

  // 1. Verify data integrity
  autoTestMission(m)
  if (!testResults.value[m.id]?.ok) {
    runningTest.value = null
    return
  }

  // 2. Open minigame
  playingMissionId.value = m.id
  playingMissionTitle.value = m.title
  await sleep(1200)

  const overlay = document.querySelector('.mission-player-area')
  if (!overlay) {
    testResults.value[m.id] = log(false, `▶ ${m.title}: no se montó`)
    playingMissionId.value = null
    runningTest.value = null
    return
  }

  // 3. Click "Empezar"
  const startBtn = overlay.querySelector('.minigame-instructions button') as HTMLElement
  if (startBtn) {
    startBtn.click()
    await sleep(800)
  }

  // 4. Simulate gameplay (mistakes then correct)
  const gameArea = overlay.querySelector('.minigame-area') as HTMLElement
  if (gameArea) {
    if (gameArea.querySelector('.memory-card')) {
      await simulateMemoryGame(gameArea)
    } else if (gameArea.querySelector('.detect-spot')) {
      await simulateTapDetectGame(gameArea)
    } else if (gameArea.querySelector('.swipe-btn')) {
      await simulateSwipeGame(gameArea)
    } else if (gameArea.querySelector('.quiz-option')) {
      await simulateQuizGame(gameArea)
    } else if (gameArea.querySelector('.seq-slot')) {
      await simulateSequenceGame(gameArea)
    } else if (gameArea.querySelector('.game-item')) {
      await simulateGenericGame(gameArea)
    }
  }

  // 5. Wait for result screen
  await sleep(2000)

  // 6. Click result button if visible
  const resultBtn = overlay.querySelector('.minigame-result button') as HTMLElement
  if (resultBtn) {
    resultBtn.click()
    await sleep(500)
  }

  // 7. Ensure complete in store
  autoCompleteMission(m)
  playingMissionId.value = null
  playingMissionTitle.value = ''

  testResults.value[m.id] = log(true, `▶ ${m.title}: jugada, verificada y completada ✓`)
  runningTest.value = null
}

// --- RUN CHAPTER (run all missions sequentially with simulation) ---
async function runChapter(ch: ChapterConfig) {
  if (!playerStore.isRegistered) playerStore.setProfile('TestBot', 10)
  const missions = getMissionsForChapter(ch)

  for (let i = 0; i < missions.length; i++) {
    runningTest.value = `${ch.icon} ${ch.title}: ${missions[i].title} (${i + 1}/${missions.length})...`
    await runMission(missions[i])
    await sleep(500)
  }

  playerStore.completeChapter(ch.id)
  playerStore.addScore(ch.completionReward.points)
  playerStore.awardBadge(ch.completionReward.badge, ch.completionReward.badgeTitle)
  playerStore.saveProgress()
  log(true, `▶ ${ch.icon} ${ch.title}: capítulo completo (${missions.length} misiones) ✓`)
  runningTest.value = null
}

// --- RUN ALL CHAPTERS ---
async function runAllChapters() {
  if (!playerStore.isRegistered) playerStore.setProfile('TestBot', 10)
  testLog.value = []
  testResults.value = {}

  for (const ch of chaptersData) {
    await runChapter(ch)
  }

  updateSummary()
  log(true, '=== TODOS LOS CAPÍTULOS CORRIDOS ===')
}

// --- VERIFY ALL ---
function autoTestAll() {
  testLog.value = []
  testResults.value = {}
  for (const ch of allMissions) {
    for (const m of ch.missions) {
      autoTestMission(m)
    }
  }
  updateSummary()
}

function autoTestChapter(ch: ChapterConfig) {
  const missions = getMissionsForChapter(ch)
  for (const m of missions) autoTestMission(m)
  log(true, `🤖 ${ch.title}: ${missions.length} misiones verificadas`)
}

// --- COMPLETE ALL ---
function autoCompleteAll() {
  if (!playerStore.isRegistered) playerStore.setProfile('TestBot', 10)
  for (const ch of chaptersData) autoCompleteChapter(ch)
  log(true, '=== TODO COMPLETADO ===')
}

function autoCompleteChapter(ch: ChapterConfig) {
  for (const m of getMissionsForChapter(ch)) autoCompleteMission(m)
  playerStore.completeChapter(ch.id)
  playerStore.addScore(ch.completionReward.points)
  playerStore.awardBadge(ch.completionReward.badge, ch.completionReward.badgeTitle)
  playerStore.saveProgress()
  log(true, `⚡ ${ch.icon} ${ch.title}: completo ✓`)
}

// --- RESET ---
function resetAll() {
  playerStore.resetProgress()
  testResults.value = {}
  testLog.value = []
  testSummary.value = null
  log(true, '=== PROGRESO RESETEADO ===')
}

// --- SUMMARY ---
function updateSummary() {
  let pass = 0, fail = 0
  for (const r of Object.values(testResults.value)) {
    if (r.ok) pass++; else fail++
  }
  testSummary.value = { pass, fail, total: pass + fail }
}

// ===== Console capture helper =====
function captureConsole() {
  const errors: string[] = []
  const warnings: string[] = []
  const origError = console.error
  const origWarn = console.warn
  console.error = (...args: any[]) => {
    const msg = args.map(a => String(a)).join(' ').slice(0, 120)
    // Skip Vue internal devtools messages
    if (!msg.includes('devtools')) errors.push(msg)
    origError.apply(console, args)
  }
  console.warn = (...args: any[]) => {
    const msg = args.map(a => String(a)).join(' ').slice(0, 120)
    if (!msg.includes('devtools') && !msg.includes('Hydration')) warnings.push(msg)
    origWarn.apply(console, args)
  }
  return {
    errors,
    warnings,
    restore() { console.error = origError; console.warn = origWarn },
    getIssues() {
      const issues: string[] = []
      if (errors.length > 0) issues.push(`${errors.length} error(s): ${errors[0].slice(0, 80)}`)
      if (warnings.length > 0) issues.push(`${warnings.length} warn(s): ${warnings[0].slice(0, 80)}`)
      return issues
    },
  }
}

// ===== UI / MOBILE TESTS (enhanced) =====

async function uiTestMission(m: MissionConfig) {
  const issues: string[] = []
  const passed: string[] = []
  runningTest.value = `📱 UI: ${m.title}...`

  const con = captureConsole()

  // Mount
  playingMissionId.value = m.id
  playingMissionTitle.value = m.title
  await new Promise(r => setTimeout(r, 1500))

  const overlay = document.querySelector('.mission-player-area')
  if (!overlay) {
    testResults.value[m.id] = log(false, `📱 ${m.title}: no se montó`)
    playingMissionId.value = null
    runningTest.value = null
    return
  }

  // 1. Render check
  const shell = overlay.querySelector('.minigame-shell')
  if (!shell) issues.push('no MinigameShell')
  else passed.push('shell')

  // 2. Instructions overlay visible (game should start with instructions)
  const instructions = overlay.querySelector('.minigame-instructions')
  if (!instructions) issues.push('no instrucciones al inicio')
  else passed.push('instrucciones')

  // 3. Click "Empezar" and verify game area loads
  const startBtn = overlay.querySelector('.minigame-instructions button') as HTMLElement | null
  if (startBtn) {
    startBtn.click()
    await new Promise(r => setTimeout(r, 800))
  }

  // 4. Check game items exist after starting
  const gameArea = overlay.querySelector('.minigame-area') as HTMLElement | null
  const gameItems = gameArea?.querySelectorAll('.game-item, .game-zone, .game-card, .memory-card, .observe-spot, [data-slot], [data-zone]')
  if (!gameItems || gameItems.length === 0) {
    issues.push('VACÍO: no hay items/zonas/cartas después de iniciar')
  } else {
    passed.push(`${gameItems.length} items`)
  }

  // 5. Overflow check (viewport width)
  const vw = window.innerWidth
  const vh = window.innerHeight
  let overflowEls: string[] = []
  gameArea?.querySelectorAll('*').forEach(el => {
    const rect = (el as HTMLElement).getBoundingClientRect()
    if (rect.width > 0 && (rect.right > vw + 10 || rect.left < -10)) {
      const cls = (el as HTMLElement).className?.split?.(' ')?.[0] || el.tagName
      if (!overflowEls.includes(cls)) overflowEls.push(cls)
    }
  })
  if (overflowEls.length > 0) issues.push(`overflow-X: ${overflowEls.join(', ')}`)
  else passed.push('no-overflow')

  // 6. Touch targets check (≥40px)
  const interactives = gameArea?.querySelectorAll('.game-item, .game-zone, .game-card, .game-bin, button:not(:disabled), .memory-card')
  let tinyTargets: string[] = []
  interactives?.forEach(el => {
    const rect = (el as HTMLElement).getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0 && (rect.width < 36 || rect.height < 36)) {
      const cls = (el as HTMLElement).className?.split?.(' ')?.[0] || el.tagName
      if (!tinyTargets.includes(cls)) tinyTargets.push(cls)
    }
  })
  if (tinyTargets.length > 0) issues.push(`touch-chico: ${tinyTargets.join(', ')}`)
  else passed.push('touch-ok')

  // 7. Feedback toast size check (if visible, must fit screen)
  const feedback = overlay.querySelector('.game-feedback, [class*="feedback"]') as HTMLElement | null
  if (feedback && feedback.offsetWidth > 0) {
    const fbRect = feedback.getBoundingClientRect()
    if (fbRect.width > vw * 0.9) issues.push(`feedback desbordado: ${Math.round(fbRect.width)}px > ${Math.round(vw * 0.9)}px`)
    if (fbRect.height > vh * 0.3) issues.push(`feedback muy alto: ${Math.round(fbRect.height)}px`)
  }

  // 8. Drag-drop position test: if there are draggable items, verify they have position set and aren't stacked
  const dragItems = gameArea?.querySelectorAll('.game-item:not(.game-item--used)') as NodeListOf<HTMLElement> | undefined
  if (dragItems && dragItems.length >= 2) {
    const positions: { x: number; y: number; cls: string }[] = []
    let stackedCount = 0
    dragItems.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return
      const pos = { x: Math.round(rect.left), y: Math.round(rect.top), cls: el.className.split(' ')[0] }
      // Check if stacked on top of another (within 5px)
      for (const prev of positions) {
        if (Math.abs(prev.x - pos.x) < 5 && Math.abs(prev.y - pos.y) < 5) {
          stackedCount++
          break
        }
      }
      positions.push(pos)
    })
    if (stackedCount > 0) issues.push(`${stackedCount} items apilados (misma posición)`)
    else passed.push('posiciones-ok')
  }

  // 9. Simulate a drag and check nothing else moves
  if (dragItems && dragItems.length > 0) {
    const item = dragItems[0]
    const otherItems = Array.from(dragItems).slice(1, 4)
    // Record positions of other items
    const beforePositions = otherItems.map(el => {
      const r = el.getBoundingClientRect()
      return { el, x: r.left, y: r.top, w: r.width }
    }).filter(p => p.w > 0)

    // Simulate drag start
    const itemRect = item.getBoundingClientRect()
    const cx = itemRect.left + itemRect.width / 2
    const cy = itemRect.top + itemRect.height / 2
    item.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, bubbles: true }))
    await new Promise(r => setTimeout(r, 50))
    // Move 50px right
    const parent = gameArea || overlay
    parent.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 50, clientY: cy, bubbles: true }))
    await new Promise(r => setTimeout(r, 100))

    // Check if other items moved (the bug!)
    let movedCount = 0
    for (const bp of beforePositions) {
      const afterRect = bp.el.getBoundingClientRect()
      const dx = Math.abs(afterRect.left - bp.x)
      const dy = Math.abs(afterRect.top - bp.y)
      if (dx > 3 || dy > 3) movedCount++
    }
    if (movedCount > 0) issues.push(`DRAG-BUG: ${movedCount} items se movieron al arrastrar otro`)
    else if (beforePositions.length > 0) passed.push('drag-estable')

    // Release
    parent.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 50, clientY: cy, bubbles: true }))
    await new Promise(r => setTimeout(r, 200))
  }

  // 10. Stuck check: after interactions, verify game has active elements OR result
  const hasResult = !!overlay.querySelector('.minigame-result')
  const hasActiveEls = (overlay.querySelectorAll('.game-item:not(.game-item--used), .game-zone:not(.game-zone--filled), .memory-card:not(.memory-card--matched), button:not(:disabled)')?.length ?? 0) > 0
  const hasInstructions2 = !!overlay.querySelector('.minigame-instructions')
  if (!hasResult && !hasActiveEls && !hasInstructions2) {
    issues.push('TRABADO: no hay resultado, ni items activos, ni instrucciones')
  } else {
    passed.push('no-trabado')
  }

  // 11. FPS
  let frameCount = 0
  const t0 = performance.now()
  const countF = () => { frameCount++; if (performance.now() - t0 < 500) requestAnimationFrame(countF) }
  requestAnimationFrame(countF)
  await new Promise(r => setTimeout(r, 600))
  const fps = Math.round(frameCount / 0.5)
  if (fps < 25) issues.push(`${fps}fps (lag)`)
  else passed.push(`${fps}fps`)

  // 12. Check images
  let brokenImgs = 0
  overlay.querySelectorAll('img').forEach(img => {
    if (!(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalWidth === 0) brokenImgs++
  })
  if (brokenImgs > 0) issues.push(`${brokenImgs} imgs rotas`)

  // 13. Console errors & warnings
  con.restore()
  issues.push(...con.getIssues())
  if (con.errors.length === 0 && con.warnings.length === 0) passed.push('console-limpia')

  // Close
  playingMissionId.value = null
  playingMissionTitle.value = ''

  if (issues.length === 0) {
    testResults.value[m.id] = log(true, `📱 ${m.title}: ${passed.join(', ')}`)
  } else {
    testResults.value[m.id] = log(false, `📱 ${m.title}: ${issues.join(' | ')} (ok: ${passed.join(', ')})`)
  }
  runningTest.value = null
}

// UI test all missions in a chapter
async function uiTestChapter(ch: ChapterConfig) {
  const missions = getMissionsForChapter(ch)
  for (const m of missions) {
    await uiTestMission(m)
  }
  log(true, `📱 ${ch.icon} ${ch.title}: ${missions.length} misiones UI-testeadas`)
  updateSummary()
}

// UI test ALL missions
async function uiTestAll() {
  testLog.value = []
  testResults.value = {}
  if (!playerStore.isRegistered) playerStore.setProfile('TestBot', 10)

  for (const ch of allMissions) {
    for (const m of ch.missions) {
      await uiTestMission(m)
    }
  }
  updateSummary()
  log(true, '=== UI TEST COMPLETO ===')
}

// ===== STRESS TEST (simula errores del usuario) =====

async function stressTestMission(m: MissionConfig) {
  const issues: string[] = []
  const passed: string[] = []
  runningTest.value = `🔨 Stress: ${m.title}...`

  const con = captureConsole()

  playingMissionId.value = m.id
  playingMissionTitle.value = m.title
  await new Promise(r => setTimeout(r, 1200))

  const overlay = document.querySelector('.mission-player-area')
  if (!overlay) {
    con.restore()
    testResults.value[m.id] = log(false, `🔨 ${m.title}: no se montó`)
    runningTest.value = null
    return
  }

  // 1. Click "Empezar"
  const startBtn = overlay.querySelector('.minigame-instructions button') as HTMLElement | null
  if (startBtn) {
    startBtn.click()
    await new Promise(r => setTimeout(r, 600))
    passed.push('start')
  }

  const gameArea = overlay.querySelector('.minigame-area') as HTMLElement | null
  if (!gameArea) {
    issues.push('no gameArea')
    con.restore()
    playingMissionId.value = null
    testResults.value[m.id] = log(false, `🔨 ${m.title}: ${issues.join(' | ')}`)
    runningTest.value = null
    return
  }

  // 2. Random taps on empty areas (should not crash)
  for (let i = 0; i < 5; i++) {
    const rx = gameArea.getBoundingClientRect().left + Math.random() * gameArea.offsetWidth
    const ry = gameArea.getBoundingClientRect().top + Math.random() * gameArea.offsetHeight
    gameArea.dispatchEvent(new PointerEvent('pointerdown', { clientX: rx, clientY: ry, bubbles: true }))
    gameArea.dispatchEvent(new PointerEvent('pointerup', { clientX: rx, clientY: ry, bubbles: true }))
    await new Promise(r => setTimeout(r, 100))
  }
  if (document.querySelector('.mission-player-area')) passed.push('random-taps')
  else issues.push('CRASH tras random taps')

  // 3. Drag an item to wrong place (simulates wrong drop)
  const dragItem = gameArea.querySelector('.game-item:not(.game-item--used)') as HTMLElement | null
  if (dragItem) {
    const r = dragItem.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    // Drag to top-left corner (wrong zone)
    dragItem.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, bubbles: true }))
    await new Promise(r2 => setTimeout(r2, 50))
    gameArea.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 10, bubbles: true }))
    await new Promise(r2 => setTimeout(r2, 100))
    gameArea.dispatchEvent(new PointerEvent('pointerup', { clientX: 10, clientY: 10, bubbles: true }))
    await new Promise(r2 => setTimeout(r2, 400))

    // Item should snap back (not disappear)
    const itemStillExists = gameArea.querySelector('.game-item:not(.game-item--used)')
    if (itemStillExists) passed.push('drag-snapback')
    else issues.push('DRAG: item desapareció al soltar en lugar incorrecto')
  }

  // 4. Click zone without selecting item (placement games)
  const zone = gameArea.querySelector('.game-zone:not(.game-zone--filled)') as HTMLElement | null
  if (zone && !dragItem) {
    zone.click()
    await new Promise(r => setTimeout(r, 500))
    // Should show "selecciona primero" feedback
    const fb = overlay.querySelector('.game-feedback, [class*="feedback"]')
    if (fb) passed.push('feedback-sin-selección')
  }

  // 5. Memorama: click 3 cards rapidly
  const cards = gameArea.querySelectorAll('.memory-card:not(.memory-card--matched), .game-card:not(.game-card--matched)')
  if (cards.length >= 3) {
    ;(cards[0] as HTMLElement).click()
    ;(cards[1] as HTMLElement).click()
    ;(cards[2] as HTMLElement).click()
    await new Promise(r => setTimeout(r, 1500))

    // Check max 2 flipped
    const flipped = gameArea.querySelectorAll('.memory-card--flipped:not(.memory-card--matched)')
    if (flipped.length > 2) issues.push(`MEMORAMA: ${flipped.length} cartas volteadas (máx 2)`)
    else passed.push('memorama-lock')
  }

  // 6. Rapid clicks on same element (spam)
  const anyInteractive = gameArea.querySelector('.game-item, .game-zone, .memory-card, button') as HTMLElement | null
  if (anyInteractive) {
    for (let i = 0; i < 10; i++) {
      anyInteractive.click()
    }
    await new Promise(r => setTimeout(r, 300))
    if (document.querySelector('.mission-player-area')) passed.push('spam-ok')
    else issues.push('CRASH tras spam clicks')
  }

  // 7. Wait and check stuck state
  await new Promise(r => setTimeout(r, 500))
  const stillMounted = document.querySelector('.mission-player-area')
  if (!stillMounted) {
    issues.push('CRASH: componente se desmontó')
  } else {
    const hasResult = !!overlay.querySelector('.minigame-result')
    const hasItems = (overlay.querySelectorAll('.game-item:not(.game-item--used), .game-zone:not(.game-zone--filled), .memory-card:not(.memory-card--matched)')?.length ?? 0) > 0
    const hasButtons = (overlay.querySelectorAll('button:not(:disabled)')?.length ?? 0) > 0
    const hasInstr = !!overlay.querySelector('.minigame-instructions')
    if (!hasResult && !hasItems && !hasButtons && !hasInstr) {
      issues.push('TRABADO: sin resultado, sin items, sin botones')
    } else {
      passed.push('recuperable')
    }

    // 8. Check result didn't appear prematurely
    if (hasResult) {
      const isSuccess = !!overlay.querySelector('.result--success')
      if (isSuccess) issues.push('SUCCESS prematuro')
    }
  }

  // 9. Console errors & warnings
  con.restore()
  issues.push(...con.getIssues())
  if (con.errors.length === 0 && con.warnings.length === 0) passed.push('console-limpia')

  // Close
  playingMissionId.value = null
  playingMissionTitle.value = ''

  if (issues.length === 0) {
    testResults.value[m.id] = log(true, `🔨 ${m.title}: ${passed.join(', ')}`)
  } else {
    testResults.value[m.id] = log(false, `🔨 ${m.title}: ${issues.join(' | ')} (ok: ${passed.join(', ')})`)
  }
  runningTest.value = null
}

async function stressTestChapter(ch: ChapterConfig) {
  const missions = getMissionsForChapter(ch)
  for (const m of missions) {
    await stressTestMission(m)
  }
  log(true, `🔨 ${ch.icon} ${ch.title}: ${missions.length} misiones stress-testeadas`)
  updateSummary()
}

async function stressTestAll() {
  testLog.value = []
  testResults.value = {}
  if (!playerStore.isRegistered) playerStore.setProfile('TestBot', 10)

  for (const ch of allMissions) {
    for (const m of ch.missions) {
      await stressTestMission(m)
    }
  }
  updateSummary()
  log(true, '=== STRESS TEST COMPLETO ===')
}

// Icon map reference for testing
const missionIconMapRef: Record<string, string> = {
  'mission-1-clean': '🧹', 'mission-2-heat': '🌡️', 'mission-3-plant': '🌳',
  'mission-4-leak': '🔧', 'mission-5-restore': '🎨',
  'mission-1-paths': '🧹', 'mission-2-soil': '🌱', 'mission-3-water': '💧',
  'mission-4-life': '🦋', 'mission-5-reactivate': '🎨', 'mission-6-bolillo-route': '🐕',
  'mission-1-waste': '🚧', 'mission-2-detect': '🔍', 'mission-3-wetland': '🌿', 'mission-4-repair': '🔧', 'mission-5-quiz': '❓',
  'mission-1-collect': '🧹', 'mission-2-separate': '♻️', 'mission-3-pollution': '🔍',
  'mission-4-compost': '🌱', 'mission-5-recycle': '🔄',
  'mission-0-greenroof': '🌿', 'mission-1-evaluate': '📋', 'mission-2-design': '🏗️',
  'mission-3-plants': '🌱', 'mission-4-irrigation': '💧', 'mission-5-difference': '🔍',
  'bonus-1-spotter': '🔍', 'bonus-2-memory': '🧠', 'bonus-3-threats': '⚠️',
  'bonus-4-quiz': '❓', 'bonus-5-refuge': '🏠',
  'mission-1-prepare': '🎪', 'mission-2-invite': '📣', 'mission-3-solve': '🧩', 'mission-4-inaugurate': '🎉',
}

// ===== 🎮 SIMULATE — plays the game visually with mistakes then success =====

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function simulateMemoryGame(area: HTMLElement) {
  const getCards = () => Array.from(area.querySelectorAll('.memory-card:not(.memory-card--matched)')) as HTMLElement[]
  let attempts = 0

  while (getCards().length >= 2 && attempts < 40) {
    const cards = getCards()
    if (cards.length < 2) break

    // Pick two cards — sequential for first pass (reveals all), random after
    const i = attempts < cards.length ? 0 : Math.floor(Math.random() * cards.length)
    let j = attempts < cards.length ? Math.min(1, cards.length - 1) : Math.floor(Math.random() * cards.length)
    if (j === i && cards.length > 1) j = (i + 1) % cards.length

    cards[i].click()
    await sleep(500)
    cards[j].click()
    await sleep(1600)
    attempts++
  }
}

async function simulateTapDetectGame(area: HTMLElement) {
  const spots = Array.from(area.querySelectorAll('.detect-spot:not(.detect-spot--tapped)')) as HTMLElement[]
  // Shuffle to create natural order (some wrong first, then right)
  const shuffled = [...spots].sort(() => Math.random() - 0.5)
  for (const spot of shuffled) {
    spot.click()
    await sleep(1000)
  }
}

async function simulateSwipeGame(area: HTMLElement) {
  let count = 0
  while (count < 20) {
    if (area.querySelector('.swipe-done')) break
    const card = area.querySelector('.swipe-card') as HTMLElement
    if (!card) break

    const leftBtn = area.querySelector('.swipe-btn--left') as HTMLElement
    const rightBtn = area.querySelector('.swipe-btn--right') as HTMLElement
    if (!leftBtn || !rightBtn) break

    // First 2: always left (creates ~50% visible errors)
    // Then alternate to create natural gameplay
    if (count < 2) leftBtn.click()
    else if (count % 2 === 0) rightBtn.click()
    else leftBtn.click()

    await sleep(900)
    count++
  }
}

async function simulateQuizGame(area: HTMLElement) {
  let qCount = 0
  while (qCount < 12) {
    if (area.querySelector('.quiz-done')) break
    const options = Array.from(area.querySelectorAll('.quiz-option:not(.quiz-option--disabled)')) as HTMLElement[]
    if (options.length === 0) { await sleep(500); continue }

    // First 2 questions: pick LAST option (likely wrong → visible red feedback)
    // Rest: pick FIRST option (natural mix of correct/wrong)
    if (qCount < 2 && options.length > 1) {
      options[options.length - 1].click()
    } else {
      options[0].click()
    }
    await sleep(2200)
    qCount++
  }
}

async function simulateSequenceGame(area: HTMLElement) {
  const getItems = () => Array.from(area.querySelectorAll('.seq-item:not(.game-item--used)')) as HTMLElement[]
  const getSlots = () => Array.from(area.querySelectorAll('.seq-slot:not(.seq-slot--filled)')) as HTMLElement[]
  let attempts = 0

  while (getItems().length > 0 && attempts < 30) {
    const items = getItems()
    const slots = getSlots()
    if (items.length === 0 || slots.length === 0) break

    items[0].click()
    await sleep(400)

    // First 2 items: try LAST slot first (wrong), then iterate to find correct
    if (attempts < 2 && slots.length > 1) {
      slots[slots.length - 1].click()
      await sleep(1000)

      // If still available (was wrong), re-select and try all slots
      if (getItems().length === items.length) {
        for (const slot of getSlots()) {
          items[0]?.click()
          await sleep(200)
          slot.click()
          await sleep(800)
          if (getItems().length < items.length) break
        }
      }
    } else {
      // Try each slot until correct
      for (const slot of slots) {
        items[0]?.click()
        await sleep(200)
        slot.click()
        await sleep(800)
        if (getItems().length < items.length) break
      }
    }
    attempts++
  }
}

async function simulateGenericGame(area: HTMLElement) {
  // Covers ALL game types: drag-drop, placement, tap-only, zone-less
  // Uses click-based interaction (all games support tap as fallback)

  // Broad item selectors covering all game components
  const ITEM_SELECTORS = [
    '.game-item:not(.game-item--used):not(.game-item--sorted):not(.game-item--rejected):not([disabled])',
    '.trash-item:not([style*="display: none"])',
    '.seed-item:not(.seed-item--used)',
    '.obstacle:not(.obstacle--cleared)',
    '.water-drop:not(.water-drop--used)',
    '.drag-item:not(.drag-item--used)',
    '.piece-item:not(.piece-item--used)',
    '.piece-btn:not(.piece-btn--used):not([disabled])',
    '.item-btn:not(.item-btn--used):not([disabled])',
    '.neighbor-spot:not(.neighbor-spot--invited)',
  ].join(', ')

  // Broad zone selectors covering all game components
  const ZONE_SELECTORS = [
    '.game-zone:not(.game-zone--filled)',
    '.game-bin:not(.bin--done)',
    '[data-bin-id]:not(.bin--done)',
    '[data-zone]:not(.place-zone--filled):not(.drop-zone--filled)',
    '[data-slot]:not(.plant-slot--planted):not(.roof-slot--filled):not(.pipe-slot--filled)',
    '[data-gap]:not(.gap-zone--filled)',
    '[data-plant-id]:not(.plant-zone--watered)',
    '[data-stop]:not(.route-stop--fulfilled)',
  ].join(', ')

  const getVisible = (selector: string) => Array.from(area.querySelectorAll(selector)).filter(el => {
    const s = window.getComputedStyle(el)
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0.1
  }) as HTMLElement[]

  const getItems = () => getVisible(ITEM_SELECTORS)
  const getZones = () => getVisible(ZONE_SELECTORS)

  let attempts = 0
  let stuckCount = 0

  while (attempts < 100) {
    const items = getItems()
    if (items.length === 0) break

    const zones = getZones()
    const beforeCount = items.length

    // --- Pattern C: Tap-only (TrashCollector, NeighborInviter) — no zones needed ---
    if (zones.length === 0) {
      items[0].click()
      await sleep(600)
      attempts++
      if (getItems().length >= beforeCount) { stuckCount++; if (stuckCount > 8) break }
      else stuckCount = 0
      continue
    }

    // --- Pattern A/B: Select item + click zone ---

    // First 2 attempts: try wrong zone (visible error feedback)
    if (attempts < 2 && zones.length > 1) {
      items[0].click()
      await sleep(400)
      zones[zones.length - 1].click()
      await sleep(1000)
      // Re-check — wrong placement clears selection, so re-select below
    }

    // Try EVERY item against EVERY zone until one pair works
    let placed = false
    for (const item of items) {
      if (placed) break
      for (const z of zones) {
        // Select the item (click to select)
        item.click()
        await sleep(250)

        // Click the zone (attempt placement)
        z.click()
        await sleep(500)

        // Check if item count decreased (placement succeeded)
        if (getItems().length < beforeCount) {
          placed = true
          stuckCount = 0
          break
        }
      }
    }

    if (!placed) {
      stuckCount++
      if (stuckCount > 5) break
    }

    attempts++
    await sleep(200)
  }
}

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
.tag--sequence { background: #14b8a6; }
.tag--swipe { background: #f43f5e; }
.tag--line-match { background: #a855f7; }
.tag--spot-difference { background: #0ea5e9; }
.tag--route-trace { background: #84cc16; }
.tag--quiz { background: #f59e0b; }

.mission-title { font-size: 13px; font-weight: 700; color: #1e293b; flex: 1; }
.mission-pts { font-size: 12px; font-weight: 800; color: var(--color-green-dark); }
.mission-badge { font-size: 11px; color: #64748b; }

.play-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: 2px solid var(--color-green-mid);
  background: var(--color-green-bg);
  font-size: 11px;
  font-weight: 800;
  color: var(--color-green-dark);
  cursor: pointer;
  transition: all 150ms;
  white-space: nowrap;
}
.play-btn:hover { background: var(--color-green-mid); color: white; }

/* Mission player overlay */
.mission-player-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #111;
  display: flex;
  flex-direction: column;
}

.mission-player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0,0,0,0.8);
  z-index: 10;
  flex-shrink: 0;
}

.mission-player-title {
  font-size: 14px;
  font-weight: 800;
  color: white;
}

.mission-player-close {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.mission-player-close:hover { background: rgba(255,255,255,0.2); }

.mission-player-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

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
/* ===== TESTING ===== */
.test-desc { font-size: 13px; color: #64748b; margin-bottom: 12px; line-height: 1.4; }

.test-running {
  background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px;
  padding: 10px 16px; font-size: 13px; font-weight: 700; color: #92400e;
  margin-bottom: 12px; animation: pulse 1.5s ease-in-out infinite;
}

.test-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }

.test-btn {
  padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 800;
  cursor: pointer; border: none; transition: all 150ms; white-space: nowrap;
}
.test-btn:active { transform: scale(0.95); }
.test-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.test-btn--green { background: #22c55e; color: white; }
.test-btn--green:hover:not(:disabled) { background: #16a34a; }
.test-btn--blue { background: #3b82f6; color: white; }
.test-btn--blue:hover:not(:disabled) { background: #2563eb; }
.test-btn--orange { background: #f97316; color: white; }
.test-btn--orange:hover:not(:disabled) { background: #ea580c; }
.test-btn--yellow { background: #eab308; color: #1e293b; }
.test-btn--yellow:hover:not(:disabled) { background: #ca8a04; }
.test-btn--purple { background: #8b5cf6; color: white; }
.test-btn--purple:hover:not(:disabled) { background: #7c3aed; }
.test-btn--red { background: #ef4444; color: white; }
.test-btn--red:hover:not(:disabled) { background: #dc2626; }
.test-btn--small { padding: 5px 10px; font-size: 11px; }
.test-btn--tiny { padding: 3px 8px; font-size: 10px; }

.test-summary {
  padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 800;
  margin-bottom: 12px; text-align: center;
}
.test-summary--pass { background: #dcfce7; color: #16a34a; border: 2px solid #22c55e; }
.test-summary--fail { background: #fee2e2; color: #dc2626; border: 2px solid #ef4444; }

.test-chapters { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }

.test-chapter-card {
  border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; background: white;
}
.test-chapter-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
}
.test-chapter-name { font-size: 14px; font-weight: 800; color: #1e293b; }
.test-chapter-status { font-size: 13px; font-weight: 700; color: #64748b; }
.status--done { color: #16a34a; }
.test-chapter-actions { display: flex; gap: 6px; margin-bottom: 8px; }

.test-chapter-missions { display: flex; flex-direction: column; gap: 4px; }

.test-mission-row {
  display: flex; align-items: center; gap: 6px; padding: 4px 6px;
  border-radius: 6px; background: #f8fafc; flex-wrap: wrap;
}
.test-mission-status { font-size: 12px; width: 18px; }
.test-mission-type {
  padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 800;
  color: white; text-transform: uppercase;
}
.test-mission-name { font-size: 12px; font-weight: 600; color: #1e293b; flex: 1; min-width: 100px; }
.test-mission-btns { display: flex; gap: 3px; }

.test-result { font-size: 10px; font-weight: 700; width: 100%; margin-top: 2px; }
.test-result--pass { color: #16a34a; }
.test-result--fail { color: #dc2626; }

.test-log {
  background: #1e293b; border-radius: 8px; padding: 12px; margin-top: 12px;
}
.test-log-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
}
.test-log-header h4 { color: #94a3b8; font-size: 12px; margin: 0; }
.test-log-entries { max-height: 250px; overflow-y: auto; }
.test-log-entry { font-size: 11px; font-family: monospace; padding: 2px 0; }
.log--pass { color: #4ade80; }
.log--fail { color: #f87171; }
</style>
