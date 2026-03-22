/**
 * Secret gesture to navigate to /admin.
 * Pattern: tap 3 times in each of the 4 screen corners within 6 seconds.
 * Corner zones are 80x80px from each edge.
 * Order doesn't matter — just need 3 taps per corner within the time window.
 */

type Corner = 'tl' | 'tr' | 'bl' | 'br'

export function useSecretAccess() {
  const triggered = ref(false)
  const zone = 80

  const cornerTaps: Record<Corner, number> = { tl: 0, tr: 0, bl: 0, br: 0 }
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function resetTaps() {
    cornerTaps.tl = 0
    cornerTaps.tr = 0
    cornerTaps.bl = 0
    cornerTaps.br = 0
  }

  function getCorner(x: number, y: number): Corner | null {
    const w = window.innerWidth
    const h = window.innerHeight
    const isLeft = x <= zone
    const isRight = x >= w - zone
    const isTop = y <= zone
    const isBottom = y >= h - zone

    if (isTop && isLeft) return 'tl'
    if (isTop && isRight) return 'tr'
    if (isBottom && isLeft) return 'bl'
    if (isBottom && isRight) return 'br'
    return null
  }

  function handleTap(e: PointerEvent | MouseEvent) {
    const corner = getCorner(e.clientX, e.clientY)
    if (!corner) return

    // Start/reset the 6s window on first corner tap
    if (cornerTaps.tl + cornerTaps.tr + cornerTaps.bl + cornerTaps.br === 0) {
      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(resetTaps, 6000)
    }

    cornerTaps[corner]++

    // Check if all 4 corners have 3+ taps
    if (cornerTaps.tl >= 3 && cornerTaps.tr >= 3 && cornerTaps.bl >= 3 && cornerTaps.br >= 3) {
      resetTaps()
      if (resetTimer) clearTimeout(resetTimer)
      triggered.value = true
    }
  }

  return {
    triggered,
    handleTap,
  }
}
