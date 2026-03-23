/**
 * Reusable feedback toast for minigames.
 * Replaces ~10 lines of duplicated state + timer logic per component.
 */
export function useGameFeedback<T = { message: string; ok: boolean }>() {
  const feedback = ref<T | null>(null)
  let timer: ReturnType<typeof setTimeout> | null = null

  function show(value: T, duration = 3500) {
    if (timer) clearTimeout(timer)
    feedback.value = value as any
    timer = setTimeout(() => { feedback.value = null }, duration)
  }

  function showOk(message: string, duration = 3500) {
    show({ message, ok: true } as any, duration)
  }

  function showNo(message: string, duration = 3500) {
    show({ message, ok: false } as any, duration)
  }

  function clear() {
    if (timer) clearTimeout(timer)
    feedback.value = null
  }

  return { feedback, show, showOk, showNo, clear }
}
