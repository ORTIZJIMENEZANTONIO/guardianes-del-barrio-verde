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
        <ellipse cx="50" cy="140" rx="30" ry="18" fill="#9ca3af" />
        <ellipse cx="35" cy="135" rx="15" ry="12" fill="#9ca3af" />
        <ellipse cx="65" cy="135" rx="15" ry="12" fill="#9ca3af" />
        <text x="25" y="155" font-size="8" opacity="0.5">💨</text>
        <text v-if="isSpeaking" x="60" y="148" font-size="7" opacity="0.6" class="tool-wiggle">🛍️</text>
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

    <!-- FALLBACK -->
    <template v-else>
      <g class="legs">
        <rect x="38" y="130" width="10" height="28" rx="4" fill="#6b7280" />
        <rect x="52" y="130" width="10" height="28" rx="4" fill="#6b7280" />
      </g>
      <rect x="34" y="85" width="32" height="48" rx="6" fill="#9ca3af" />
      <g class="arm-left"><rect x="24" y="90" width="10" height="30" rx="4" fill="#d1d5db" /></g>
      <g class="arm-right"><rect x="66" y="90" width="10" height="30" rx="4" fill="#d1d5db" /></g>
    </template>

    <!-- HEAD -->
    <foreignObject x="10" y="0" width="80" height="85">
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

withDefaults(defineProps<{
  characterId: string
  emotion?: Emotion
  isSpeaking?: boolean
}>(), {
  emotion: 'neutral',
  isSpeaking: false,
})

const viewBox = '10 0 80 170'
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
</style>
