<template>
  <div class="sky" :class="`sky--${variant}`">
    <!-- Sky gradient base -->
    <div class="sky__gradient" />

    <!-- Sun -->
    <div v-if="variant !== 'sunset'" class="sun" :class="`sun--${variant}`">
      <div class="sun__body" />
      <div class="sun__rays">
        <span v-for="i in 8" :key="i" class="sun__ray" :style="{ transform: `rotate(${i * 45}deg)` }" />
      </div>
      <div v-if="variant === 'hot'" class="sun__heat-ring" />
    </div>

    <!-- Sunset sun (bigger, lower) -->
    <div v-if="variant === 'sunset'" class="sunset-sun">
      <div class="sunset-sun__body" />
      <div class="sunset-sun__glow" />
    </div>

    <!-- Clouds -->
    <svg v-for="cloud in clouds" :key="cloud.id" class="cloud" :style="cloud.style" :viewBox="cloud.viewBox" xmlns="http://www.w3.org/2000/svg">
      <g :opacity="cloud.opacity">
        <ellipse :cx="cloud.cx1" :cy="cloud.cy" :rx="cloud.rx1" :ry="cloud.ry1" :fill="cloudColor" />
        <ellipse :cx="cloud.cx2" :cy="cloud.cy - 6" :rx="cloud.rx2" :ry="cloud.ry2" :fill="cloudColor" />
        <ellipse :cx="cloud.cx3" :cy="cloud.cy + 2" :rx="cloud.rx3" :ry="cloud.ry1" :fill="cloudColor" />
        <ellipse :cx="cloud.cx2" :cy="cloud.cy + 4" :rx="cloud.rx1 + 8" :ry="cloud.ry1 - 2" :fill="cloudColorDark" />
      </g>
    </svg>

    <!-- Birds -->
    <div v-if="variant === 'nice' || variant === 'sunset'" class="birds">
      <svg v-for="bird in birds" :key="bird.id" class="bird" :style="bird.style" viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6 Q6 0 12 6 Q18 0 24 6" fill="none" :stroke="variant === 'sunset' ? '#1e1b4b' : '#374151'" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Stars (sunset only) -->
    <template v-if="variant === 'sunset'">
      <div v-for="star in stars" :key="star.id" class="star" :style="star.style">✦</div>
    </template>

    <!-- Heat shimmer (hot only) -->
    <div v-if="variant === 'hot'" class="heat-shimmer">
      <div class="heat-line" v-for="i in 5" :key="i" :style="{ left: (i * 20) + '%', animationDelay: (i * 0.4) + 's' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'hot' | 'nice' | 'sunset'
}>(), {
  variant: 'nice',
})

const cloudColor = computed(() => {
  if (props.variant === 'hot') return 'rgba(255,255,255,0.7)'
  if (props.variant === 'sunset') return 'rgba(255,200,150,0.5)'
  return 'rgba(255,255,255,0.9)'
})

const cloudColorDark = computed(() => {
  if (props.variant === 'hot') return 'rgba(255,240,220,0.4)'
  if (props.variant === 'sunset') return 'rgba(200,130,100,0.3)'
  return 'rgba(230,240,250,0.6)'
})

interface CloudData {
  id: number
  style: Record<string, string>
  viewBox: string
  opacity: number
  cx1: number; cx2: number; cx3: number
  cy: number
  rx1: number; rx2: number; rx3: number
  ry1: number; ry2: number
}

const clouds = computed<CloudData[]>(() => [
  {
    id: 1,
    style: { top: '8%', width: '140px', animationDuration: '35s', animationDelay: '0s' },
    viewBox: '0 0 100 40', opacity: 0.9,
    cx1: 30, cx2: 50, cx3: 70, cy: 24,
    rx1: 22, rx2: 18, rx3: 20, ry1: 12, ry2: 14,
  },
  {
    id: 2,
    style: { top: '18%', width: '110px', animationDuration: '45s', animationDelay: '-15s' },
    viewBox: '0 0 80 35', opacity: 0.7,
    cx1: 25, cx2: 40, cx3: 58, cy: 22,
    rx1: 18, rx2: 15, rx3: 16, ry1: 10, ry2: 12,
  },
  {
    id: 3,
    style: { top: '5%', width: '170px', animationDuration: '55s', animationDelay: '-30s' },
    viewBox: '0 0 120 45', opacity: 0.6,
    cx1: 35, cx2: 60, cx3: 88, cy: 28,
    rx1: 26, rx2: 22, rx3: 24, ry1: 14, ry2: 16,
  },
  {
    id: 4,
    style: { top: '25%', width: '90px', animationDuration: '40s', animationDelay: '-8s' },
    viewBox: '0 0 70 30', opacity: 0.5,
    cx1: 20, cx2: 35, cx3: 50, cy: 18,
    rx1: 15, rx2: 13, rx3: 14, ry1: 9, ry2: 11,
  },
])

interface BirdData { id: number; style: Record<string, string> }
const birds = computed<BirdData[]>(() => [
  { id: 1, style: { top: '12%', animationDuration: '12s', animationDelay: '0s', width: '18px' } },
  { id: 2, style: { top: '8%', animationDuration: '15s', animationDelay: '-4s', width: '14px' } },
  { id: 3, style: { top: '20%', animationDuration: '18s', animationDelay: '-9s', width: '12px' } },
])

