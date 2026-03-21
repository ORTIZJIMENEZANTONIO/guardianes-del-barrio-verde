<template>
  <svg :viewBox="viewBox" class="character-body" xmlns="http://www.w3.org/2000/svg">

    <!-- LILA -->
    <template v-if="characterId === 'lila'">
      <!-- Legs with idle sway -->
      <g class="legs">
        <rect x="38" y="130" width="10" height="30" rx="4" fill="#1e3a5f" />
        <rect x="52" y="130" width="10" height="30" rx="4" fill="#1e3a5f" />
        <ellipse cx="43" cy="162" rx="8" ry="4" fill="#dc2626" />
        <ellipse cx="57" cy="162" rx="8" ry="4" fill="#dc2626" />
      </g>
      <!-- Neck -->
      <ellipse cx="50" cy="84" rx="11" ry="7" fill="#c68642" />
      <!-- Body -->
      <rect x="34" y="85" width="32" height="48" rx="6" fill="#22c55e" />
      <rect x="34" y="85" width="10" height="40" rx="3" fill="#15803d" />
      <rect x="56" y="85" width="10" height="40" rx="3" fill="#15803d" />
      <circle cx="42" cy="100" r="4" fill="#fbbf24" />
      <text x="40" y="103" font-size="5" fill="#15803d" font-weight="bold">G</text>
      <!-- Left arm - idle swing -->
      <g class="arm-left" :class="{ 'arm--talking': isSpeaking }">
        <rect x="24" y="90" width="10" height="32" rx="4" fill="#c68642" />
        <circle cx="29" cy="124" r="5" fill="#c68642" />
      </g>
      <!-- Right arm - gestures when speaking -->
      <g class="arm-right" :class="{ 'arm--gesture': isSpeaking }">
        <rect x="66" y="90" width="10" height="32" rx="4" fill="#c68642" />
        <circle cx="71" cy="124" r="5" fill="#c68642" />
      </g>
    </template>

    <!-- TIMO -->
    <template v-else-if="characterId === 'timo'">
      <g class="legs">
        <rect x="38" y="130" width="10" height="28" rx="4" fill="#374151" />
        <rect x="52" y="130" width="10" height="28" rx="4" fill="#374151" />
        <ellipse cx="43" cy="160" rx="8" ry="4" fill="#f59e0b" />
        <ellipse cx="57" cy="160" rx="8" ry="4" fill="#f59e0b" />
      </g>
      <!-- Neck -->
      <ellipse cx="50" cy="84" rx="11" ry="7" fill="#dba77b" />
      <rect x="34" y="85" width="32" height="48" rx="6" fill="#3b82f6" />
      <rect x="40" y="85" width="20" height="12" rx="3" fill="#60a5fa" />
      <rect x="32" y="118" width="36" height="5" rx="2" fill="#92400e" />
      <rect x="56" y="115" width="6" height="12" rx="2" fill="#6b7280" />
      <g class="arm-left" :class="{ 'arm--talking': isSpeaking }">
        <rect x="24" y="90" width="10" height="30" rx="4" fill="#dba77b" />
        <circle cx="29" cy="122" r="5" fill="#dba77b" />
      </g>
      <g class="arm-right" :class="{ 'arm--gesture': isSpeaking }">
        <rect x="66" y="90" width="10" height="30" rx="4" fill="#dba77b" />
        <circle cx="71" cy="122" r="5" fill="#dba77b" />
        <!-- Wrench -->
        <rect v-if="isSpeaking" x="69" y="108" width="4" height="16" rx="1" fill="#9ca3af" class="tool-wiggle" />
      </g>
    </template>

    <!-- XANI -->
    <template v-else-if="characterId === 'xani'">
      <g class="legs">
        <rect x="39" y="130" width="9" height="28" rx="4" fill="#5b21b6" />
        <rect x="52" y="130" width="9" height="28" rx="4" fill="#5b21b6" />
        <ellipse cx="43" cy="160" rx="7" ry="3.5" fill="#7c3aed" />
        <ellipse cx="57" cy="160" rx="7" ry="3.5" fill="#7c3aed" />
      </g>
      <!-- Neck -->
      <ellipse cx="50" cy="84" rx="10" ry="7" fill="#b07848" />
      <path d="M34 85 L66 85 L70 135 L30 135 Z" fill="#a78bfa" />
      <path d="M34 85 L66 85 L62 100 L38 100 Z" fill="#8b5cf6" />
      <text x="44" y="118" font-size="10" opacity="0.3">🌿</text>
      <g class="arm-left" :class="{ 'arm--talking': isSpeaking }">
        <rect x="24" y="90" width="10" height="28" rx="4" fill="#b07848" />
        <circle cx="29" cy="120" r="5" fill="#b07848" />
      </g>
      <g class="arm-right" :class="{ 'arm--gesture': isSpeaking }">
        <rect x="66" y="90" width="10" height="28" rx="4" fill="#b07848" />
        <circle cx="71" cy="120" r="5" fill="#b07848" />
        <text v-if="isSpeaking" x="66" y="116" font-size="12" class="tool-wiggle">🌱</text>
      </g>
    </template>

    <!-- DON TOÑO -->
    <template v-else-if="characterId === 'don-tono'">
      <g class="legs">
        <rect x="37" y="132" width="11" height="30" rx="4" fill="#78716c" />
        <rect x="52" y="132" width="11" height="30" rx="4" fill="#78716c" />
        <ellipse cx="42" cy="164" rx="9" ry="4" fill="#57534e" />
        <ellipse cx="58" cy="164" rx="9" ry="4" fill="#57534e" />
      </g>
      <!-- Neck -->
      <ellipse cx="50" cy="84" rx="12" ry="7" fill="#c9a06c" />
      <rect x="33" y="85" width="34" height="50" rx="6" fill="#d6d3d1" />
      <line x1="40" y1="85" x2="40" y2="135" stroke="#a8a29e" stroke-width="0.8" />
      <line x1="53" y1="85" x2="53" y2="135" stroke="#a8a29e" stroke-width="0.8" />
      <line x1="33" y1="100" x2="67" y2="100" stroke="#a8a29e" stroke-width="0.8" />
      <line x1="33" y1="115" x2="67" y2="115" stroke="#a8a29e" stroke-width="0.8" />
      <g class="arm-left" :class="{ 'arm--talking': isSpeaking }">
        <rect x="23" y="90" width="11" height="32" rx="5" fill="#c9a06c" />
        <circle cx="28" cy="124" r="6" fill="#c9a06c" />
      </g>
      <g class="arm-right" :class="{ 'arm--gesture': isSpeaking }">
        <rect x="66" y="90" width="11" height="32" rx="5" fill="#c9a06c" />
        <circle cx="72" cy="124" r="6" fill="#c9a06c" />
      </g>
    </template>

    <!-- NUBE GRIS -->
    <template v-else-if="characterId === 'nube-gris'">
      <g class="cloud-body-float">
        <ellipse cx="50" cy="105" rx="32" ry="20" fill="#9ca3af" />
        <ellipse cx="35" cy="98" rx="16" ry="14" fill="#9ca3af" />
        <ellipse cx="65" cy="98" rx="16" ry="14" fill="#9ca3af" />
        <ellipse cx="50" cy="115" rx="22" ry="10" fill="rgba(0,0,0,0.06)" />
        <text x="25" y="120" font-size="8" opacity="0.5">💨</text>
        <text v-if="isSpeaking" x="60" y="112" font-size="7" opacity="0.6" class="tool-wiggle">🛍️</text>
      </g>
    </template>

    <!-- NICO -->
    <template v-else-if="characterId === 'nico'">
      <g class="legs">
        <rect x="38" y="130" width="10" height="28" rx="4" fill="#1e3a5f" />
        <rect x="52" y="130" width="10" height="28" rx="4" fill="#1e3a5f" />
        <ellipse cx="43" cy="160" rx="8" ry="4" fill="#2563eb" />
        <ellipse cx="57" cy="160" rx="8" ry="4" fill="#2563eb" />
      </g>
      <!-- Neck -->
      <ellipse cx="50" cy="84" rx="11" ry="7" fill="#c68642" />
      <rect x="34" y="85" width="32" height="48" rx="6" fill="#2563eb" />
      <text x="44" y="115" font-size="14" fill="white" font-weight="bold" text-anchor="middle">7</text>
      <g class="arm-left" :class="{ 'arm--talking': isSpeaking }">
        <rect x="24" y="90" width="10" height="30" rx="4" fill="#c68642" />
        <circle cx="29" cy="122" r="5" fill="#c68642" />
      </g>
      <g class="arm-right" :class="{ 'arm--gesture': isSpeaking }">
        <rect x="66" y="90" width="10" height="30" rx="4" fill="#c68642" />
        <circle cx="71" cy="122" r="5" fill="#c68642" />
        <circle v-if="isSpeaking" cx="73" cy="118" r="7" fill="#fbbf24" class="tool-wiggle" />
      </g>
    </template>

    <!-- VALE -->
    <template v-else-if="characterId === 'vale'">
      <g class="legs">
        <rect x="39" y="130" width="9" height="28" rx="4" fill="#1e3a5f" />
        <rect x="52" y="130" width="9" height="28" rx="4" fill="#1e3a5f" />
        <ellipse cx="43" cy="160" rx="7" ry="3.5" fill="#92400e" />
        <ellipse cx="57" cy="160" rx="7" ry="3.5" fill="#92400e" />
      </g>
      <!-- Neck -->
      <ellipse cx="50" cy="84" rx="10" ry="7" fill="#c9a06c" />
      <rect x="34" y="85" width="32" height="48" rx="6" fill="#fbbf24" />
      <rect x="38" y="105" width="24" height="28" rx="4" fill="#f59e0b" />
      <rect x="42" y="112" width="16" height="10" rx="2" fill="#d97706" />
      <g class="arm-left" :class="{ 'arm--talking': isSpeaking }">
        <rect x="24" y="90" width="10" height="28" rx="4" fill="#c9a06c" />
        <circle cx="29" cy="120" r="5" fill="#c9a06c" />
      </g>
      <g class="arm-right" :class="{ 'arm--gesture': isSpeaking }">
        <rect x="66" y="90" width="10" height="28" rx="4" fill="#c9a06c" />
        <circle cx="71" cy="120" r="5" fill="#c9a06c" />
      </g>
    </template>

    <!-- BOLILLO — sistema de capas PNG con expresiones + easter egg -->
    <template v-else-if="characterId === 'bolillo'">
      <foreignObject x="10" y="8" width="80" height="162">
        <div
          class="bolillo-layers"
          :class="{
            'bolillo--speaking': isSpeaking,
            'bolillo--idle': !isSpeaking && !bolilloPetted,
            'bolillo--petted': bolilloPetted,
          }"
          @click="petBolillo"
          @touchstart.passive="petBolillo"
        >
          <!-- Tail -->
          <img :src="bolilloPetted ? bolilloTailUp : bolilloTailSrc" alt="" class="bolillo-part bolillo-tail" :class="{ 'tail--wagging': isSpeaking || bolilloPetted, 'tail--super-wag': bolilloPetted }" />
          <!-- Base -->
          <img src="~/assets/images/bolillo/bolillo-base.png" alt="Bolillo" class="bolillo-base-img" />
          <!-- Eyes -->
          <img :src="bolilloPetted ? bolilloEyesHappy : bolilloEyesSrc" alt="" class="bolillo-part bolillo-eyes" />
          <!-- Brows -->
          <img :src="bolilloPetted ? bolilloBrowsNeutral : bolilloBrowsSrc" alt="" class="bolillo-part bolillo-brows" />
          <!-- Mouth -->
          <img :src="bolilloPetted ? bolilloMouthWide : bolilloMouthSrc" alt="" class="bolillo-part bolillo-mouth" />
          <!-- Pet hearts easter egg -->
          <div v-if="bolilloPetted" class="bolillo-hearts">
            <span class="bolillo-heart" style="left:20%;animation-delay:0s">❤️</span>
            <span class="bolillo-heart" style="left:50%;animation-delay:0.2s">💛</span>
            <span class="bolillo-heart" style="left:75%;animation-delay:0.4s">❤️</span>
          </div>
        </div>
      </foreignObject>
    </template>

    <!-- FALLBACK -->
    <template v-else>
      <g class="legs">
        <rect x="38" y="130" width="10" height="28" rx="4" fill="#6b7280" />
        <rect x="52" y="130" width="10" height="28" rx="4" fill="#6b7280" />
      </g>
      <!-- Neck -->
      <ellipse cx="50" cy="84" rx="10" ry="7" fill="#d1d5db" />
      <rect x="34" y="85" width="32" height="48" rx="6" fill="#9ca3af" />
      <g class="arm-left"><rect x="24" y="90" width="10" height="30" rx="4" fill="#d1d5db" /></g>
      <g class="arm-right"><rect x="66" y="90" width="10" height="30" rx="4" fill="#d1d5db" /></g>
    </template>

    <!-- HEAD — skip for Bolillo (PNG includes full character) -->
    <foreignObject v-if="characterId !== 'bolillo'" x="10" y="20" width="80" height="80">
      <CharacterFace
        :character-id="characterId"
        :emotion="emotion"
        :is-speaking="isSpeaking"
      />
    </foreignObject>
  </svg>
