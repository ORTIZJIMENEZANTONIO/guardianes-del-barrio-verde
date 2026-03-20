<template>
  <div class="chapter-page game-container">
    <!-- HUD -->
    <GameHud
      v-if="showHud"
      :chapter-title="chapter?.title"
      @pause="showPauseModal = true"
    />

    <!-- Scene container -->
    <div class="scene-container">
      <!-- CINEMATIC SCENE -->
      <div v-if="currentSceneType === 'cinematic'" class="scene cinematic-scene">
        <!-- Sky -->
        <div class="scene-sky scene-sky--hot" />
        <!-- City silhouette layers -->
        <div class="city-layer city-far">
          <span>🏢</span><span>🏗️</span><span>🏢</span><span>🏨</span>
        </div>
        <div class="city-layer city-mid">
          <span>🏚️</span><span>🏠</span><span>🏚️</span><span>🏠</span><span>🏚️</span>
        </div>
        <!-- Street level -->
        <div class="street-ground street-ground--dirty" />
        <!-- Floating problems -->
        <div class="floating-element" style="top: 18%; left: 15%; animation-delay: 0s;">
          <span class="float-icon heat-wave">🌡️</span>
        </div>
        <div class="floating-element" style="top: 35%; right: 12%; animation-delay: 1.2s;">
          <span class="float-icon">🛍️</span>
        </div>
        <div class="floating-element" style="bottom: 38%; left: 30%; animation-delay: 0.6s;">
          <span class="float-icon">💧</span>
        </div>
        <div class="floating-element" style="top: 28%; left: 55%; animation-delay: 1.8s;">
          <span class="float-icon">📄</span>
        </div>
        <div class="floating-element" style="bottom: 42%; right: 25%; animation-delay: 2.4s;">
          <span class="float-icon">💨</span>
        </div>
        <DialogueScene />
        <div v-if="!dialogueStore.isDialogueActive && sceneReady" class="scene-action">
          <GameButton variant="primary" size="lg" @click="advanceScene">
            🎮 Comenzar
          </GameButton>
        </div>
      </div>

      <!-- DIALOGUE SCENE -->
      <div v-else-if="currentSceneType === 'dialogue'" class="scene dialogue-full-scene">
        <div class="scene-sky scene-sky--nice" />
        <div class="city-layer city-far" style="opacity: 0.3;">
          <span>🏢</span><span>🏗️</span><span>🏢</span>
        </div>
        <div class="city-layer city-mid">
          <span>🏘️</span><span>🏠</span><span>🌳</span><span>🏠</span><span>🏘️</span>
        </div>
        <div class="street-ground" />
        <!-- Ambient life -->
        <div class="ambient-element" style="bottom: 28%; right: 8%;">🐕</div>
        <div class="ambient-element" style="bottom: 26%; left: 10%; animation-delay: 2s;">🚶</div>
        <DialogueScene />
        <div v-if="!dialogueStore.isDialogueActive && sceneReady" class="scene-action">
          <GameButton variant="primary" size="lg" @click="advanceScene">
            Continuar ▶
          </GameButton>
        </div>
      </div>

      <!-- EXPLORATION SCENE (Observation) -->
      <div v-else-if="currentSceneType === 'exploration'" class="scene exploration-scene">
        <div class="scene-sky scene-sky--hot" />
        <!-- Street environment -->
        <div class="city-layer city-mid" style="opacity: 0.6;">
          <span>🏚️</span><span>🏠</span><span>🏚️</span><span>🏠</span>
        </div>
        <div class="street-ground street-ground--dirty" />
        <div class="exploration-bg">
          <div class="explore-title">
            <span class="explore-title__icon">🔍</span>
            Observa la calle. ¡Toca lo que notes!
          </div>

          <div
            v-for="spot in observationSpots"
            :key="spot.id"
            class="observe-spot"
            :class="{ 'observe-spot--found': spot.found }"
            :style="{ left: spot.x + '%', top: spot.y + '%' }"
            @click="tapObservation(spot)"
          >
            <span class="observe-emoji">{{ spot.emoji }}</span>
            <span class="observe-label">{{ spot.label }}</span>
            <span v-if="!spot.found" class="observe-ping" />
          </div>

          <div class="observe-progress">
            <span class="observe-progress__bar">
              <span class="observe-progress__fill" :style="{ width: (observedCount / 5 * 100) + '%' }" />
            </span>
            <span class="observe-progress__text">{{ observedCount }}/5</span>
          </div>
        </div>
        <DialogueScene />
        <div v-if="observedCount >= 5 && !dialogueStore.isDialogueActive && sceneReady" class="scene-action">
          <GameButton variant="primary" size="lg" @click="advanceScene">
            ¡Listo! ▶
          </GameButton>
        </div>
      </div>

      <!-- MISSION SCENE -->
      <div v-else-if="currentSceneType === 'mission'" class="scene mission-scene">
        <div v-if="missionPhase === 'intro'" class="mission-intro">
          <div class="scene-sky scene-sky--nice" />
          <div class="city-layer city-mid" style="opacity: 0.4;">
            <span>🏠</span><span>🏘️</span><span>🌳</span><span>🏠</span>
          </div>
          <div class="street-ground" />
          <!-- Mission title card -->
          <div class="mission-title-card animate-pop-in">
            <div class="mission-title-card__icon">{{ missionIcon }}</div>
            <div class="mission-title-card__name">{{ currentMissionConfig?.title }}</div>
          </div>
          <DialogueScene />
          <div v-if="!dialogueStore.isDialogueActive && sceneReady" class="scene-action">
            <GameButton variant="primary" size="lg" @click="startCurrentMission">
              💪 ¡A trabajar!
            </GameButton>
          </div>
        </div>

        <div v-else-if="missionPhase === 'playing'" class="mission-playing">
          <component :is="currentMissionComponent" @complete="onMissionComplete" />
        </div>

        <div v-else-if="missionPhase === 'success'" class="mission-success">
          <div class="scene-sky scene-sky--nice" />
          <div class="street-ground street-ground--clean" />
          <!-- Celebration particles -->
          <div class="particles">
            <span v-for="i in 12" :key="i" class="particle" :style="particleStyle(i)">{{ particleEmoji(i) }}</span>
          </div>
          <DialogueScene />
          <RewardPopup
            :show="showReward"
            :title="currentMissionConfig?.title ?? ''"
            :points="currentMissionConfig?.reward.points"
            :seeds="currentMissionConfig?.reward.seeds"
            :badge="currentMissionConfig?.reward.badgeTitle"
            @continue="onRewardClaimed"
          />
        </div>
      </div>

      <!-- TRANSFORMATION SCENE -->
      <div v-else-if="currentSceneType === 'transformation'" class="scene transformation-scene">
        <div class="scene-sky" :class="transformStep >= 1 ? 'scene-sky--nice' : 'scene-sky--hot'" style="transition: all 2s ease;" />
        <div class="transform-container">
          <!-- Before -->
          <div class="transform-card" :class="{ 'transform--fading': transformStep >= 1 }">
            <div class="transform-label">😰 Antes</div>
            <div class="transform-street transform-street--before">
              <div class="transform-row">
                <span>🏚️</span><span>🌡️</span><span>🛍️</span>
              </div>
              <div class="transform-row">
                <span>💧</span><span>😓</span><span>📄</span>
              </div>
            </div>
          </div>
          <!-- After -->
          <div v-if="transformStep >= 1" class="transform-card transform-card--after animate-pop-in">
            <div class="transform-label">🌟 Después</div>
            <div class="transform-street transform-street--after">
              <div class="transform-row">
                <span>🏡</span><span>🌳</span><span>🌸</span>
              </div>
              <div class="transform-row">
                <span>🦋</span><span>😊</span><span>👨‍👩‍👧</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="transformStep < 1" class="scene-action">
          <GameButton variant="primary" size="lg" @click="transformStep = 1">
            ✨ Ver la transformación
          </GameButton>
        </div>
        <div v-else>
          <DialogueScene />
          <div v-if="!dialogueStore.isDialogueActive && sceneReady" class="scene-action">
            <GameButton variant="primary" size="lg" @click="advanceScene">
              Continuar ▶
            </GameButton>
          </div>
        </div>
      </div>

      <!-- SUMMARY SCENE -->
      <div v-else-if="currentSceneType === 'summary'" class="scene summary-scene">
        <div class="scene-sky scene-sky--nice" />
        <div class="particles particles--celebration">
          <span v-for="i in 8" :key="i" class="particle" :style="particleStyle(i)">{{ ['⭐','🌟','✨','🎉','🌿','🌱','🏅','💚'][i-1] }}</span>
        </div>
        <div class="summary-card animate-scale-in">
          <h2 class="summary-title">{{ chapter?.title }}</h2>
          <div class="summary-icon">🏆</div>
          <p class="summary-subtitle">¡Capítulo completado!</p>

          <div class="summary-learnings">
            <h3>La calle cambió porque:</h3>
            <ul>
              <li>Se limpió la banqueta</li>
              <li>Se detectaron zonas de mayor calor</li>
              <li>Se plantó sombra</li>
              <li>Se arregló una fuga</li>
              <li>Se recuperó el espacio</li>
            </ul>
          </div>

          <div class="summary-message">
            <p>"Más sombra, menos basura y mejor cuidado pueden cambiar cómo se vive una calle."</p>
          </div>

          <div class="summary-rewards">
            <div class="summary-reward-item"><span>🏅</span><span>Guardián de la Calle Caliente</span></div>
            <div class="summary-reward-item"><span>🌿</span><span>+50 puntos verdes</span></div>
            <div class="summary-reward-item"><span>🔓</span><span>Zona 2: El Parque Dormido</span></div>
          </div>

          <GameButton variant="primary" size="lg" @click="advanceScene">
            Continuar ▶
          </GameButton>
        </div>
      </div>

      <!-- HOOK TO NEXT CHAPTER -->
      <div v-else-if="currentSceneType === 'hook'" class="scene hook-scene">
        <div class="scene-sky scene-sky--sunset" />
        <div class="hook-bg">
          <div class="hook-preview animate-pop-in">
            <span style="font-size: 72px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));">🏞️</span>
            <h2>El Parque Dormido</h2>
            <p>Próximamente...</p>
          </div>
        </div>
        <DialogueScene />
        <div v-if="!dialogueStore.isDialogueActive && sceneReady" class="scene-action">
          <GameButton variant="secondary" size="lg" @click="goToMenu">
            🏠 Volver al inicio
          </GameButton>
        </div>
      </div>
    </div>

    <!-- Pause modal -->
    <Modal :show="showPauseModal" @close="showPauseModal = false" size="sm">
      <div class="pause-menu">
        <h2>Pausa</h2>
        <div class="pause-stats">
          <p>🌿 Puntos: {{ playerStore.score }}</p>
          <p>🌱 Semillas: {{ playerStore.seeds }}</p>
          <p>🏅 Insignias: {{ playerStore.totalBadges }}</p>
        </div>
        <div class="pause-buttons">
          <GameButton variant="primary" size="md" @click="showPauseModal = false">
            Continuar
          </GameButton>
          <GameButton variant="ghost" size="md" @click="goToMenu">
            Salir al menú
          </GameButton>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/useGameStore'
