<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content" :class="`modal-content--${size}`">
          <button v-if="closable" class="modal-close" @click="$emit('close')">
            <span>✕</span>
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  show: boolean
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
}>(), {
  size: 'md',
  closable: true,
})

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255,255,255,0.6);
  padding: 28px;
  position: relative;
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content--sm { width: 320px; }
.modal-content--md { width: 460px; }
.modal-content--lg { width: 620px; }

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(0,0,0,0.06);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: rgba(0,0,0,0.12);
  transform: scale(1.1);
}

.modal-close:active {
  transform: scale(0.9);
}

.modal-enter-active {
  transition: opacity 300ms var(--ease-out);
}
.modal-enter-active .modal-content {
  transition: transform 400ms var(--ease-spring), opacity 300ms var(--ease-out);
}
.modal-leave-active {
  transition: opacity 200ms ease;
}
.modal-leave-active .modal-content {
  transition: transform 200ms ease, opacity 200ms ease;
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content { transform: scale(0.85) translateY(20px); opacity: 0; }
.modal-leave-to .modal-content { transform: scale(0.9); opacity: 0; }
</style>