</template>

<script setup lang="ts">
import type { Emotion } from '~/shared/types/character'

const props = withDefaults(defineProps<{
  characterId: string
  emotion?: Emotion
  isSpeaking?: boolean
}>(), {
  emotion: 'neutral',
  isSpeaking: false,
})

const viewBox = '10 8 80 162'

// ===== BOLILLO layer system =====
import bolilloEyesNeutral from '~/assets/images/bolillo/bolillo-eyes-neutral.png'
import bolilloEyesHappy from '~/assets/images/bolillo/bolillo-eyes-happy.png'
import bolilloEyesSad from '~/assets/images/bolillo/bolillo-eyes-sad.png'
import bolilloEyesClosed from '~/assets/images/bolillo/bolillo-eyes-closed.png'
import bolilloMouthClosed from '~/assets/images/bolillo/bolillo-mouth-2-closed.png'
import bolilloMouthOpen from '~/assets/images/bolillo/bolillo-mouth-2-open.png'
import bolilloMouthWide from '~/assets/images/bolillo/bolillo-mouth-2-wide.png'
import bolilloBrowsNeutral from '~/assets/images/bolillo/bolillo-brows-neutral.png'
import bolilloBrowsWorried from '~/assets/images/bolillo/bolillo-brows-worried.png'
import bolilloBrowsAngry from '~/assets/images/bolillo/bolillo-brows-angry.png'
import bolilloTailDown from '~/assets/images/bolillo/bolillo-tail-down.png'
import bolilloTailUp from '~/assets/images/bolillo/bolillo-tail-up.png'

