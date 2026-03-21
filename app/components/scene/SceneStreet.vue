<template>
  <div class="street" :class="`street--${variant}`">
    <!-- Buildings SVG -->
    <svg class="buildings-svg" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <!-- Far buildings (silhouette) -->
      <g class="far-buildings" opacity="0.2">
        <rect x="10" y="60" width="50" height="140" rx="2" fill="#6b7280" />
        <rect x="65" y="40" width="35" height="160" rx="2" fill="#9ca3af" />
        <rect x="110" y="70" width="60" height="130" rx="2" fill="#6b7280" />
        <rect x="200" y="50" width="40" height="150" rx="2" fill="#9ca3af" />
        <rect x="280" y="65" width="55" height="135" rx="2" fill="#6b7280" />
        <rect x="340" y="45" width="45" height="155" rx="2" fill="#9ca3af" />
      </g>

      <!-- Near buildings with detail -->
      <!-- Building 1: Casa rosa con techo -->
      <g>
        <rect x="5" y="100" width="65" height="100" :fill="variant === 'clean' ? '#fda4af' : '#e8a0a0'" />
        <polygon x="5" points="5,100 37,75 70,100" :fill="variant === 'clean' ? '#fb7185' : '#d07070'" />
        <rect x="5" y="195" width="65" height="5" fill="#a8a29e" />
        <!-- Windows -->
        <rect x="14" y="112" width="11" height="13" rx="1" :fill="windowFill(1)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="32" y="112" width="11" height="13" rx="1" :fill="windowFill(2)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="50" y="112" width="11" height="13" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="14" y="140" width="11" height="13" rx="1" :fill="windowFill(3)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="50" y="140" width="11" height="13" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Door -->
        <rect x="30" y="162" width="16" height="28" rx="2" fill="#8B6914" />
        <circle cx="43" cy="178" r="1.2" fill="#D4A843" />
        <!-- Window shine -->
        <rect x="15" y="113" width="3" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
        <rect x="51" y="113" width="3" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
      </g>

      <!-- Building 2: Edificio amarillo -->
      <g>
        <rect x="75" y="85" width="55" height="115" :fill="variant === 'clean' ? '#fde047' : '#e8d07a'" />
        <rect x="75" y="85" width="55" height="6" :fill="variant === 'clean' ? '#eab308' : '#c4a850'" />
        <rect x="75" y="195" width="55" height="5" fill="#a8a29e" />
        <!-- Windows (grid) -->
        <rect v-for="(w, i) in yellowWindows" :key="'yw'+i" :x="w.x" :y="w.y" width="10" height="11" rx="1" :fill="windowFill(i)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Shop front -->
        <rect x="82" y="165" width="40" height="25" rx="2" fill="#92400e" opacity="0.8" />
        <rect x="84" y="167" width="36" height="16" rx="1" :fill="variant === 'clean' ? '#fef08a' : '#d4c88a'" />
        <!-- Awning -->
        <path d="M80 163 L132 163" stroke="#dc2626" stroke-width="3" />
        <path d="M82 163 L82 167 M92 163 L92 167 M102 163 L102 167 M112 163 L112 167 M122 163 L122 167" stroke="#dc2626" stroke-width="1.5" />
      </g>

      <!-- Building 3: Edificio azul alto -->
      <g>
        <rect x="135" y="55" width="60" height="145" :fill="variant === 'clean' ? '#93c5fd' : '#8da8c4'" />
        <rect x="135" y="55" width="60" height="5" :fill="variant === 'clean' ? '#3b82f6' : '#6080a0'" />
        <rect x="135" y="195" width="60" height="5" fill="#a8a29e" />
        <!-- Windows grid -->
        <rect v-for="(w, i) in blueWindows" :key="'bw'+i" :x="w.x" :y="w.y" width="9" height="10" rx="1" :fill="windowFill(i+5)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Entrance -->
        <rect x="155" y="170" width="20" height="25" rx="1" fill="#1e40af" opacity="0.6" />
        <rect x="157" y="172" width="7" height="20" rx="0.5" fill="#60a5fa" opacity="0.4" />
        <rect x="166" y="172" width="7" height="20" rx="0.5" fill="#60a5fa" opacity="0.4" />
      </g>

      <!-- Building 4: Casa verde baja -->
      <g>
        <rect x="200" y="120" width="55" height="80" :fill="variant === 'clean' ? '#86efac' : '#8ec0a0'" />
        <polygon points="200,120 227,95 255,120" :fill="variant === 'clean' ? '#22c55e' : '#5a9070'" />
        <rect x="200" y="195" width="55" height="5" fill="#a8a29e" />
        <!-- Windows -->
        <rect x="210" y="132" width="12" height="14" rx="1.5" :fill="windowFill(4)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="233" y="132" width="12" height="14" rx="1.5" :fill="windowFill(7)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Door -->
        <rect x="219" y="162" width="15" height="28" rx="2" fill="#713f12" />
        <circle cx="231" cy="178" r="1.2" fill="#D4A843" />
        <!-- Planter box -->
        <rect v-if="variant === 'clean'" x="208" y="148" width="16" height="3" rx="1" fill="#92400e" />
        <rect v-if="variant === 'clean'" x="210" y="145" width="4" height="4" rx="1" fill="#22c55e" />
        <rect v-if="variant === 'clean'" x="216" y="144" width="4" height="5" rx="1" fill="#16a34a" />
      </g>

      <!-- Building 5: Edificio naranja -->
      <g>
        <rect x="260" y="90" width="50" height="110" :fill="variant === 'clean' ? '#fdba74' : '#d0a878'" />
        <rect x="260" y="90" width="50" height="5" :fill="variant === 'clean' ? '#f97316' : '#b08050'" />
        <rect x="260" y="195" width="50" height="5" fill="#a8a29e" />
        <!-- Windows -->
        <rect x="268" y="102" width="10" height="11" rx="1" :fill="windowFill(6)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="292" y="102" width="10" height="11" rx="1" :fill="windowFill(2)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="268" y="125" width="10" height="11" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="292" y="125" width="10" height="11" rx="1" :fill="windowFill(8)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="268" y="150" width="10" height="11" rx="1" :fill="windowFill(3)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="292" y="150" width="10" height="11" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Shop -->
        <rect x="270" y="170" width="30" height="22" rx="1" fill="#7c2d12" opacity="0.7" />
        <rect x="272" y="172" width="26" height="14" rx="1" :fill="variant === 'clean' ? '#fed7aa' : '#c0a878'" />
      </g>

      <!-- Building 6: Casa pequeña morada -->
      <g>
        <rect x="315" y="115" width="45" height="85" :fill="variant === 'clean' ? '#d8b4fe' : '#b8a0c8'" />
        <polygon points="315,115 337,90 360,115" :fill="variant === 'clean' ? '#a855f7' : '#8868a8'" />
        <rect x="315" y="195" width="45" height="5" fill="#a8a29e" />
        <rect x="325" y="130" width="10" height="12" rx="1" :fill="windowFill(5)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="345" y="130" width="10" height="12" rx="1" :fill="windowFill(1)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="330" y="160" width="14" height="30" rx="2" fill="#581c87" opacity="0.6" />
        <circle cx="341" cy="177" r="1" fill="#D4A843" />
      </g>

      <!-- Sidewalk line -->
      <rect x="0" y="195" width="400" height="5" :fill="variant === 'dirty' ? '#b8b5b0' : variant === 'clean' ? '#e7e5e4' : '#d6d3d1'" />

      <!-- Sidewalk details -->
      <line v-for="i in 15" :key="'sw'+i" :x1="i*28" y1="195" :x2="i*28" y2="200" stroke="rgba(0,0,0,0.06)" stroke-width="0.5" />

      <!-- Trees (clean) -->
      <g v-if="variant === 'clean'">
        <rect x="73" y="170" width="4" height="25" fill="#92400e" rx="1" />
        <ellipse cx="75" cy="162" rx="16" ry="14" fill="#22c55e" />
        <ellipse cx="72" cy="158" rx="10" ry="10" fill="#4ade80" />

        <rect x="197" y="172" width="4" height="23" fill="#92400e" rx="1" />
        <ellipse cx="199" cy="164" rx="14" ry="12" fill="#16a34a" />
        <ellipse cx="196" cy="160" rx="9" ry="9" fill="#22c55e" />

        <rect x="313" y="175" width="3" height="20" fill="#92400e" rx="1" />
        <ellipse cx="314" cy="168" rx="12" ry="10" fill="#15803d" />
        <ellipse cx="312" cy="165" rx="7" ry="8" fill="#22c55e" />
      </g>

      <!-- Trash / dirt (dirty) -->
      <g v-if="variant === 'dirty'" opacity="0.6">
        <text x="30" y="192" font-size="8">🛍️</text>
        <text x="160" y="194" font-size="6">📄</text>
        <text x="250" y="190" font-size="7">🥤</text>
        <text x="330" y="193" font-size="5">📦</text>
      </g>

      <!-- Lamp posts -->
      <g>
        <rect x="68" y="160" width="2" height="35" fill="#6b7280" rx="0.5" />
        <rect x="64" y="157" width="10" height="4" rx="2" fill="#9ca3af" />
        <ellipse v-if="variant !== 'dirty'" cx="69" cy="157" rx="8" ry="6" fill="rgba(254,240,138,0.15)" />

        <rect x="258" y="165" width="2" height="30" fill="#6b7280" rx="0.5" />
        <rect x="254" y="162" width="10" height="4" rx="2" fill="#9ca3af" />
        <ellipse v-if="variant !== 'dirty'" cx="259" cy="162" rx="8" ry="6" fill="rgba(254,240,138,0.15)" />
      </g>
    </svg>

    <!-- Road -->
    <div class="road">
      <div class="road__surface" />
      <div class="road__line" />
      <div v-if="variant === 'dirty'" class="road__cracks">
        <span v-for="i in 3" :key="i" class="road__crack" :style="{ left: (20 + i * 25) + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'dirty' | 'normal' | 'clean'
}>(), {
  variant: 'normal',
})

