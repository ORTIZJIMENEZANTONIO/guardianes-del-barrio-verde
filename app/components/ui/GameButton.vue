<template>
  <button
    class="game-btn"
    :class="[`game-btn--${variant}`, `game-btn--${size}`, { 'game-btn--disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="game-btn__bg" />
    <span class="game-btn__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.game-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-family: var(--font-main);
  font-weight: 800;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
  transition:
    transform 300ms var(--ease-spring),
    box-shadow 300ms var(--ease-out),
    filter 200ms ease;
}

/* Shimmer overlay */
.game-btn__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255,255,255,0.3) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  transition: opacity 300ms ease;
}

.game-btn:hover:not(.game-btn--disabled) .game-btn__bg {
  opacity: 1;
  animation: shimmer 1.5s ease infinite;
}

.game-btn__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== HOVER / ACTIVE STATES ===== */
.game-btn:hover:not(.game-btn--disabled) {
  transform: translateY(-3px) scale(1.03);
}

.game-btn:active:not(.game-btn--disabled) {
  transform: translateY(1px) scale(0.97);
  transition-duration: 100ms;
}

/* ===== PRIMARY ===== */
.game-btn--primary {
  background: linear-gradient(145deg, #34d399, #059669, #047857);
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  box-shadow:
    0 4px 0 #065f46,
    0 6px 20px rgba(5, 150, 105, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.game-btn--primary:hover:not(.game-btn--disabled) {
  box-shadow:
    0 6px 0 #065f46,
    0 10px 30px rgba(5, 150, 105, 0.4),
    0 0 20px rgba(52, 211, 153, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.game-btn--primary:active:not(.game-btn--disabled) {
  box-shadow:
    0 2px 0 #065f46,
    0 3px 10px rgba(5, 150, 105, 0.2),
    inset 0 2px 4px rgba(0,0,0,0.15);
}

/* ===== SECONDARY ===== */
.game-btn--secondary {
  background: linear-gradient(145deg, #fcd34d, #f59e0b, #d97706);
  color: #1a1a1a;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
  box-shadow:
    0 4px 0 #b45309,
    0 6px 20px rgba(245, 158, 11, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.game-btn--secondary:hover:not(.game-btn--disabled) {
  box-shadow:
    0 6px 0 #b45309,
    0 10px 30px rgba(245, 158, 11, 0.4),
    0 0 20px rgba(252, 211, 77, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.4);
}

.game-btn--secondary:active:not(.game-btn--disabled) {
  box-shadow:
    0 2px 0 #b45309,
    0 3px 10px rgba(245, 158, 11, 0.2),
    inset 0 2px 4px rgba(0,0,0,0.1);
}

/* ===== DANGER ===== */
.game-btn--danger {
  background: linear-gradient(145deg, #f87171, #ef4444, #dc2626);
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  box-shadow:
    0 4px 0 #991b1b,
    0 6px 20px rgba(239, 68, 68, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.game-btn--danger:hover:not(.game-btn--disabled) {
  box-shadow:
    0 6px 0 #991b1b,
    0 10px 30px rgba(239, 68, 68, 0.4),
    0 0 20px rgba(248, 113, 113, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.game-btn--danger:active:not(.game-btn--disabled) {
  box-shadow:
    0 2px 0 #991b1b,
    0 3px 10px rgba(239, 68, 68, 0.2),
    inset 0 2px 4px rgba(0,0,0,0.15);
}

/* ===== GHOST ===== */
.game-btn--ghost {
  background: rgba(255,255,255,0.15);
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid rgba(255,255,255,0.3);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.game-btn--ghost:hover:not(.game-btn--disabled) {
  background: rgba(255,255,255,0.28);
  border-color: rgba(255,255,255,0.5);
  box-shadow:
    0 4px 20px rgba(0,0,0,0.15),
    0 0 15px rgba(255,255,255,0.1);
}

.game-btn--ghost:active:not(.game-btn--disabled) {
  background: rgba(255,255,255,0.35);
  transform: translateY(1px) scale(0.97);
}

/* ===== SIZES ===== */
.game-btn--sm {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: var(--radius-sm);
}
.game-btn--md {
  padding: 14px 28px;
  font-size: 16px;
  border-radius: var(--radius-md);
}
.game-btn--lg {
  padding: 18px 40px;
  font-size: 20px;
  border-radius: var(--radius-lg);
  letter-spacing: 0.03em;
}

/* ===== DISABLED ===== */
.game-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(0.3);
}

/* Touch devices: show active instead of hover */
@media (hover: none) {
  .game-btn:hover:not(.game-btn--disabled) {
    transform: none;
    box-shadow: inherit;
  }
  .game-btn:hover:not(.game-btn--disabled) .game-btn__bg {
    opacity: 0;
    animation: none;
  }
}
</style>