// Blink system
const isBolilloBlinking = ref(false)
let bolilloBlinkInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  bolilloBlinkInterval = setInterval(() => {
    isBolilloBlinking.value = true
    setTimeout(() => { isBolilloBlinking.value = false }, 150)
  }, 3000 + Math.random() * 2000)
})

onUnmounted(() => {
  if (bolilloBlinkInterval) clearInterval(bolilloBlinkInterval)
})

// Mouth toggle for speaking
const bolilloMouthOpenState = ref(false)
let bolilloTalkInterval: ReturnType<typeof setInterval> | null = null

watch(() => props.isSpeaking, (speaking) => {
  if (speaking) {
    bolilloMouthOpenState.value = true
    bolilloTalkInterval = setInterval(() => {
      bolilloMouthOpenState.value = !bolilloMouthOpenState.value
    }, 180)
  } else {
    if (bolilloTalkInterval) { clearInterval(bolilloTalkInterval); bolilloTalkInterval = null }
    bolilloMouthOpenState.value = false
  }
}, { immediate: true })

// Eyes: emotion → image
const bolilloEyesSrc = computed(() => {
  if (isBolilloBlinking.value) return bolilloEyesClosed
  const e = props.emotion
  if (e === 'happy' || e === 'excited' || e === 'proud' || e === 'mischievous') return bolilloEyesHappy
  if (e === 'sad' || e === 'worried') return bolilloEyesSad
  return bolilloEyesNeutral
})

