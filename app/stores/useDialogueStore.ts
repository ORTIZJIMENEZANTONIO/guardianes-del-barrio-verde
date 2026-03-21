import { defineStore } from 'pinia'
import type { DialogueLine, DialogueChoice } from '~/shared/types/character'
import { usePlayerStore } from './usePlayerStore'

export const useDialogueStore = defineStore('dialogue', {
  state: () => ({
    queue: [] as DialogueLine[],
    currentIndex: 0,
    isActive: false,
    isTyping: false,
    selectedChoice: null as DialogueChoice | null,
    onCompleteCallback: null as (() => void) | null,
  }),

  getters: {
    currentLine: (state): DialogueLine | null => {
      if (!state.isActive || state.currentIndex >= state.queue.length) return null
      return state.queue[state.currentIndex]
    },

    hasChoices(): boolean {
      return !!this.currentLine?.choices?.length
    },

    isDialogueActive: (state) => state.isActive,

    progress: (state) => ({
      current: state.currentIndex + 1,
      total: state.queue.length,
    }),
  },

  actions: {
    startDialogue(lines: DialogueLine[], onComplete?: () => void) {
      const playerStore = usePlayerStore()
      const name = playerStore.playerName || 'Guardián'

      // Filter optional lines for older players, replace {nombre}
      let processed = lines
      if (playerStore.isCompactDialogue) {
        processed = lines.filter(l => !l.optional)
      }
      this.queue = processed.map(l => ({
        ...l,
        text: l.text.replace(/\{nombre\}/g, name),
      }))
      this.currentIndex = 0
      this.isActive = true
      this.isTyping = true
      this.selectedChoice = null
      this.onCompleteCallback = onComplete ?? null
    },

    finishTyping() {
      this.isTyping = false
    },

    advanceLine() {
      if (this.isTyping) {
        this.isTyping = false
        return
      }

      if (this.currentLine?.choices && !this.selectedChoice) {
        return
      }

      this.selectedChoice = null

      if (this.currentIndex < this.queue.length - 1) {
        this.currentIndex++
        this.isTyping = true
      } else {
        this.endDialogue()
      }
    },

    selectChoice(choice: DialogueChoice) {
      this.selectedChoice = choice
      this.advanceLine()
    },

    endDialogue() {
      this.isActive = false
      this.isTyping = false
      this.queue = []
      this.currentIndex = 0
      this.selectedChoice = null
      if (this.onCompleteCallback) {
        this.onCompleteCallback()
        this.onCompleteCallback = null
      }
    },

    skipAll() {
      this.endDialogue()
    },
  },
})
