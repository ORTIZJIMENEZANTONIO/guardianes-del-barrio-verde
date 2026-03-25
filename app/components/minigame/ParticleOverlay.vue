<template>
  <div v-if="preset !== 'none'" class="particle-overlay">
    <span
      v-for="p in activeParticles"
      :key="p.id"
      class="particle"
      :style="p.style"
    >{{ p.emoji }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * Ambient particle overlay using DOM elements + CSS animations.
 * Simpler and more reliable than canvas across all devices.
 *
 * Presets: heat, nature, water, sparkle, celebration
 */

export type ParticlePreset = 'heat' | 'nature' | 'water' | 'sparkle' | 'celebration' | 'none'

const props = withDefaults(defineProps<{
  preset: ParticlePreset
  intensity?: number
  progress?: number
}>(), {
  intensity: 0.5,
  progress: 0,
})

interface ActiveParticle {
  id: number
  emoji: string
  style: Record<string, string>
}

const PRESETS: Record<ParticlePreset, {
  emojis: string[]
  interval: number // ms between spawns
  durationRange: [number, number] // animation duration in seconds
  direction: 'up' | 'down' | 'float' | 'radial'
  sizeRange: [number, number] // font-size in px
  opacityRange: [number, number]
}> = {
  heat: {
    emojis: ['🔸', '🔹', '✦', '◦', '•'],
    interval: 400,
    durationRange: [3, 6],
    direction: 'up',
    sizeRange: [8, 16],
    opacityRange: [0.15, 0.35],
  },
  nature: {
    emojis: ['🍃', '🌿', '🍀', '🌱', '☘️'],
    interval: 800,
    durationRange: [5, 10],
    direction: 'float',
    sizeRange: [12, 20],
    opacityRange: [0.3, 0.6],
  },
  water: {
    emojis: ['💧', '🫧', '💦', '·', '•'],
    interval: 300,
    durationRange: [2, 4],
    direction: 'down',
    sizeRange: [8, 16],
    opacityRange: [0.2, 0.45],
  },
  sparkle: {
    emojis: ['✨', '⭐', '💫', '·', '✦'],
    interval: 600,
    durationRange: [2, 5],
    direction: 'radial',
    sizeRange: [10, 18],
    opacityRange: [0.25, 0.5],
  },
  celebration: {
    emojis: ['⭐', '✨', '🌟', '💚', '🎉', '🌸'],
    interval: 200,
    durationRange: [2, 4],
    direction: 'radial',
    sizeRange: [14, 22],
    opacityRange: [0.4, 0.7],
  },
  none: {
    emojis: [],
    interval: 99999,
    durationRange: [1, 1],
    direction: 'up',
    sizeRange: [10, 10],
    opacityRange: [0, 0],
  },
}

const activeParticles = ref<ActiveParticle[]>([])
let nextId = 0
let spawnTimer: ReturnType<typeof setInterval> | null = null

function rand(min: number, max: number) { return min + Math.random() * (max - min) }

function spawnParticle() {
  const cfg = PRESETS[props.preset]
  if (!cfg || cfg.emojis.length === 0) return

  // For heat preset, reduce spawning as progress increases
  const effectiveChance = props.preset === 'heat'
    ? 1 - props.progress * 0.8
    : props.preset === 'celebration'
      ? props.progress
      : 1

  if (Math.random() > effectiveChance * props.intensity * 2) return

  const emoji = cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)] ?? '✨'
  const duration = rand(cfg.durationRange[0], cfg.durationRange[1])
  const size = rand(cfg.sizeRange[0], cfg.sizeRange[1])
  const opacity = rand(cfg.opacityRange[0], cfg.opacityRange[1])
  const startX = rand(5, 95) // % from left
  const id = nextId++

  let animName = ''
  let startY = ''

  switch (cfg.direction) {
    case 'up':
      animName = 'particleUp'
      startY = '100%'
      break
    case 'down':
      animName = 'particleDown'
      startY = '-5%'
      break
    case 'float':
      animName = 'particleFloat'
      startY = rand(20, 80) + '%'
      break
    case 'radial':
      animName = 'particleRadial'
      startY = rand(30, 70) + '%'
      break
  }

  // For radial, set random direction via CSS custom properties
  const dx = cfg.direction === 'radial' ? (rand(-80, 80)) + 'px' : '0'
  const dy = cfg.direction === 'radial' ? (rand(-100, -30)) + 'px' : '0'

  const particle: ActiveParticle = {
    id,
    emoji,
    style: {
      left: startX + '%',
      top: startY,
      fontSize: size + 'px',
      '--particle-opacity': String(opacity),
      '--dx': dx,
      '--dy': dy,
      animationName: animName,
      animationDuration: duration + 's',
      animationTimingFunction: 'ease-in-out',
      animationFillMode: 'forwards',
    } as any,
  }

  activeParticles.value.push(particle)

  // Remove after animation completes
  setTimeout(() => {
    activeParticles.value = activeParticles.value.filter(p => p.id !== id)
  }, duration * 1000 + 100)
}