import { usePlayerStore } from '~/stores/usePlayerStore'
import { useDialogueStore } from '~/stores/useDialogueStore'
import { chapter1 } from '~/data/chapters/chapter-1'
import { chapter1Dialogues } from '~/data/chapters/chapter-1/dialogues'
import { chapter1Missions } from '~/data/chapters/chapter-1/missions'
import type { MissionConfig } from '~/shared/types/mission'

import SidewalkCleanup from '~/components/chapter/chapter-1/SidewalkCleanup.vue'
import HeatDetector from '~/components/chapter/chapter-1/HeatDetector.vue'
import ShadePlanter from '~/components/chapter/chapter-1/ShadePlanter.vue'
import LeakFixer from '~/components/chapter/chapter-1/LeakFixer.vue'
import SpaceRestorer from '~/components/chapter/chapter-1/SpaceRestorer.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()
const dialogueStore = useDialogueStore()

const showPauseModal = ref(false)
const showReward = ref(false)
const missionPhase = ref<'intro' | 'playing' | 'success'>('intro')
const sceneReady = ref(false)
const transformStep = ref(0)

// Chapter data
const chapter = computed(() => {
  if (route.params.chapterId === 'chapter-1') return chapter1
  return null
})

const currentScene = computed(() => {
  if (!chapter.value) return null
  return chapter.value.scenes[gameStore.currentSceneIndex] ?? null
})

