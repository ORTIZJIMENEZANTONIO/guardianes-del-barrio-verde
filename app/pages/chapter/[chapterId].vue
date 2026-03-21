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
        <SceneSky variant="hot" />
        <SceneStreet variant="dirty" />
        <!-- Floating problems -->
        <div
          v-for="(item, i) in cinematicFloats"
          :key="i"
          class="floating-element"
          :style="item.style"
        >
          <span class="float-icon" :class="item.class">{{ item.emoji }}</span>
        </div>
        <DialogueScene />
        <ActionButton :visible="!dialogueStore.isDialogueActive && sceneReady">
          <GameButton variant="primary" size="lg" @click="advanceScene">
            🎮 Comenzar
          </GameButton>
        </ActionButton>
      </div>

      <!-- DIALOGUE SCENE -->
      <div v-else-if="currentSceneType === 'dialogue'" class="scene dialogue-full-scene">
        <SceneSky variant="nice" />
        <SceneStreet variant="normal" />
        <DialogueScene />
        <ActionButton :visible="!dialogueStore.isDialogueActive && sceneReady">
          <GameButton variant="primary" size="lg" @click="advanceScene">
            Continuar ▶
          </GameButton>
        </ActionButton>
      </div>

      <!-- EXPLORATION SCENE (Observation) -->
      <div v-else-if="currentSceneType === 'exploration'" class="scene exploration-scene">
        <SceneSky variant="hot" />
        <SceneStreet variant="dirty" />
        <div class="exploration-bg">
          <div class="explore-title">
            <span class="explore-title__icon">🔍</span>
            {{ route.params.chapterId === 'chapter-2' ? 'Explora el parque. ¡Toca lo que notes!' : 'Observa la calle. ¡Toca lo que notes!' }}
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
        <ActionButton :visible="observedCount >= 5 && !dialogueStore.isDialogueActive">
          <GameButton variant="primary" size="lg" @click="advanceScene">
            ¡Listo! ▶
          </GameButton>
        </ActionButton>
      </div>

      <!-- MISSION SCENE -->
      <div v-else-if="currentSceneType === 'mission'" class="scene mission-scene">
        <div v-if="missionPhase === 'intro'" class="mission-intro">
          <SceneSky variant="nice" />
          <SceneStreet variant="normal" />
          <!-- Mission title card -->
          <div class="mission-title-card animate-pop-in">
            <div class="mission-title-card__icon">{{ missionIcon }}</div>
            <div class="mission-title-card__name">{{ currentMissionConfig?.title }}</div>
          </div>
          <DialogueScene />
          <ActionButton :visible="!dialogueStore.isDialogueActive && sceneReady">
            <GameButton variant="primary" size="lg" @click="startCurrentMission">
              💪 ¡A trabajar!
            </GameButton>
          </ActionButton>
        </div>

        <div v-else-if="missionPhase === 'playing'" class="mission-playing">
          <component :is="currentMissionComponent" @complete="onMissionComplete" />
        </div>

        <div v-else-if="missionPhase === 'success'" class="mission-success">
          <SceneSky variant="nice" />
          <SceneStreet variant="clean" />
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
        <SceneSky :variant="transformStep >= 1 ? 'nice' : 'hot'" />
        <div class="transform-container">
          <!-- Before -->
          <div class="transform-card" :class="{ 'transform--fading': transformStep >= 1 }">
            <div class="transform-label">😰 Antes</div>
            <div class="transform-street transform-street--before">
              <div class="transform-row">
                <span v-for="(e, i) in transformEmojis.before[0]" :key="'b0-'+i">{{ e }}</span>
              </div>
              <div class="transform-row">
                <span v-for="(e, i) in transformEmojis.before[1]" :key="'b1-'+i">{{ e }}</span>
              </div>
            </div>
          </div>
          <!-- After -->
          <div v-if="transformStep >= 1" class="transform-card transform-card--after animate-pop-in">
            <div class="transform-label">🌟 Después</div>
            <div class="transform-street transform-street--after">
              <div class="transform-row">
                <span v-for="(e, i) in transformEmojis.after[0]" :key="'a0-'+i">{{ e }}</span>
              </div>
              <div class="transform-row">
                <span v-for="(e, i) in transformEmojis.after[1]" :key="'a1-'+i">{{ e }}</span>
              </div>
            </div>
          </div>
        </div>
        <ActionButton :visible="transformStep < 1">
          <GameButton variant="primary" size="lg" @click="transformStep = 1">
            ✨ Ver la transformación
          </GameButton>
        </ActionButton>
        <template v-if="transformStep >= 1">
          <DialogueScene />
          <ActionButton :visible="!dialogueStore.isDialogueActive && sceneReady">
            <GameButton variant="primary" size="lg" @click="advanceScene">
              Continuar ▶
            </GameButton>
          </ActionButton>
        </template>
      </div>

      <!-- SUMMARY SCENE -->
      <div v-else-if="currentSceneType === 'summary'" class="scene summary-scene">
        <SceneSky variant="nice" />
        <div class="particles particles--celebration">
          <span v-for="i in 8" :key="i" class="particle" :style="particleStyle(i)">{{ ['⭐','🌟','✨','🎉','🌿','🌱','🏅','💚'][i-1] }}</span>
        </div>
        <div class="summary-card animate-scale-in">
          <h2 class="summary-title">{{ chapter?.title }}</h2>
          <div class="summary-icon">🏆</div>
          <p class="summary-subtitle">¡Capítulo completado!</p>

          <div class="summary-learnings">
            <h3>{{ summaryData.heading }}</h3>
            <ul>
              <li v-for="(item, i) in summaryData.learnings" :key="i">{{ item }}</li>
            </ul>
          </div>

          <div class="summary-message">
            <p>"{{ summaryData.message }}"</p>
          </div>

          <div class="summary-rewards">
            <div class="summary-reward-item"><span>🏅</span><span>{{ chapter?.completionReward.badgeTitle }}</span></div>
            <div class="summary-reward-item"><span>🌿</span><span>+{{ chapter?.completionReward.points }} puntos verdes</span></div>
            <div class="summary-reward-item"><span>🔓</span><span>{{ summaryData.unlockLabel }}</span></div>
          </div>

          <GameButton variant="primary" size="lg" @click="advanceScene">
            Continuar ▶
          </GameButton>
        </div>
      </div>

      <!-- HOOK TO NEXT CHAPTER -->
      <div v-else-if="currentSceneType === 'hook'" class="scene hook-scene">
        <SceneSky variant="sunset" />
        <div class="hook-bg">
          <div class="hook-preview animate-pop-in">
            <span style="font-size: 72px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));">{{ hookData.icon }}</span>
            <h2>{{ hookData.title }}</h2>
            <p>Próximamente...</p>
          </div>
        </div>
        <DialogueScene />
        <ActionButton :visible="!dialogueStore.isDialogueActive && sceneReady">
          <GameButton v-if="nextChapterId" variant="primary" size="lg" @click="goToNextChapter">
            ▶ {{ nextChapterLabel }}
          </GameButton>
          <GameButton v-else variant="secondary" size="lg" @click="goToChapterSelect">
            🏆 Ver capítulos
          </GameButton>
        </ActionButton>
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
import { chapter2 } from '~/data/chapters/chapter-2'
import { chapter2Dialogues } from '~/data/chapters/chapter-2/dialogues'
import { chapter2Missions } from '~/data/chapters/chapter-2/missions'
import { chapter3 } from '~/data/chapters/chapter-3'
import { chapter3Dialogues } from '~/data/chapters/chapter-3/dialogues'
import { chapter3Missions } from '~/data/chapters/chapter-3/missions'
import type { MissionConfig } from '~/shared/types/mission'
import type { DialoguePool } from '~/shared/types/character'

