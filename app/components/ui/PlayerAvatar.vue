<template>
  <svg :width="size" :height="size" viewBox="0 0 40 40" class="player-avatar">
    <!-- Face circle -->
    <circle cx="20" cy="22" r="14" :fill="skinColors[playerStore.avatarSkin]" />
    <!-- Eyes -->
    <circle cx="15" cy="21" r="1.5" fill="#1a0e05" />
    <circle cx="25" cy="21" r="1.5" fill="#1a0e05" />
    <!-- Smile -->
    <path d="M16 26 Q20 29 24 26" fill="none" stroke="#8b4513" stroke-width="1.2" stroke-linecap="round" />
    <!-- Hair (varies by style) -->
    <template v-if="playerStore.avatarHair === 0">
      <!-- Short spiky -->
      <path d="M8 18 Q12 6 20 8 Q28 6 32 18" :fill="hairColors[0]" />
    </template>
    <template v-else-if="playerStore.avatarHair === 1">
      <!-- Long straight -->
      <ellipse cx="20" cy="14" rx="14" ry="10" :fill="hairColors[1]" />
      <rect x="7" y="14" width="6" height="16" rx="3" :fill="hairColors[1]" />
      <rect x="27" y="14" width="6" height="16" rx="3" :fill="hairColors[1]" />
    </template>
    <template v-else-if="playerStore.avatarHair === 2">
      <!-- Curly -->
      <circle cx="12" cy="12" r="6" :fill="hairColors[2]" />
      <circle cx="20" cy="10" r="6" :fill="hairColors[2]" />
      <circle cx="28" cy="12" r="6" :fill="hairColors[2]" />
    </template>
    <template v-else>
      <!-- Ponytail -->
      <ellipse cx="20" cy="13" rx="13" ry="9" :fill="hairColors[3]" />
      <rect x="28" y="10" width="5" height="14" rx="2.5" :fill="hairColors[3]" />
    </template>
    <!-- Accessory -->
    <template v-if="playerStore.avatarAccessory === 0">
      <!-- Cap -->
      <rect x="6" y="8" width="28" height="5" rx="2" fill="#ef4444" />
      <rect x="4" y="12" width="16" height="3" rx="1" fill="#ef4444" />
    </template>
    <template v-else-if="playerStore.avatarAccessory === 1">
      <!-- Glasses -->
      <circle cx="15" cy="21" r="4" fill="none" stroke="#374151" stroke-width="1.5" />
      <circle cx="25" cy="21" r="4" fill="none" stroke="#374151" stroke-width="1.5" />
      <line x1="19" y1="21" x2="21" y2="21" stroke="#374151" stroke-width="1.5" />
    </template>
    <template v-else-if="playerStore.avatarAccessory === 2">
      <!-- Bow -->
      <path d="M26 8 Q30 4 32 8 Q30 12 26 8" fill="#ec4899" />
      <path d="M26 8 Q22 4 20 8 Q22 12 26 8" fill="#f472b6" />
      <circle cx="26" cy="8" r="1.5" fill="#be185d" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores/usePlayerStore'

withDefaults(defineProps<{ size?: number }>(), { size: 40 })

const playerStore = usePlayerStore()

const skinColors = ['#c68642', '#f0c8a0', '#8d5524']
const hairColors = ['#2d1810', '#5c3a1e', '#8b4513', '#1a1a2e']
</script>

<style scoped>
.player-avatar {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
}
</style>
