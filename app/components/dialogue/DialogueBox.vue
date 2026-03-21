<template>
  <div class="dialogue-box" @click="handleTap">
    <div class="dialogue-box__speaker" :style="{ color: speakerColor }">
      {{ speakerName }}
    </div>
    <p class="dialogue-box__text">
      {{ displayedText }}<span v-if="isTyping" class="dialogue-box__cursor">|</span>
    </p>
    <div v-if="!isTyping && !hasChoices" class="dialogue-box__continue">
      <span class="continue-dot" />
      Toca para continuar
    </div>
  </div>
</template>

<script setup lang="ts">
import { characters } from '~/data/characters'

const props = defineProps<{
  speaker: string
  text: string
  isTyping: boolean
  hasChoices: boolean
}>()

const emit = defineEmits<{
  advance: []
  skipTyping: []
}>()

const character = computed(() => characters[props.speaker])
const speakerName = computed(() => character.value?.name ?? props.speaker)
const speakerColor = computed(() => character.value?.color ?? '#333')

const displayedText = ref('')
let typingTimer: ReturnType<typeof setTimeout> | null = null
const charIndex = ref(0)

function startTypewriter() {
  displayedText.value = ''
  charIndex.value = 0
  typeNextChar()
}

function typeNextChar() {
  if (charIndex.value < props.text.length) {
    displayedText.value += props.text[charIndex.value]
    charIndex.value++
    typingTimer = setTimeout(typeNextChar, 30)
  } else {
    emit('skipTyping')
  }
}

function skipTypewriter() {
  if (typingTimer) clearTimeout(typingTimer)
  displayedText.value = props.text
  emit('skipTyping')
}

function handleTap() {
  if (props.isTyping) {
    skipTypewriter()
  } else if (!props.hasChoices) {
    emit('advance')
  }
}

watch(() => props.text, () => {
  if (typingTimer) clearTimeout(typingTimer)
  startTypewriter()
}, { immediate: true })

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
})
</script>

<style scoped>
.dialogue-box {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.5);
  padding: 18px 22px;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  min-height: 80px;
  transition: transform 200ms var(--ease-spring);
}

.dialogue-box:active {
  transform: scale(0.985);
}

.dialogue-box__speaker {
  display: none; /* name is shown in DialogueScene name tag instead */
}

.dialogue-box__text {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-text);
  font-weight: 600;
}

.dialogue-box__cursor {
  animation: blink 0.5s step-end infinite;
  color: var(--color-green-mid);
  font-weight: 800;
}

.dialogue-box__continue {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  justify-content: flex-end;
  margin-top: 10px;
  opacity: 0.5;
  animation: pulse 1.5s ease-in-out infinite;
}

.continue-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-green-mid);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