import SidewalkCleanup from '~/components/chapter/chapter-1/SidewalkCleanup.vue'
import HeatDetector from '~/components/chapter/chapter-1/HeatDetector.vue'
import ShadePlanter from '~/components/chapter/chapter-1/ShadePlanter.vue'
import LeakFixer from '~/components/chapter/chapter-1/LeakFixer.vue'
import SpaceRestorer from '~/components/chapter/chapter-1/SpaceRestorer.vue'

import PathClear from '~/components/chapter/chapter-2/PathClear.vue'
import SoilMemory from '~/components/chapter/chapter-2/SoilMemory.vue'
import WaterDragDrop from '~/components/chapter/chapter-2/WaterDragDrop.vue'
import WildlifeMemory from '~/components/chapter/chapter-2/WildlifeMemory.vue'
import ParkDragRestore from '~/components/chapter/chapter-2/ParkDragRestore.vue'

// Phaser-based minigames (async to keep Phaser out of initial bundle)
const USE_PHASER = true
// Chapter 1
const SidewalkCleanupPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-1/SidewalkCleanupPhaser.vue'))
const HeatDetectorPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-1/HeatDetectorPhaser.vue'))
const ShadePlanterPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-1/ShadePlanterPhaser.vue'))
const LeakFixerPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-1/LeakFixerPhaser.vue'))
const SpaceRestorerPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-1/SpaceRestorerPhaser.vue'))
// Chapter 2
const PathClearPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-2/PathClearPhaser.vue'))
const SoilMemoryPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-2/SoilMemoryPhaser.vue'))
const WaterDragDropPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-2/WaterDragDropPhaser.vue'))
const WildlifeMemoryPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-2/WildlifeMemoryPhaser.vue'))
const ParkDragRestorePhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-2/ParkDragRestorePhaser.vue'))
// Chapter 3
const FloodDragClearPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-3/FloodDragClearPhaser.vue'))
const WetlandMemoryPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-3/WetlandMemoryPhaser.vue'))
const PipeDragFitPhaser = defineAsyncComponent(() => import('~/components/chapter/chapter-3/PipeDragFitPhaser.vue'))

