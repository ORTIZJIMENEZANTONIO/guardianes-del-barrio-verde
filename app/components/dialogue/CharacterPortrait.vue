<template>
  <div
    class="character-portrait"
    :class="[`portrait--${position}`, { 'portrait--speaking': isSpeaking }]"
  >
    <div class="portrait__ring" :style="{ '--char-color': characterColor }">
      <div class="portrait__avatar" :style="{ background: avatarBg }">
        <CharacterFace
          :character-id="characterId"
          :emotion="emotion"
          :is-speaking="isSpeaking"
        />
      </div>
    </div>
    <div class="portrait__name" :style="{ background: characterColor }">
      {{ characterName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { characters } from '~/data/characters'
import type { Emotion } from '~/shared/types/character'

const props = withDefaults(defineProps<{
  characterId: string
  emotion?: Emotion
  isSpeaking?: boolean
  position?: 'left' | 'right'
}>(), {
  emotion: 'neutral',
  isSpeaking: false,
  position: 'left',
})

const character = computed(() => characters[props.characterId])
const characterName = computed(() => character.value?.name ?? props.characterId)
const characterColor = computed(() => character.value?.color ?? '#666')

const avatarBg = computed(() => {
  if (props.characterId === 'nube-gris') return 'linear-gradient(180deg, #d1d5db, #9ca3af)'
  return `linear-gradient(180deg, ${characterColor.value}22, ${characterColor.value}44)`
})
</script>

<style scoped>
.character-portrait {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 300ms var(--ease-spring);
}

.portrait--speaking {
  transform: scale(1.1);
}

.portrait__ring {
  padding: 3px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--char-color), transparent);
  transition: box-shadow 300ms ease;
}

.portrait--speaking .portrait__ring {
  box-shadow: 0 0 20px color-mix(in srgb, var(--char-color) 40%, transparent);
  animation: glowPulse 2s ease-in-out infinite;
}

.portrait__avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  padding: 4px 2px 0;
}

.portrait--speaking .portrait__avatar {
  animation: talkBounce 0.35s ease-in-out infinite alternate;
}

.portrait__name {
  font-size: 11px;
  font-weight: 800;
  color: white;
  padding: 3px 12px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0,0,0,0.25);
  box-shadow: var(--shadow-sm);
}

@keyframes talkBounce {
  from { transform: translateY(0); }
  to { transform: translateY(-3px); }
}
</style>