const currentSceneType = computed(() => currentScene.value?.type ?? 'dialogue')

const showHud = computed(() => {
  return currentSceneType.value !== 'cinematic' && currentSceneType.value !== 'summary'
})

// Mission handling
const currentMissionConfig = computed<MissionConfig | null>(() => {
  const missionId = currentScene.value?.missionId
  if (!missionId) return null
  return chapter1Missions.find(m => m.id === missionId) ?? null
})

const missionComponentMap: Record<string, any> = {
  'mission-1-clean': SidewalkCleanup,
  'mission-2-heat': HeatDetector,
  'mission-3-plant': ShadePlanter,
  'mission-4-leak': LeakFixer,
  'mission-5-restore': SpaceRestorer,
}

const currentMissionComponent = computed(() => {
  const missionId = currentScene.value?.missionId
  if (!missionId) return null
  return missionComponentMap[missionId] ?? null
})

// Observation spots for exploration scene
interface ObservationSpot {
  id: string
  label: string
  emoji: string
  dialogueId: string
  x: number
  y: number
  found: boolean
}

const observationSpots = ref<ObservationSpot[]>([
  { id: 'obs-trash', label: 'Basura', emoji: '🛍️', dialogueId: 'observation-trash', x: 20, y: 50, found: false },
  { id: 'obs-notrees', label: 'Sin árboles', emoji: '🌵', dialogueId: 'observation-notrees', x: 55, y: 30, found: false },
  { id: 'obs-bench', label: 'Banca caliente', emoji: '🪑', dialogueId: 'observation-bench', x: 40, y: 60, found: false },
  { id: 'obs-leak', label: 'Fuga', emoji: '💧', dialogueId: 'observation-leak', x: 75, y: 45, found: false },
  { id: 'obs-pavement', label: 'Pavimento', emoji: '🟫', dialogueId: 'observation-pavement', x: 30, y: 75, found: false },
])