import FloodDragClear from '~/components/chapter/chapter-3/FloodDragClear.vue'
import WetlandMemory from '~/components/chapter/chapter-3/WetlandMemory.vue'
import PipeDragFit from '~/components/chapter/chapter-3/PipeDragFit.vue'

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
  if (route.params.chapterId === 'chapter-2') return chapter2
  if (route.params.chapterId === 'chapter-3') return chapter3
  return null
})

// Dialogue and mission lookups per chapter
const chapterDialogues = computed<Record<string, DialoguePool>>(() => {
  if (route.params.chapterId === 'chapter-2') return chapter2Dialogues
  if (route.params.chapterId === 'chapter-3') return chapter3Dialogues
  return chapter1Dialogues
})

const chapterMissions = computed<MissionConfig[]>(() => {
  if (route.params.chapterId === 'chapter-2') return chapter2Missions
  if (route.params.chapterId === 'chapter-3') return chapter3Missions
  return chapter1Missions
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
  return chapterMissions.value.find(m => m.id === missionId) ?? null
})

const missionComponentMap: Record<string, any> = {
  // Chapter 1
  'mission-1-clean': USE_PHASER ? SidewalkCleanupPhaser : SidewalkCleanup,
  'mission-2-heat': USE_PHASER ? HeatDetectorPhaser : HeatDetector,
  'mission-3-plant': USE_PHASER ? ShadePlanterPhaser : ShadePlanter,
  'mission-4-leak': USE_PHASER ? LeakFixerPhaser : LeakFixer,
  'mission-5-restore': USE_PHASER ? SpaceRestorerPhaser : SpaceRestorer,
  // Chapter 2
  'mission-1-paths': USE_PHASER ? PathClearPhaser : PathClear,
  'mission-2-soil': USE_PHASER ? SoilMemoryPhaser : SoilMemory,
  'mission-3-water': USE_PHASER ? WaterDragDropPhaser : WaterDragDrop,
  'mission-4-life': USE_PHASER ? WildlifeMemoryPhaser : WildlifeMemory,
  'mission-5-reactivate': USE_PHASER ? ParkDragRestorePhaser : ParkDragRestore,
  // Chapter 3
  'mission-1-waste': USE_PHASER ? FloodDragClearPhaser : FloodDragClear,
  'mission-2-wetland': USE_PHASER ? WetlandMemoryPhaser : WetlandMemory,
  'mission-3-repair': USE_PHASER ? PipeDragFitPhaser : PipeDragFit,
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

const chapter1Spots: ObservationSpot[] = [
  { id: 'obs-trash', label: 'Basura', emoji: '🛍️', dialogueId: 'observation-trash', x: 20, y: 50, found: false },
  { id: 'obs-notrees', label: 'Sin árboles', emoji: '🌵', dialogueId: 'observation-notrees', x: 55, y: 30, found: false },
  { id: 'obs-bench', label: 'Banca caliente', emoji: '🪑', dialogueId: 'observation-bench', x: 40, y: 60, found: false },
  { id: 'obs-leak', label: 'Fuga', emoji: '💧', dialogueId: 'observation-leak', x: 75, y: 45, found: false },
  { id: 'obs-pavement', label: 'Pavimento', emoji: '🟫', dialogueId: 'observation-pavement', x: 30, y: 75, found: false },
]

const chapter2Spots: ObservationSpot[] = [
  { id: 'obs-trash', label: 'Basura en sendero', emoji: '🛍️', dialogueId: 'observation-trash', x: 20, y: 50, found: false },
  { id: 'obs-swing', label: 'Columpio roto', emoji: '🎠', dialogueId: 'observation-swing', x: 55, y: 30, found: false },
  { id: 'obs-planter', label: 'Jardinera seca', emoji: '🪴', dialogueId: 'observation-planter', x: 72, y: 55, found: false },
  { id: 'obs-bolillo', label: 'Bolillo escondido', emoji: '🐕', dialogueId: 'observation-bolillo', x: 80, y: 35, found: false },
  { id: 'obs-bench', label: 'Banca dañada', emoji: '🪑', dialogueId: 'observation-bench', x: 30, y: 70, found: false },
]

const defaultSpots = computed(() => {
  if (route.params.chapterId === 'chapter-2') return chapter2Spots
  return chapter1Spots
})

const observationSpots = ref<ObservationSpot[]>(defaultSpots.value.map(s => ({ ...s })))

const observedCount = computed(() => observationSpots.value.filter(s => s.found).length)

function tapObservation(spot: ObservationSpot) {
  if (spot.found || dialogueStore.isDialogueActive) return
  spot.found = true

  const pool = chapterDialogues.value[spot.dialogueId]
  if (pool) {
    dialogueStore.startDialogue(pool.lines, () => {
      // After last spot, show completion dialogue then enable button
      if (observedCount.value >= 5) {
        const completePool = chapterDialogues.value['observation-complete']
        if (completePool) {
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
      const pool = chapterDialogues.value[mission.introDialogueId]
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
    observationSpots.value = defaultSpots.value.map(s => ({ ...s }))
  }

  if (scene.type === 'hook') {
    if (scene.dialoguePoolId) {
      const pool = chapterDialogues.value[scene.dialoguePoolId]
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
    const pool = chapterDialogues.value[scene.dialoguePoolId]
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
    goToChapterSelect()
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

  const pool = chapterDialogues.value[mission.successDialogueId]
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

// Ordered chapter list for navigation
const chapterOrder = ['chapter-1', 'chapter-2', 'chapter-3']

// Next chapter: the one right after current. If current is last, find first incomplete.
const nextChapterId = computed(() => {
  const currentId = route.params.chapterId as string
  const idx = chapterOrder.indexOf(currentId)
  // If there's a next chapter in order, go there
  if (idx >= 0 && idx < chapterOrder.length - 1) return chapterOrder[idx + 1]
  // Last chapter: find first incomplete chapter (wrap around)
  const firstIncomplete = chapterOrder.find(id => id !== currentId && !playerStore.isChapterComplete(id))
  return firstIncomplete ?? null
})

// Label for the hook button — shows target chapter name
const nextChapterLabel = computed(() => {
  if (!nextChapterId.value) return ''
  return chapterMeta[nextChapterId.value]?.title ?? 'Siguiente capítulo'
})

function goToMenu() {
  showPauseModal.value = false
  playerStore.saveProgress()
  gameStore.goToMenu()
  router.push('/')
}

function goToChapterSelect() {
  playerStore.saveProgress()
  router.push('/capitulos')
}

function goToNextChapter() {
  if (!nextChapterId.value) return
  playerStore.saveProgress()
  gameStore.setScene(0)
  router.push(`/chapter/${nextChapterId.value}`)
}

// Mission icons
const missionIconMap: Record<string, string> = {
  // Chapter 1
  'mission-1-clean': '🧹',
  'mission-2-heat': '🌡️',
  'mission-3-plant': '🌳',
  'mission-4-leak': '🔧',
  'mission-5-restore': '🎨',
  // Chapter 2
  'mission-1-paths': '🧹',
  'mission-2-soil': '🌱',
  'mission-3-water': '💧',
  'mission-4-life': '🦋',
  'mission-5-reactivate': '🎨',
  // Chapter 3
  'mission-1-waste': '🚧',
  'mission-2-wetland': '🌿',
  'mission-3-repair': '🔧',
}
const missionIcon = computed(() => missionIconMap[currentScene.value?.missionId ?? ''] ?? '⭐')

// Chapter-specific transformation emojis
const transformEmojis = computed(() => {
  if (route.params.chapterId === 'chapter-2') {
    return {
      before: [['🍂', '🪴', '🎠'], ['😔', '🐕', '🪑']],
      after: [['🌳', '🌸', '🎠'], ['🦋', '🐕', '👨‍👩‍👧']],
    }
  }
  if (route.params.chapterId === 'chapter-3') {
    return {
      before: [['💧', '🛍️', '🧱'], ['😰', '🪵', '🥤']],
      after: [['💧', '🌿', '🐸'], ['🪷', '🦆', '😊']],
    }
  }
  return {
    before: [['🏚️', '🌡️', '🛍️'], ['💧', '😓', '📄']],
    after: [['🏡', '🌳', '🌸'], ['🦋', '😊', '👨‍👩‍👧']],
  }
})

// Chapter-specific summary data
const summaryData = computed(() => {
  if (route.params.chapterId === 'chapter-2') {
    return {
      heading: 'El Parque Dormido cambió porque:',
      learnings: [
        'Se limpiaron senderos y zonas de juego',
        'Se recuperó el suelo de las jardineras',
        'Se regó con cuidado y estrategia',
        'Volvieron flores y pequeños visitantes',
        'Se reparó para que la comunidad lo use otra vez',
      ],
      message: 'Un parque cuidado da sombra, vida, descanso y alegría al barrio.',
      unlockLabel: 'Zona 3: La Fuga Infinita',
    }
  }
  if (route.params.chapterId === 'chapter-3') {
    return {
      heading: 'La Fuga Infinita cambió porque:',
      learnings: [
        'Se controló el desperdicio de agua',
        'Se limpió y protegió una zona húmeda',
        'Se reparó la fuga principal',
        'El agua volvió a su camino correcto',
      ],
      message: 'El agua debe cuidarse. Y los humedales ayudan a guardarla, filtrarla y darle vida al barrio.',
      unlockLabel: 'Zona 4: La Ruta de la Basura',
    }
  }
  return {
    heading: 'La calle cambió porque:',
    learnings: [
      'Se limpió la banqueta',
      'Se detectaron zonas de mayor calor',
      'Se plantó sombra',
      'Se arregló una fuga',
      'Se recuperó el espacio',
    ],
    message: 'Más sombra, menos basura y mejor cuidado pueden cambiar cómo se vive una calle.',
    unlockLabel: 'Zona 2: El Parque Dormido',
  }
})

// Hook data: shows preview of the next chapter (or wrap-around target)
const chapterMeta: Record<string, { icon: string; title: string }> = {
  'chapter-1': { icon: '🌡️', title: 'La Calle Caliente' },
  'chapter-2': { icon: '🏞️', title: 'El Parque Dormido' },
  'chapter-3': { icon: '💧', title: 'La Fuga Infinita' },
}
// What chapter comes next in the story (for the hook preview text/icon)
const storyNextMap: Record<string, string> = {
  'chapter-1': 'chapter-2',
  'chapter-2': 'chapter-3',
  'chapter-3': 'chapter-4', // future
}
const hookData = computed(() => {
  const storyNext = storyNextMap[route.params.chapterId as string]
  // If story-next exists in meta, show it
  if (storyNext && chapterMeta[storyNext]) return chapterMeta[storyNext]
  // If nextChapterId is a wrap-around to an incomplete chapter, show that
  if (nextChapterId.value && chapterMeta[nextChapterId.value]) return chapterMeta[nextChapterId.value]
  // Fallback for future chapters
  const futureHooks: Record<string, { icon: string; title: string }> = {
    'chapter-3': { icon: '🗑️', title: 'La Ruta de la Basura' },
  }
  return futureHooks[route.params.chapterId as string] ?? { icon: '🌿', title: 'Siguiente aventura' }
})

// Chapter-specific cinematic floating elements
const cinematicFloats = computed(() => {
  if (route.params.chapterId === 'chapter-2') {
    return [
      { emoji: '🍂', style: 'top: 12%; left: 15%; animation-delay: 0s;', class: '' },
      { emoji: '🎠', style: 'top: 25%; right: 12%; animation-delay: 1.2s;', class: '' },
      { emoji: '🪴', style: 'top: 35%; left: 30%; animation-delay: 0.6s;', class: '' },
      { emoji: '🐕', style: 'top: 20%; left: 55%; animation-delay: 1.8s;', class: '' },
      { emoji: '🪑', style: 'top: 30%; right: 25%; animation-delay: 2.4s;', class: '' },
    ]
  }
  if (route.params.chapterId === 'chapter-3') {
    return [
      { emoji: '💧', style: 'top: 12%; left: 15%; animation-delay: 0s;', class: '' },
      { emoji: '🛍️', style: 'top: 25%; right: 12%; animation-delay: 1.2s;', class: '' },
      { emoji: '🧱', style: 'top: 35%; left: 30%; animation-delay: 0.6s;', class: '' },
      { emoji: '🌊', style: 'top: 20%; left: 55%; animation-delay: 1.8s;', class: '' },
      { emoji: '🪵', style: 'top: 30%; right: 25%; animation-delay: 2.4s;', class: '' },
    ]
  }
  return [
    { emoji: '🌡️', style: 'top: 12%; left: 15%; animation-delay: 0s;', class: 'heat-wave' },
    { emoji: '🛍️', style: 'top: 25%; right: 12%; animation-delay: 1.2s;', class: '' },
    { emoji: '💧', style: 'top: 35%; left: 30%; animation-delay: 0.6s;', class: '' },
    { emoji: '📄', style: 'top: 20%; left: 55%; animation-delay: 1.8s;', class: '' },
    { emoji: '💨', style: 'top: 30%; right: 25%; animation-delay: 2.4s;', class: '' },
  ]
})

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
    const pool = chapterDialogues.value[currentScene.value?.dialoguePoolId ?? '']
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

/* Pause */
.pause-menu { text-align: center; }
.pause-menu h2 { color: var(--color-green-dark); font-size: 24px; font-weight: 800; margin-bottom: 18px; }
.pause-stats { margin-bottom: 22px; }
.pause-stats p { font-size: 15px; font-weight: 600; padding: 5px 0; }
.pause-buttons { display: flex; flex-direction: column; gap: 12px; }
</style>