function startSpawning() {
  stopSpawning()
  const cfg = PRESETS[props.preset]
  if (!cfg) return
  spawnTimer = setInterval(spawnParticle, cfg.interval)
  // Spawn a few immediately
  for (let i = 0; i < 3; i++) spawnParticle()
}

function stopSpawning() {
  if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null }
}

watch(() => props.preset, (val) => {
  activeParticles.value = []
  if (val !== 'none') startSpawning()
  else stopSpawning()
})

onMounted(() => {
  if (props.preset !== 'none') startSpawning()
})

onUnmounted(() => {
  stopSpawning()
  activeParticles.value = []
})
</script>

<style scoped>
/* Absolute overlay inside .minigame-area.
   Rendered last in DOM so it paints above backgrounds.
   pointer-events:none so all game items stay interactive. */
.particle-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  pointer-events: none;
  will-change: transform, opacity;
  opacity: 0;
}

/* Heat: rise slowly with gentle sway */
@keyframes particleUp {
  0%   { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
  10%  { opacity: 0.25; }
  20%  { transform: translateY(-15vh) translateX(8px) scale(0.8); opacity: 0.3; }
  50%  { transform: translateY(-45vh) translateX(-6px) scale(1); opacity: 0.25; }
  80%  { transform: translateY(-75vh) translateX(10px) scale(0.8); opacity: 0.15; }
  100% { transform: translateY(-105vh) translateX(-4px) scale(0.4); opacity: 0; }
}

/* Water: fall with slight drift — smooth rain effect */
@keyframes particleDown {
  0%   { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; }
  8%   { opacity: 0.15; }
  20%  { transform: translateY(15vh) translateX(4px) scale(0.9); opacity: 0.35; }
  50%  { transform: translateY(45vh) translateX(-6px) scale(1); opacity: 0.3; }
  80%  { transform: translateY(80vh) translateX(8px) scale(0.9); opacity: 0.15; }
  100% { transform: translateY(110vh) translateX(3px) scale(0.7); opacity: 0; }
}

/* Nature: gentle leaf drift across screen with sway + rotation */
@keyframes particleFloat {
  0%   { transform: translateX(-5vw) translateY(0) rotate(0deg) scale(0.6); opacity: 0; }
  5%   { opacity: 0.15; }
  15%  { transform: translateX(10vw) translateY(15px) rotate(30deg) scale(0.9); opacity: 0.4; }
  30%  { transform: translateX(25vw) translateY(-10px) rotate(70deg) scale(1); }
  50%  { transform: translateX(45vw) translateY(20px) rotate(120deg) scale(0.95); opacity: 0.45; }
  70%  { transform: translateX(65vw) translateY(-5px) rotate(200deg) scale(1); }
  85%  { transform: translateX(80vw) translateY(15px) rotate(260deg) scale(0.9); opacity: 0.3; }
  95%  { opacity: 0.1; }
  100% { transform: translateX(105vw) translateY(8px) rotate(340deg) scale(0.7); opacity: 0; }
}

/* Sparkle: gentle float upward with twinkle pulse */
@keyframes particleRadial {
  0%   { transform: translate(0, 0) scale(0); opacity: 0; }
  10%  { opacity: 0.2; transform: scale(0.8); }
  25%  { opacity: 0.45; transform: translate(calc(var(--dx) * 0.25), calc(var(--dy) * 0.25)) scale(1); }
  45%  { opacity: 0.2; transform: translate(calc(var(--dx) * 0.5), calc(var(--dy) * 0.5)) scale(0.7); }
  65%  { opacity: 0.4; transform: translate(calc(var(--dx) * 0.7), calc(var(--dy) * 0.7)) scale(0.9); }
  85%  { opacity: 0.15; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0.3); opacity: 0; }
}
</style>
