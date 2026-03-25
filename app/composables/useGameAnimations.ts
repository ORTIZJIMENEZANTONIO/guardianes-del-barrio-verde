import { gsap } from 'gsap'

/**
 * Game animation helpers powered by GSAP.
 * Designed for kids 8-12: bouncy, colorful, fast feedback.
 */
export function useGameAnimations() {

  /** Big bouncy entrance for important elements (rewards, titles) */
  function popIn(el: Element | string, delay = 0) {
    return gsap.fromTo(el,
      { scale: 0, opacity: 0, rotation: -10 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, delay, ease: 'elastic.out(1, 0.5)' }
    )
  }

  /** Slide up from below with bounce */
  function slideUpBounce(el: Element | string, delay = 0) {
    return gsap.fromTo(el,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay, ease: 'back.out(1.7)' }
    )
  }

  /** Success celebration — scales up then settles */
  function celebrateSuccess(el: Element | string) {
    return gsap.timeline()
      .fromTo(el, { scale: 0.5, opacity: 0 }, { scale: 1.3, opacity: 1, duration: 0.3, ease: 'power2.out' })
      .to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
  }

  /** Wrong answer shake */
  function shakeWrong(el: Element | string) {
    return gsap.timeline()
      .to(el, { x: -12, duration: 0.06 })
      .to(el, { x: 12, duration: 0.06 })
      .to(el, { x: -8, duration: 0.06 })
      .to(el, { x: 8, duration: 0.06 })
      .to(el, { x: -4, duration: 0.06 })
      .to(el, { x: 0, duration: 0.06 })
  }

  /** Score counter increment animation */
  function animateScore(el: Element | string) {
    return gsap.timeline()
      .to(el, { scale: 1.4, duration: 0.15, ease: 'power2.out' })
      .to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' })
  }

  /** Item sorted — flies to target then vanishes */
  function flyToTarget(el: Element | string, targetEl: Element | string) {
    const source = typeof el === 'string' ? document.querySelector(el) : el
    const target = typeof targetEl === 'string' ? document.querySelector(targetEl) : targetEl
    if (!source || !target) return

    const sr = source.getBoundingClientRect()
    const tr = target.getBoundingClientRect()
    const dx = tr.left + tr.width / 2 - (sr.left + sr.width / 2)
    const dy = tr.top + tr.height / 2 - (sr.top + sr.height / 2)

    return gsap.timeline()
      .to(source, { x: dx, y: dy, scale: 0.3, opacity: 0, duration: 0.4, ease: 'power3.in' })
  }

  /** Stagger entrance for a list of elements */
  function staggerIn(els: Element | string, stagger = 0.08) {
    return gsap.fromTo(els,
      { y: 30, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger, ease: 'back.out(1.4)' }
    )
  }

  /** Pulsing glow effect — uses scale+opacity instead of box-shadow for GPU performance */
  function pulseGlow(el: Element | string) {
    return gsap.to(el, {
      scale: 1.06,
      opacity: 0.85,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }

  /** Confetti burst — creates particles that fly outward */
  function confettiBurst(container: Element | string, count = 20) {
    const parent = typeof container === 'string' ? document.querySelector(container) : container
    if (!parent) return

    const emojis = ['⭐', '🌟', '✨', '🎉', '💚', '🌱', '🌸', '🦋', '💫', '🎊']
    const fragments: HTMLElement[] = []

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span')
      span.textContent = emojis[i % emojis.length]
      span.style.cssText = 'position:absolute;font-size:20px;pointer-events:none;left:50%;top:50%;'
      parent.appendChild(span)
      fragments.push(span)

      const angle = (i / count) * Math.PI * 2
      const distance = 80 + Math.random() * 120

      gsap.fromTo(span,
        { x: 0, y: 0, scale: 0, opacity: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 40,
          scale: 1 + Math.random() * 0.5,
          opacity: 0,
          rotation: Math.random() * 360,
          duration: 0.8 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => span.remove(),
        }
      )
    }
  }

  /** Typewriter acceleration — makes text appear faster at the end */
  function revealText(el: Element | string) {
    return gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'power2.out' }
    )
  }

  /** Scene transition — old scene slides out, new slides in */
  function sceneTransition(outEl: Element | string | null, inEl: Element | string | null) {
    const tl = gsap.timeline()
    if (outEl) {
      tl.to(outEl, { x: '-100%', opacity: 0, duration: 0.3, ease: 'power2.in' })
    }
    if (inEl) {
      tl.fromTo(inEl,
        { x: '30%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.4, ease: 'power2.out' },
        outEl ? '-=0.1' : 0
      )
    }
    return tl
  }

  /** Heartbeat for urgency (timer running out) */
  function heartbeat(el: Element | string) {
    return gsap.to(el, {
      scale: 1.15,
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })
  }

  /** Kill all animations on an element */
  function killAll(el: Element | string) {
    gsap.killTweensOf(el)
  }

  // ===== ADVANCED PRESETS =====

  /** Big success — golden scale + rotation + sparkle. For milestones and completions. */
  function popSuccess(el: Element | string) {
    return gsap.timeline()
      .fromTo(el, { scale: 0.3, opacity: 0, rotation: -15 }, { scale: 1.5, opacity: 1, rotation: 5, duration: 0.3, ease: 'power3.out' })
      .to(el, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
  }

  /** Gentle wrong — soft wobble instead of aggressive shake. For young kids. */
  function softWrong(el: Element | string) {
    return gsap.timeline()
      .to(el, { rotation: -4, duration: 0.08, ease: 'power1.inOut' })
      .to(el, { rotation: 4, duration: 0.08, ease: 'power1.inOut' })
      .to(el, { rotation: -2, duration: 0.08, ease: 'power1.inOut' })
      .to(el, { rotation: 0, duration: 0.12, ease: 'power1.out' })
  }

  /** Green pulse from edges — for progress milestones (25%, 50%, 75%). */
  function milestonePulse(container: Element | string) {
    const parent = typeof container === 'string' ? document.querySelector(container) : container
    if (!parent || !(parent instanceof HTMLElement)) return

    const flash = document.createElement('div')
    flash.style.cssText = `
      position:absolute;inset:0;pointer-events:none;z-index:50;
      border:3px solid rgba(34,197,94,0.6);border-radius:inherit;
      box-shadow:inset 0 0 30px rgba(34,197,94,0.15);
    `
    parent.style.position = 'relative'
    parent.appendChild(flash)

    return gsap.fromTo(flash,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 1.02, duration: 0.6, ease: 'power2.out', onComplete: () => flash.remove() }
    )
  }

  /** Streak badge entrance — bouncy fire-like entry */
  function streakEnter(el: Element | string) {
    return gsap.fromTo(el,
      { scale: 0, rotation: -20, opacity: 0 },
      { scale: 1.15, rotation: 0, opacity: 1, duration: 0.35, ease: 'back.out(2.5)',
        onComplete: () => { gsap.to(el, { scale: 1, duration: 0.2, ease: 'power1.out' }) } }
    )
  }

  /** Streak break — deflate and fade gently (no punishment feel) */
  function streakBreak(el: Element | string) {
    return gsap.to(el, { scale: 0.7, opacity: 0, duration: 0.3, ease: 'power2.in' })
  }

  /** Sparkle burst from a specific element — smaller than confettiBurst, for inline celebrations */
  function sparkles(el: Element | string, count = 8) {
    const source = typeof el === 'string' ? document.querySelector(el) : el
    if (!source || !(source instanceof HTMLElement)) return

    const rect = source.getBoundingClientRect()
    const parent = source.offsetParent || source.parentElement
    if (!parent) return

    const sparks = ['✨', '⭐', '💫', '🌟', '💚']
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span')
      span.textContent = sparks[i % sparks.length]
      span.style.cssText = `position:absolute;font-size:14px;pointer-events:none;z-index:60;
        left:${rect.left - (parent as HTMLElement).getBoundingClientRect().left + rect.width / 2}px;
        top:${rect.top - (parent as HTMLElement).getBoundingClientRect().top + rect.height / 2}px;`
      ;(parent as HTMLElement).appendChild(span)

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const dist = 30 + Math.random() * 50
      gsap.fromTo(span,
        { scale: 0, opacity: 1 },
        { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 20,
          scale: 0.8 + Math.random() * 0.4, opacity: 0, rotation: Math.random() * 180,
          duration: 0.5 + Math.random() * 0.3, ease: 'power2.out',
          onComplete: () => span.remove() }
      )
    }
  }

  /** Character reaction — bounce + emotion shift feel */
  function characterReact(el: Element | string, type: 'happy' | 'worried' | 'excited' | 'proud') {
    const presets: Record<string, { y: number; scale: number; rotation: number; duration: number }> = {
      happy: { y: -6, scale: 1.15, rotation: 3, duration: 0.25 },
      worried: { y: 2, scale: 0.95, rotation: -2, duration: 0.2 },
      excited: { y: -10, scale: 1.2, rotation: 5, duration: 0.2 },
      proud: { y: -4, scale: 1.1, rotation: 0, duration: 0.3 },
    }
    const p = presets[type] || presets.happy
    return gsap.timeline()
      .to(el, { y: p.y, scale: p.scale, rotation: p.rotation, duration: p.duration, ease: 'power2.out' })
      .to(el, { y: 0, scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
  }

  /** Full mission complete sequence — orchestrated multi-step celebration */
  function missionCompleteSequence(container: Element | string) {
    const parent = typeof container === 'string' ? document.querySelector(container) : container
    if (!parent) return gsap.timeline()

    const tl = gsap.timeline()

    // Step 1: Quick screen flash
    tl.call(() => milestonePulse(parent), [], 0)

    // Step 2: Big confetti at 0.2s
    tl.call(() => confettiBurst(parent, 24), [], 0.2)

    // Step 3: Second wave at 0.6s
    tl.call(() => confettiBurst(parent, 12), [], 0.6)

    return tl
  }

  /** Score counter pop — quick bump when score changes */
  function scorePop(el: Element | string) {
    return gsap.timeline()
      .to(el, { scale: 1.3, color: '#22c55e', duration: 0.12, ease: 'power2.out' })
      .to(el, { scale: 1, color: '', duration: 0.35, ease: 'elastic.out(1, 0.4)' })
  }

  /** Progress bar fill burst — flash of light when progress bar advances */
  function progressFillBurst(el: Element | string) {
    return gsap.timeline()
      .to(el, { filter: 'brightness(1.5)', duration: 0.1 })
      .to(el, { filter: 'brightness(1)', duration: 0.4, ease: 'power2.out' })
  }

  return {
    gsap,
    popIn,
    slideUpBounce,
    celebrateSuccess,
    shakeWrong,
    animateScore,
    flyToTarget,
    staggerIn,
    pulseGlow,
    confettiBurst,
    revealText,
    sceneTransition,
    heartbeat,
    killAll,
    // Advanced presets
    popSuccess,
    softWrong,
    milestonePulse,
    streakEnter,
    streakBreak,
    sparkles,
    characterReact,
    missionCompleteSequence,
    scorePop,
    progressFillBurst,
  }
}
