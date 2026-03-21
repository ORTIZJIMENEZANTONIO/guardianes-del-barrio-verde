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

  /** Pulsing glow effect for interactive elements */
  function pulseGlow(el: Element | string) {
    return gsap.to(el, {
      boxShadow: '0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(251,191,36,0.2)',
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
  }
}