// Brows: emotion → image
const bolilloBrowsSrc = computed(() => {
  const e = props.emotion
  if (e === 'sad' || e === 'worried' || e === 'thinking' || e === 'surprised') return bolilloBrowsWorried
  if (e === 'angry') return bolilloBrowsAngry
  return bolilloBrowsNeutral
})

// Mouth: speaking + emotion
const bolilloMouthSrc = computed(() => {
  if (props.isSpeaking) return bolilloMouthOpenState.value ? bolilloMouthOpen : bolilloMouthClosed
  const e = props.emotion
  if (e === 'happy' || e === 'excited' || e === 'proud' || e === 'surprised') return bolilloMouthWide
  return bolilloMouthClosed
})

// Easter egg: pet Bolillo 5 times → happy reaction
const bolilloPetCount = ref(0)
const bolilloPetted = ref(false)
let bolilloPetTimer: ReturnType<typeof setTimeout> | null = null
let bolilloPetResetTimer: ReturnType<typeof setTimeout> | null = null

function petBolillo() {
  if (bolilloPetted.value) return

  bolilloPetCount.value++

  // Reset tap counter after 3s of no taps
  if (bolilloPetResetTimer) clearTimeout(bolilloPetResetTimer)
  bolilloPetResetTimer = setTimeout(() => { bolilloPetCount.value = 0 }, 3000)

  if (bolilloPetCount.value >= 5) {
    bolilloPetted.value = true
    bolilloPetCount.value = 0

    // Return to normal after 3s
    bolilloPetTimer = setTimeout(() => {
      bolilloPetted.value = false
    }, 3000)
  }
}