interface StarData { id: number; style: Record<string, string> }
const stars: StarData[] = [
  { id: 1, style: { top: '5%', left: '15%', fontSize: '8px', animationDelay: '0s' } },
  { id: 2, style: { top: '10%', left: '35%', fontSize: '6px', animationDelay: '1s' } },
  { id: 3, style: { top: '3%', left: '60%', fontSize: '10px', animationDelay: '0.5s' } },
  { id: 4, style: { top: '15%', left: '80%', fontSize: '7px', animationDelay: '1.5s' } },
  { id: 5, style: { top: '8%', left: '50%', fontSize: '5px', animationDelay: '2s' } },
]
</script>

<style scoped>
.sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

/* === GRADIENTS === */
.sky--hot .sky__gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.4) 0%, transparent 50%),
    linear-gradient(180deg,
      #f97316 0%,
      #fb923c 15%,
      #fbbf24 30%,
      #fde68a 50%,
      #fef3c7 70%,
      #e8d5b7 85%,
      #d4cbb8 100%
    );
}

.sky--nice .sky__gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 75% 15%, rgba(253,224,71,0.2) 0%, transparent 40%),
    linear-gradient(180deg,
      #0284c7 0%,
      #0ea5e9 12%,
      #38bdf8 25%,
      #7dd3fc 40%,
      #bae6fd 55%,
      #e0f2fe 70%,
      #d8f3dc 85%,
      #a8e6c3 100%
    );
}

.sky--sunset .sky__gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 70%, rgba(251,146,60,0.5) 0%, transparent 50%),
    linear-gradient(180deg,
      #1e1b4b 0%,
      #312e81 10%,
      #4338ca 20%,
      #6366f1 30%,
      #a78bfa 40%,
      #c084fc 48%,
      #f472b6 56%,
      #fb7185 64%,
      #fb923c 75%,
      #fbbf24 88%,
      #fde68a 100%
    );
}

/* === SUN === */
.sun {
  position: absolute;
  z-index: 1;
}

.sun--nice {
  top: 6%;
  right: 12%;
}

.sun--hot {
  top: 4%;
  right: 10%;
}

.sun__body {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle, #fef08a 30%, #fbbf24 70%, #f59e0b 100%);
  box-shadow: 0 0 30px rgba(251,191,36,0.6), 0 0 60px rgba(251,191,36,0.3);
  position: relative;
  z-index: 2;
}

.sun--hot .sun__body {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, #fff 20%, #fef08a 40%, #f97316 90%);
  box-shadow: 0 0 40px rgba(249,115,22,0.7), 0 0 80px rgba(249,115,22,0.3);
}

.sun__rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  animation: spin 30s linear infinite;
}

.sun__ray {
  position: absolute;
  width: 3px;
  height: 18px;
  background: linear-gradient(180deg, rgba(251,191,36,0.6), transparent);
  border-radius: 2px;
  top: -40px;
  left: -1.5px;
  transform-origin: 1.5px 41px;
}

.sun--hot .sun__ray {
  height: 24px;
  top: -50px;
  background: linear-gradient(180deg, rgba(249,115,22,0.5), transparent);
  transform-origin: 1.5px 51px;
}

.sun__heat-ring {
  position: absolute;
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  border: 2px solid rgba(249,115,22,0.2);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

/* === SUNSET SUN === */
.sunset-sun {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.sunset-sun__body {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 10%, #fef08a 30%, #fb923c 70%, #ef4444 100%);
}

.sunset-sun__glow {
  position: absolute;
  top: -30px;
  left: -30px;
  right: -30px;
  bottom: -30px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251,146,60,0.4) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

/* === CLOUDS === */
.cloud {
  position: absolute;
  animation: cloudFloat linear infinite;
  z-index: 2;
  left: -20%;
}

@keyframes cloudFloat {
  0% { transform: translateX(-20%); }
  100% { transform: translateX(calc(100vw + 20%)); }
}

/* === BIRDS === */
.birds { position: absolute; inset: 0; z-index: 3; }

.bird {
  position: absolute;
  animation: birdFly linear infinite;
  left: -10%;
}

@keyframes birdFly {
  0% { transform: translateX(-10vw) translateY(0); }
  25% { transform: translateX(25vw) translateY(-8px); }
  50% { transform: translateX(50vw) translateY(3px); }
  75% { transform: translateX(75vw) translateY(-5px); }
  100% { transform: translateX(110vw) translateY(0); }
}

/* === STARS === */
.star {
  position: absolute;
  color: rgba(255,255,255,0.8);
  animation: twinkle 2s ease-in-out infinite;
  z-index: 3;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* === HEAT SHIMMER === */
.heat-shimmer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.heat-line {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(249,115,22,0.08), transparent);
  animation: heatRise 3s ease-in-out infinite;
}

@keyframes heatRise {
  0%, 100% { transform: translateY(0) scaleX(1); opacity: 0; }
  50% { transform: translateY(-20px) scaleX(3); opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