const observedCount = computed(() => observationSpots.value.filter(s => s.found).length)

const observationDone = ref(false)

function tapObservation(spot: ObservationSpot) {
  if (spot.found || dialogueStore.isDialogueActive || observationDone.value) return
  spot.found = true

  const pool = chapter1Dialogues[spot.dialogueId]
  if (pool) {
    dialogueStore.startDialogue(pool.lines, () => {
      if (observedCount.value >= 4 && !observationDone.value) {
        observationDone.value = true
        const completePool = chapter1Dialogues['observation-complete']
        if (completePool) {
          sceneReady.value = false
          dialogueStore.startDialogue(completePool.lines, () => {
            sceneReady.value = true
          })
        } else {
          sceneReady.value = true
        }
      }
    })
  }
}

// Scene management
function startSceneDialogue() {
  sceneReady.value = false
  const scene = currentScene.value
  if (!scene) return

  if (scene.type === 'mission') {
    missionPhase.value = 'intro'
    const mission = currentMissionConfig.value
    if (mission) {
      const pool = chapter1Dialogues[mission.introDialogueId]
      if (pool) {
        dialogueStore.startDialogue(pool.lines, () => {
          sceneReady.value = true
        })
        return
      }
    }
    sceneReady.value = true
    return
  }

  if (scene.type === 'transformation') {
    transformStep.value = 0
    sceneReady.value = true
    return
  }

  if (scene.type === 'summary') {
    // Award chapter completion (only once)
    const chapterId = chapter.value?.id ?? ''
    if (!playerStore.isChapterComplete(chapterId)) {
      playerStore.addScore(chapter.value?.completionReward.points ?? 0)
      playerStore.awardBadge(
        chapter.value?.completionReward.badge ?? '',
        chapter.value?.completionReward.badgeTitle ?? ''
      )
      playerStore.completeChapter(chapterId)
      playerStore.saveProgress()
    }
    sceneReady.value = true
    return
  }

  if (scene.type === 'exploration') {
    observationDone.value = false
    observationSpots.value.forEach(s => { s.found = false })
  }

  if (scene.type === 'hook') {
    if (scene.dialoguePoolId) {
      const pool = chapter1Dialogues[scene.dialoguePoolId]
      if (pool) {
        dialogueStore.startDialogue(pool.lines, () => {
          sceneReady.value = true
        })
        return
      }
    }
    sceneReady.value = true
    return
  }

  if (scene.dialoguePoolId) {
    const pool = chapter1Dialogues[scene.dialoguePoolId]
    if (pool) {
      dialogueStore.startDialogue(pool.lines, () => {
        sceneReady.value = true
      })
      return
    }
  }

  sceneReady.value = true
}