// Tail: speaking/emotion
const bolilloTailSrc = computed(() => {
  if (props.isSpeaking) return bolilloTailUp
  const e = props.emotion
  if (e === 'happy' || e === 'excited' || e === 'proud') return bolilloTailUp
  return bolilloTailDown
})
</script>

<style scoped>
.character-body {
  height: 100%;
  width: auto;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

/* ===== IDLE ARM SWING — subtle, like breathing ===== */
.arm-left {
  transform-origin: 29px 90px;
  animation: armIdleLeft 3s ease-in-out infinite;
}

.arm-right {
  transform-origin: 71px 90px;
  animation: armIdleRight 3s ease-in-out infinite;
}

@keyframes armIdleLeft {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg); }
}

@keyframes armIdleRight {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-3deg); }
}

/* ===== TALKING — more movement, gesturing ===== */
.arm--talking {
  animation: armTalkLeft 0.6s ease-in-out infinite alternate;
}

.arm--gesture {
  animation: armGesture 0.5s ease-in-out infinite alternate;
}

@keyframes armTalkLeft {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(8deg) translateY(-2px); }
}

@keyframes armGesture {
  0% { transform: rotate(0deg) translateY(0); }
  50% { transform: rotate(-25deg) translateY(-8px); }
  100% { transform: rotate(-15deg) translateY(-5px); }
}