const windowStroke = 'rgba(0,0,0,0.12)'

const yellowWindows = [
  { x: 83, y: 98 }, { x: 100, y: 98 }, { x: 117, y: 98 },
  { x: 83, y: 118 }, { x: 100, y: 118 }, { x: 117, y: 118 },
  { x: 83, y: 140 }, { x: 100, y: 140 }, { x: 117, y: 140 },
]

const blueWindows = [
  { x: 142, y: 66 }, { x: 158, y: 66 }, { x: 175, y: 66 },
  { x: 142, y: 86 }, { x: 158, y: 86 }, { x: 175, y: 86 },
  { x: 142, y: 106 }, { x: 158, y: 106 }, { x: 175, y: 106 },
  { x: 142, y: 126 }, { x: 158, y: 126 }, { x: 175, y: 126 },
  { x: 142, y: 148 }, { x: 158, y: 148 }, { x: 175, y: 148 },
]

// Some windows are lit (warm glow), others are dark or reflective
function windowFill(index: number): string {
  const litWindows = [1, 3, 5, 7, 8]
  if (litWindows.includes(index % 10)) {
    return '#fef9c3' // warm lit yellow
  }
  if (props.variant === 'clean') return '#bfdbfe' // nice sky reflection
  return '#dbeafe' // default glass
}
</script>

<style scoped>
.street {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  z-index: 1;
}

.buildings-svg {
  position: absolute;
  bottom: 8%;
  left: 0;
  width: 100%;
  height: 92%;
}

.road {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8%;
  z-index: 2;
}

.road__surface {
  position: absolute;
  inset: 0;
  background: #57534e;
}

.street--clean .road__surface { background: #78716c; }
.street--dirty .road__surface { background: #44403c; }

.road__line {
  position: absolute;
  top: 45%;
  left: 5%;
  right: 5%;
  height: 2px;
  background: repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 20px, transparent 20px, transparent 35px);
  opacity: 0.5;
}

.road__cracks {
  position: absolute;
  inset: 0;
}

.road__crack {
  position: absolute;
  top: 30%;
  width: 15px;
  height: 2px;
  background: #292524;
  border-radius: 1px;
  transform: rotate(-20deg);
}
</style>