function advanceScene() {
  const totalScenes = chapter.value?.scenes.length ?? 0
  if (gameStore.currentSceneIndex >= totalScenes - 1) {
    goToMenu()
    return
  }
  sceneReady.value = false
  gameStore.nextScene()
}

function startCurrentMission() {
  missionPhase.value = 'playing'
}

function onMissionComplete() {
  const mission = currentMissionConfig.value
  if (!mission) return

  missionPhase.value = 'success'
  playerStore.addScore(mission.reward.points)
  if (mission.reward.seeds) playerStore.addSeeds(mission.reward.seeds)
  if (mission.reward.badge) playerStore.awardBadge(mission.reward.badge, mission.reward.badgeTitle ?? '')
  playerStore.completeMission(mission.id)
  playerStore.saveProgress()

  const pool = chapter1Dialogues[mission.successDialogueId]
  if (pool) {
    dialogueStore.startDialogue(pool.lines, () => {
      showReward.value = true
    })
  } else {
    showReward.value = true
  }
}

function onRewardClaimed() {
  showReward.value = false
  advanceScene()
}

function goToMenu() {
  showPauseModal.value = false
  playerStore.saveProgress()
  gameStore.goToMenu()
  router.push('/')
}

// Mission icons
const missionIconMap: Record<string, string> = {
  'mission-1-clean': '🧹',
  'mission-2-heat': '🌡️',
  'mission-3-plant': '🌳',
  'mission-4-leak': '🔧',
  'mission-5-restore': '🎨',
}
const missionIcon = computed(() => missionIconMap[currentScene.value?.missionId ?? ''] ?? '⭐')

// Celebration particles
function particleStyle(i: number) {
  const x = 10 + (i * 7) % 80
  const delay = (i * 0.3) % 2
  const dur = 2 + (i % 3)
  return { left: x + '%', animationDelay: delay + 's', animationDuration: dur + 's' }
}
function particleEmoji(i: number) {
  return ['⭐','🌟','✨','🎉','🌿','🌱','💚','🎊','🌸','🦋','☘️','💫'][i - 1] ?? '✨'
}

// Watch scene changes
watch(() => gameStore.currentSceneIndex, () => {
  startSceneDialogue()
})

// Start transformation dialogue when step changes
watch(transformStep, (step) => {
  if (step === 1) {
    const pool = chapter1Dialogues[currentScene.value?.dialoguePoolId ?? '']
    if (pool) {
      sceneReady.value = false
      dialogueStore.startDialogue(pool.lines, () => {
        sceneReady.value = true
      })
    }
  }
})

onMounted(() => {
  gameStore.setScene(0)
  startSceneDialogue()
})
</script>

<style scoped>
.scene { width: 100%; height: 100%; position: relative; display: flex; flex-direction: column; overflow: hidden; }

