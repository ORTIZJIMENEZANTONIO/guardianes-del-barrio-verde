<template>
  <div class="progress-bar" :class="{ 'progress-bar--animated': animated }">
    <div
      class="progress-bar__fill"
      :style="{
        width: `${percentage}%`,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
      }"
    />
    <span v-if="showLabel" class="progress-bar__label">{{ percentage }}%</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  max: number
  color?: string
  showLabel?: boolean
  animated?: boolean
}>(), {
  color: 'var(--color-green-light)',
  showLabel: false,
  animated: true,
})

const percentage = computed(() => Math.min(100, Math.round((props.value / props.max) * 100)))
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 14px;
  background: rgba(0,0,0,0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.progress-bar__fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 600ms var(--ease-out);
  box-shadow: 0 0 8px var(--color-green-glow);
}

.progress-bar--animated .progress-bar__fill {
  background-image: linear-gradient(
    110deg,
    rgba(255,255,255,0) 30%,
    rgba(255,255,255,0.3) 50%,
    rgba(255,255,255,0) 70%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease infinite;
}

.progress-bar__label {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 800;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
</style>
