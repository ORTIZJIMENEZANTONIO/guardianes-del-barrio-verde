<template>
  <Transition name="dialogue-enter">
    <div v-if="dialogueStore.isDialogueActive" class="dialogue-scene">
      <div class="dialogue-scene__portrait">
        <CharacterPortrait
          v-if="currentLine"
          :character-id="currentLine.speaker"
          :emotion="currentLine.emotion"
          :is-speaking="dialogueStore.isTyping"
        />
      </div>

      <div class="dialogue-scene__box">
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
  </Transition>
</template>

<script setup lang="ts">
import { useDialogueStore } from '~/stores/useDialogueStore'

const dialogueStore = useDialogueStore()
const currentLine = computed(() => dialogueStore.currentLine)
</script>

<style scoped>
.dialogue-scene {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.dialogue-scene__portrait {
  flex-shrink: 0;
}

.dialogue-scene__box {
  flex: 1;
  min-width: 0;
}

.dialogue-enter-enter-active {
  transition: all 400ms var(--ease-spring);
}
.dialogue-enter-leave-active {
  transition: all 200ms ease;
}
.dialogue-enter-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.dialogue-enter-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
