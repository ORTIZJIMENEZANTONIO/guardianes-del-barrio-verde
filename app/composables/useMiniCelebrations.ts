/**
 * Orchestrates micro-celebrations at intermediate milestones.
 * Fires small confetti bursts, emoji floats, and screen flashes
 * without being as heavy as the final confettiBurst.
 */

import { ref } from 'vue'
import { gsap } from 'gsap'
import { useGameAnimations } from './useGameAnimations'

export type CelebrationSize = 'small' | 'medium' | 'big'

export interface CelebrationEvent {
  size: CelebrationSize
  emoji: string
  message: string
}

const CELEBRATION_EMOJIS: Record<CelebrationSize, string[]> = {
  small: ['⭐', '✨', '💚'],
  medium: ['🌟', '🎉', '🌿', '💫'],
  big: ['🎊', '🏆', '🌈', '⭐'],
}

export function useMiniCelebrations(containerRef: () => HTMLElement | null) {
  const { confettiBurst, popIn } = useGameAnimations()
  const lastCelebration = ref<CelebrationEvent | null>(null)
  const showFlash = ref(false)

  function celebrate(size: CelebrationSize, message = '') {
    const container = containerRef()
    if (!container) return

    const emojis = CELEBRATION_EMOJIS[size]
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]

    lastCelebration.value = { size, emoji, message }

    // Confetti scaled by size
    const counts: Record<CelebrationSize, number> = { small: 6, medium: 12, big: 20 }
    confettiBurst(container, counts[size])

    // Screen flash for medium+
    if (size !== 'small') {
      showFlash.value = true
      setTimeout(() => { showFlash.value = false }, 400)
    }

    // Clear celebration after display time
    setTimeout(() => { lastCelebration.value = null }, 2000)
  }

  function onStreakMilestone(streak: number) {
    if (streak === 3) celebrate('small', '¡Racha!')
    else if (streak === 5) celebrate('medium', '¡Increíble!')
    else if (streak >= 7) celebrate('big', '¡Imparable!')
  }

  function onProgressMilestone(pct: number) {
    if (pct === 50) celebrate('small', '¡Vas a la mitad!')
    else if (pct === 75) celebrate('medium', '¡Casi!')
    else if (pct === 100) celebrate('big', '¡Completado!')
  }

  function floatEmoji(el: HTMLElement, emoji: string) {
    const span = document.createElement('span')
    span.textContent = emoji
    span.style.cssText = `
      position: absolute; top: 50%; left: 50%;
      font-size: 28px; pointer-events: none; z-index: 100;
      transform: translate(-50%, -50%);
    `
    el.style.position = 'relative'
    el.appendChild(span)
    popIn(span, 0)

    // Float up and fade
    if (gsap) {
      gsap.to(span, {
        y: -60,
        opacity: 0,
        scale: 1.3,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => span.remove(),
      })
    } else {
      setTimeout(() => span.remove(), 800)
    }
  }

  return {
    lastCelebration,
    showFlash,
    celebrate,
    onStreakMilestone,
    onProgressMilestone,
    floatEmoji,
  }
}