/* ===== TOOL / ITEM WIGGLE ===== */
.tool-wiggle {
  animation: toolWiggle 0.4s ease-in-out infinite alternate;
  transform-origin: center center;
}

@keyframes toolWiggle {
  0% { transform: rotate(-5deg) scale(1); }
  100% { transform: rotate(5deg) scale(1.1); }
}

/* ===== LEGS subtle idle ===== */
.legs {
  animation: legsIdle 4s ease-in-out infinite;
}

@keyframes legsIdle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(1px); }
}

/* ===== NUBE GRIS float ===== */
.cloud-body-float {
  animation: cloudBodyFloat 2.5s ease-in-out infinite;
}

@keyframes cloudBodyFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.02); }
}

/* ===== BOLILLO LAYER SYSTEM ===== */
/* Base: 413x496 (~0.83 aspect ratio). Preserve proportions. */
.bolillo-layers {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  cursor: pointer;
}

.bolillo-base-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  position: relative;
  z-index: 2;
}

.bolillo-part {
  position: absolute;
  pointer-events: none;
  object-fit: contain;
}

/* Eyes: ~47% wide, positioned at ~26% left, ~26% top of base */
.bolillo-eyes {
  width: 44%;
  left: 20%;
  top: 29%;
  z-index: 3;
}

/* Brows: ~47% wide, just above eyes */
.bolillo-brows {
  width: 42%;
  left: 20%;
  top: 27%;
  z-index: 4;
}

/* Mouth: ~42% wide, below nose area */
.bolillo-mouth {
  width: 40%;
  left: 20%;
  top: 32%;
  z-index: 3;
}

/* Tail down: right side, behind body */
.bolillo-tail {
  width: 25%;
  left: 75%;
  top: 48%;
  z-index: 1;
}

/* Idle breathing */
.bolillo--idle .bolillo-base-img {
  animation: bolilloIdle 3s ease-in-out infinite;
}

/* Speaking bounce */
.bolillo--speaking .bolillo-base-img {
  animation: bolilloSpeak 0.4s ease-in-out infinite alternate;
}

/* Tail wagging */
.tail--wagging {
  animation: tailWagPng 0.3s ease-in-out infinite alternate;
  transform-origin: 30% 90%;
}

@keyframes bolilloIdle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes bolilloSpeak {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-3px) scale(1.02); }
}

@keyframes tailWagPng {
  0% { transform: rotate(-5deg); }
  100% { transform: rotate(5deg); }
}

/* Easter egg: petted state */
.bolillo--petted .bolillo-base-img {
  animation: bolilloPetBounce 0.3s ease-in-out infinite alternate;
}

.tail--super-wag {
  animation: tailSuperWag 0.15s ease-in-out infinite alternate !important;
  transform-origin: 30% 90%;
}

@keyframes bolilloPetBounce {
  0% { transform: translateY(0) rotate(-2deg); }
  100% { transform: translateY(-4px) rotate(2deg); }
}

@keyframes tailSuperWag {
  0% { transform: rotate(-15deg); }
  100% { transform: rotate(15deg); }
}

/* Hearts floating up */
.bolillo-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.bolillo-heart {
  position: absolute;
  top: 10%;
  font-size: 16px;
  animation: heartFloat 1s ease-out forwards;
}

@keyframes heartFloat {
  0% { transform: translateY(0) scale(0); opacity: 1; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
  100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
}

/* ===== CANELA dog idle ===== */
.dog-body-idle {
  animation: dogIdle 3s ease-in-out infinite;
}

@keyframes dogIdle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}

.dog-tail {
  transform-origin: 68px 105px;
  animation: tailIdle 2s ease-in-out infinite;
}

.tail--wagging {
  animation: tailWag 0.3s ease-in-out infinite alternate;
}

@keyframes tailIdle {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}

@keyframes tailWag {
  0% { transform: rotate(-15deg); }
  100% { transform: rotate(15deg); }
}
</style>