/* ===== SHARED SCENE BUILDING BLOCKS ===== */
.scene-sky {
  position: absolute; inset: 0; z-index: 0;
  transition: background 2s ease;
}
.scene-sky--hot {
  background: linear-gradient(180deg, #fb923c 0%, #fbbf24 25%, #fde68a 50%, #e8d5b7 75%, #d4cbb8 100%);
}
.scene-sky--nice {
  background: linear-gradient(180deg, #38bdf8 0%, #7dd3fc 30%, #bae6fd 55%, #d8f3dc 80%, #a8e6c3 100%);
}
.scene-sky--sunset {
  background: linear-gradient(180deg, #6366f1 0%, #a78bfa 20%, #f472b6 45%, #fb923c 70%, #fbbf24 100%);
}

.city-layer {
  position: absolute; left: 0; right: 0; z-index: 1;
  display: flex; justify-content: center; gap: 4px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}
.city-far { bottom: 32%; font-size: 36px; opacity: 0.25; gap: 12px; }
.city-mid { bottom: 22%; font-size: 44px; opacity: 0.5; gap: 6px; }

.street-ground {
  position: absolute; bottom: 0; left: 0; right: 0; height: 22%; z-index: 1;
  background: linear-gradient(180deg, #a8a29e 0%, #78716c 100%);
  border-top: 3px solid #d6d3d1;
}
.street-ground--dirty {
  background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
  border-top-color: #d1d5db;
}
.street-ground--clean {
  background: linear-gradient(180deg, #86efac 0%, #4ade80 50%, #22c55e 100%);
  border-top-color: #bbf7d0;
}

/* Floating elements */
.floating-element {
  position: absolute; z-index: 2;
  animation: float 4s ease-in-out infinite;
}
.float-icon {
  font-size: 32px;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2));
  display: block;
}
.heat-wave { animation: heatWave 2s infinite; }

/* Ambient life */
.ambient-element {
  position: absolute; z-index: 2;
  font-size: 24px;
  animation: float 5s ease-in-out infinite;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15));
}

/* ===== EXPLORATION ===== */
.exploration-scene { background: transparent; }
.exploration-bg { position: absolute; inset: 0; z-index: 2; padding-top: 50px; }

.explore-title {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
  padding: 10px 20px; border-radius: var(--radius-full);
  font-weight: 800; font-size: 13px; color: var(--color-text);
  white-space: nowrap; z-index: 5;
  box-shadow: var(--shadow-md);
  display: flex; align-items: center; gap: 6px;
}
.explore-title__icon { font-size: 18px; }

.observe-spot {
  position: absolute; display: flex; flex-direction: column;
  align-items: center; gap: 4px; padding: 12px 14px;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: var(--radius-md); cursor: pointer;
  transition: all 300ms var(--ease-spring);
  box-shadow: var(--shadow-md); z-index: 3;
}
.observe-spot:hover { transform: scale(1.1); box-shadow: var(--shadow-lg), 0 0 20px rgba(255,255,255,0.3); }
.observe-spot:active { transform: scale(0.9); transition-duration: 80ms; }
.observe-spot--found {
  background: rgba(69,201,122,0.3); border-color: var(--color-green-mid);
  box-shadow: var(--shadow-sm), var(--glow-green);
}
.observe-spot--found .observe-ping { display: none; }

.observe-emoji { font-size: 28px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15)); }
.observe-label { font-size: 11px; font-weight: 800; color: var(--color-text); }

.observe-ping {
  position: absolute; inset: -4px; border-radius: var(--radius-md);
  border: 2px solid var(--color-yellow);
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  75%, 100% { transform: scale(1.3); opacity: 0; }
}

.observe-progress {
  position: absolute; top: 10px; right: 14px;
  display: flex; align-items: center; gap: 8px;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.4);
  padding: 6px 14px; border-radius: var(--radius-full);
  z-index: 5; box-shadow: var(--shadow-sm);
}
.observe-progress__bar {
  width: 50px; height: 8px; background: rgba(0,0,0,0.1);
  border-radius: var(--radius-full); overflow: hidden;
}
.observe-progress__fill {
  height: 100%; background: var(--color-green-mid);
  border-radius: var(--radius-full); transition: width 500ms var(--ease-spring);
}
.observe-progress__text { font-weight: 800; font-size: 13px; color: var(--color-text); }

/* ===== MISSION ===== */
.mission-intro, .mission-success { width: 100%; height: 100%; position: relative; }
.mission-playing { width: 100%; height: 100%; }

.mission-title-card {
  position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
  z-index: 3; text-align: center;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
  padding: 16px 32px; border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}
