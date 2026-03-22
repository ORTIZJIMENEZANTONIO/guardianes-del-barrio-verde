<template>
  <NuxtPage />

  <!-- Secret gesture: 4 invisible corner zones, 3 taps each within 6s → /admin -->
  <div class="secret-zone secret-zone--tl" @pointerdown.prevent="handleTap" />
  <div class="secret-zone secret-zone--tr" @pointerdown.prevent="handleTap" />
  <div class="secret-zone secret-zone--bl" @pointerdown.prevent="handleTap" />
  <div class="secret-zone secret-zone--br" @pointerdown.prevent="handleTap" />
</template>

<script setup lang="ts">
import { useSecretAccess } from '~/composables/useSecretAccess'

const router = useRouter()
const route = useRoute()
const { triggered, handleTap } = useSecretAccess()

watch(triggered, (val) => {
  if (val && route.path !== '/admin') {
    triggered.value = false
    router.push('/admin')
  }
})
</script>

<style scoped>
.secret-zone {
  position: fixed;
  width: 80px;
  height: 80px;
  z-index: 99999;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.secret-zone--tl { top: 0; left: 0; }
.secret-zone--tr { top: 0; right: 0; }
.secret-zone--bl { bottom: 0; left: 0; }
.secret-zone--br { bottom: 0; right: 0; }
</style>
