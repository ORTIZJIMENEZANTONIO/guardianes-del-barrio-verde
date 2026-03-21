<template>
  <Transition name="dialogue-enter">
    <div v-if="dialogueStore.isDialogueActive" class="dialogue-scene">
      <!-- Subtle scrim at bottom to make text readable -->
      <div class="dialogue-scene__scrim" />

      <!-- Character standing to the left, overlapping the dialogue box -->
      <div
        class="dialogue-scene__character"
        :class="{
          'character--speaking': dialogueStore.isTyping,
          'character--entering': isEntering,
        }"
        :key="currentLine?.speaker"
      >
        <CharacterBody
          v-if="currentLine"
          :character-id="currentLine.speaker"
          :emotion="currentLine.emotion"
          :is-speaking="dialogueStore.isTyping"
        />
      </div>

      <!-- Dialogue strip at bottom -->
      <div class="dialogue-scene__strip">
        <!-- Name tag pinned above the box -->
        <div
          v-if="currentLine"
          class="dialogue-scene__name"
          :style="{ background: speakerColor }"
        >
          {{ speakerName }}
        </div>

        <div class="dialogue-scene__box-area">
          <DialogueBox
            v-if="currentLine"
            :speaker="currentLine.speaker"
            :text="currentLine.text"
            :is-typing="dialogueStore.isTyping"
            :has-choices="dialogueStore.hasChoices"
            @advance="dialogueStore.advanceLine()"
            @skip-typing="dialogueStore.finishTyping()"
          />

          <ChoicePanel
            v-if="currentLine?.choices && !dialogueStore.isTyping"
            :choices="currentLine.choices"
            @select="dialogueStore.selectChoice($event)"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { useDialogueStore } from '~/stores/useDialogueStore'
import { characters } from '~/data/characters'

const dialogueStore = useDialogueStore()
const currentLine = computed(() => dialogueStore.currentLine)
const isEntering = ref(false)

const speakerName = computed(() => {
  const char = characters[currentLine.value?.speaker ?? '']
  return char?.name ?? currentLine.value?.speaker ?? ''
})

const speakerColor = computed(() => {
  const char = characters[currentLine.value?.speaker ?? '']
  return char?.color ?? '#666'
})

let lastSpeaker = ''
watch(() => currentLine.value?.speaker, (newSpeaker) => {
  if (newSpeaker && newSpeaker !== lastSpeaker) {
    lastSpeaker = newSpeaker
    isEntering.value = true

    nextTick(() => {
      const charEl = document.querySelector('.dialogue-scene__character')
      if (charEl) {
        gsap.fromTo(charEl,
          { x: -50, scale: 0.6, opacity: 0, rotation: -10 },
          {
            x: 0, scale: 1, opacity: 1, rotation: 0,
            duration: 0.55,
            ease: 'elastic.out(1, 0.5)',
            onComplete: () => { isEntering.value = false },
          }
        )
      }
    })
  }
})
</script>

<style scoped>
.dialogue-scene {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

/* Gradient scrim — only on bottom 40% so scene stays visible */
.dialogue-scene__scrim {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 100%);
  pointer-events: none;
}

/* ===== CHARACTER — stands to the left, overlaps the dialogue ===== */
.dialogue-scene__character {
  position: absolute;
  left: 2%;
  bottom: 20%;
  width: 28vw;
  max-width: 160px;
  height: 45vh;
  max-height: 300px;
  z-index: 3;
  pointer-events: none;
  animation: idleBreathing 3s ease-in-out infinite;
}

.character--speaking {
  animation: speakingBounce 0.4s ease-in-out infinite alternate;
}

.character--entering {
  animation: none;
}

@keyframes idleBreathing {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.015); }
}

@keyframes speakingBounce {
  0% { transform: translateY(0) scale(1) rotate(0deg); }
  100% { transform: translateY(-7px) scale(1.04) rotate(1.5deg); }
}

/* ===== DIALOGUE STRIP — fixed at bottom ===== */
.dialogue-scene__strip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 10px 10px;
  /* Offset to the right so character doesn't cover text */
  padding-left: calc(28vw + 4px);
  pointer-events: auto;
  z-index: 2;
}

.dialogue-scene__name {
  display: inline-block;
  font-size: 13px;
  font-weight: 800;
  color: white;
  padding: 4px 16px;
  border-radius: var(--radius-full);
  margin-bottom: 5px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  box-shadow: var(--shadow-md);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.dialogue-scene__box-area {
  position: relative;
}

/* ===== TRANSITIONS ===== */
.dialogue-enter-enter-active {
  transition: opacity 300ms var(--ease-out);
}
.dialogue-enter-leave-active {
  transition: opacity 200ms ease;
}
.dialogue-enter-enter-from {
  opacity: 0;
}
.dialogue-enter-leave-to {
  opacity: 0;
}

/* ===== RESPONSIVE ===== */

/* Small phones */
@media (max-width: 380px) {
  .dialogue-scene__character {
    width: 24vw;
    max-width: 110px;
    height: 38vh;
    max-height: 220px;
    bottom: 22%;
  }
  .dialogue-scene__strip {
    padding-left: calc(24vw + 4px);
  }
}

/* Tablets and wider */
@media (min-width: 600px) {
  .dialogue-scene__character {
    width: 22vw;
    max-width: 180px;
    height: 50vh;
    max-height: 350px;
    left: 3%;
    bottom: 18%;
  }
  .dialogue-scene__strip {
    padding-left: calc(22vw + 16px);
    padding-right: 16px;
    padding-bottom: 14px;
  }
  .dialogue-scene__name {
    font-size: 14px;
    padding: 5px 20px;
  }
}

/* Desktop */
@media (min-width: 900px) {
  .dialogue-scene__character {
    width: 180px;
    max-width: 200px;
    height: 380px;
    max-height: 400px;
    left: 5%;
    bottom: 16%;
  }
  .dialogue-scene__strip {
    padding-left: 220px;
    padding-right: 24px;
    padding-bottom: 18px;
    max-width: 800px;
  }
}
</style>