.mission-title-card__icon { font-size: 48px; margin-bottom: 6px; }
.mission-title-card__name { font-size: 18px; font-weight: 800; color: var(--color-text); }

/* Particles */
.particles {
  position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden;
}
.particle {
  position: absolute; top: -10%;
  font-size: 22px;
  animation: particleFall linear infinite;
  opacity: 0.8;
}
@keyframes particleFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

/* ===== TRANSFORMATION ===== */
.transformation-scene {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 20px;
}

.transform-container {
  display: flex; gap: 20px; flex-wrap: wrap;
  justify-content: center; margin-bottom: 20px; z-index: 2;
}
.transform-card { text-align: center; transition: all 1s var(--ease-out); }
.transform--fading { opacity: 0.3; transform: scale(0.9); }
.transform-card--after { animation: popIn 700ms var(--ease-spring) forwards; }

.transform-label {
  font-weight: 800; color: white; margin-bottom: 10px; font-size: 15px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.transform-street {
  width: 150px; padding: 16px; border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg); border: 2px solid rgba(255,255,255,0.3);
}
.transform-row { display: flex; justify-content: center; gap: 6px; font-size: 32px; padding: 4px 0; }
.transform-street--before { background: linear-gradient(145deg, #d1d5db, #9ca3af); }
.transform-street--after {
  background: linear-gradient(145deg, #86efac, #34d399);
  box-shadow: var(--shadow-lg), var(--glow-green);
}

/* ===== SUMMARY ===== */
.summary-scene {
  display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;
}
.summary-card {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: var(--radius-xl); padding: 28px;
  max-width: 400px; width: 100%; text-align: center;
  box-shadow: var(--shadow-xl); z-index: 3;
}
.summary-title { font-size: 24px; font-weight: 800; color: var(--color-green-dark); }
.summary-icon {
  font-size: 56px; margin: 12px 0;
  animation: popIn 600ms var(--ease-spring) forwards;
  filter: drop-shadow(0 4px 12px rgba(251,191,36,0.3));
}
.summary-subtitle { font-size: 18px; color: var(--color-green-dark); font-weight: 800; margin-bottom: 16px; }
.summary-learnings { text-align: left; margin-bottom: 16px; }
.summary-learnings h3 { font-size: 14px; font-weight: 800; color: var(--color-text); margin-bottom: 8px; }
.summary-learnings ul { list-style: none; padding: 0; }
.summary-learnings li { padding: 4px 0; font-size: 13px; font-weight: 600; color: var(--color-text); }
.summary-learnings li::before { content: '✅ '; }
.summary-message {
  background: linear-gradient(135deg, var(--color-green-bg), rgba(168,230,195,0.3));
  border: 1px solid var(--color-green-pale);
  padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;
}
.summary-message p { font-size: 14px; font-style: italic; color: var(--color-green-dark); font-weight: 700; }
.summary-rewards { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.summary-reward-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  background: linear-gradient(135deg, var(--color-green-bg), rgba(168,230,195,0.3));
  border: 1px solid var(--color-green-pale);
  border-radius: var(--radius-md); font-size: 13px; font-weight: 700; color: var(--color-green-dark);
}

/* ===== HOOK ===== */
.hook-scene { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.hook-bg { flex: 1; display: flex; align-items: center; justify-content: center; z-index: 2; }
.hook-preview { text-align: center; color: white; }
.hook-preview h2 { font-size: 26px; font-weight: 800; margin-top: 14px; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
.hook-preview p { font-weight: 600; margin-top: 6px; font-size: 15px; text-shadow: 0 1px 6px rgba(0,0,0,0.4); }

/* ===== SHARED ===== */
.scene-action {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  z-index: 25; animation: slideUp 500ms var(--ease-out);
}

/* Pause */
.pause-menu { text-align: center; }
.pause-menu h2 { color: var(--color-green-dark); font-size: 24px; font-weight: 800; margin-bottom: 18px; }
.pause-stats { margin-bottom: 22px; }
.pause-stats p { font-size: 15px; font-weight: 600; padding: 5px 0; }
.pause-buttons { display: flex; flex-direction: column; gap: 12px; }
</style>
