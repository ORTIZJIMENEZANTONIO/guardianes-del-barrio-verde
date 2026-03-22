/**
 * Analytics tracking for Guardianes del Barrio Verde.
 * Stores events in localStorage and optionally syncs to /cercu-backend.
 */

const ANALYTICS_KEY = 'guardianes-analytics-v1'
const BACKEND_URL = '/cercu-backend/api/guardianes'

export interface AnalyticsEvent {
  id: string
  type: 'registration' | 'chapter_start' | 'chapter_complete' | 'mission_start' | 'mission_complete' | 'mission_retry' | 'session_start'
  timestamp: number
  playerId: string
  data: Record<string, any>
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function hashPlayer(name: string, age: number): string {
  // Simple hash for anonymized player identification
  const str = `${name.toLowerCase().trim()}-${age}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return 'p' + Math.abs(hash).toString(36)
}

function getStoredEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function storeEvent(event: AnalyticsEvent) {
  const events = getStoredEvents()
  events.push(event)
  // Keep last 5000 events to avoid bloating localStorage
  if (events.length > 5000) events.splice(0, events.length - 5000)
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events))
}

async function sendToBackend(event: AnalyticsEvent) {
  try {
    await fetch(`${BACKEND_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
  } catch {
    // Backend not available — silently fail, local storage is the fallback
  }
}

export function useAnalytics() {
  function trackEvent(
    type: AnalyticsEvent['type'],
    playerName: string,
    playerAge: number,
    data: Record<string, any> = {},
  ) {
    const event: AnalyticsEvent = {
      id: generateId(),
      type,
      timestamp: Date.now(),
      playerId: hashPlayer(playerName, playerAge),
      data: { ...data, age: playerAge },
    }
    storeEvent(event)
    sendToBackend(event)
  }

  function getEvents(): AnalyticsEvent[] {
    return getStoredEvents()
  }

  function clearEvents() {
    localStorage.removeItem(ANALYTICS_KEY)
  }

  /** Compute aggregate statistics from local events */
  function getStats() {
    const events = getStoredEvents()

    // Unique players
    const playerIds = new Set(events.map(e => e.playerId))

    // Age distribution
    const ageDist: Record<number, number> = {}
    const registrations = events.filter(e => e.type === 'registration')
    for (const e of registrations) {
      const age = e.data.age ?? 10
      ageDist[age] = (ageDist[age] || 0) + 1
    }

    // Chapter funnel
    const chapterStarts: Record<string, Set<string>> = {}
    const chapterCompletes: Record<string, Set<string>> = {}
    for (const e of events) {
      if (e.type === 'chapter_start') {
        const ch = e.data.chapterId
        if (!chapterStarts[ch]) chapterStarts[ch] = new Set()
        chapterStarts[ch].add(e.playerId)
      }
      if (e.type === 'chapter_complete') {
        const ch = e.data.chapterId
        if (!chapterCompletes[ch]) chapterCompletes[ch] = new Set()
        chapterCompletes[ch].add(e.playerId)
      }
    }

    // Mission stats
    const missionAttempts: Record<string, number> = {}
    const missionCompletes: Record<string, number> = {}
    const missionRetries: Record<string, number> = {}
    for (const e of events) {
      if (e.type === 'mission_start') {
        const mid = e.data.missionId
        missionAttempts[mid] = (missionAttempts[mid] || 0) + 1
      }
      if (e.type === 'mission_complete') {
        const mid = e.data.missionId
        missionCompletes[mid] = (missionCompletes[mid] || 0) + 1
      }
      if (e.type === 'mission_retry') {
        const mid = e.data.missionId
        missionRetries[mid] = (missionRetries[mid] || 0) + 1
      }
    }

    // Avatar choices
    const avatarChoices: Record<string, number> = {}
    for (const e of registrations) {
      const avatar = e.data.avatarCharacterId ?? 'lila'
      avatarChoices[avatar] = (avatarChoices[avatar] || 0) + 1
    }

    // Last activity
    const lastEvent = events.length > 0 ? events[events.length - 1] : null

    // Sessions per day (last 30 days)
    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
    const sessionsPerDay: Record<string, number> = {}
    for (const e of events.filter(e => e.type === 'session_start' && e.timestamp > thirtyDaysAgo)) {
      const day = new Date(e.timestamp).toISOString().slice(0, 10)
      sessionsPerDay[day] = (sessionsPerDay[day] || 0) + 1
    }

    // Drop-off: players who started but didn't finish chapters
    const chapterIds = ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6']
    const dropOff: Record<string, number> = {}
    for (const pid of playerIds) {
      const playerEvents = events.filter(e => e.playerId === pid)
      const completedChapters = new Set(
        playerEvents.filter(e => e.type === 'chapter_complete').map(e => e.data.chapterId),
      )
      // Find last started chapter that wasn't completed
      const startedChapters = playerEvents
        .filter(e => e.type === 'chapter_start')
        .map(e => e.data.chapterId)
      const lastStarted = startedChapters[startedChapters.length - 1]
      if (lastStarted && !completedChapters.has(lastStarted)) {
        dropOff[lastStarted] = (dropOff[lastStarted] || 0) + 1
      }
    }

    return {
      totalPlayers: playerIds.size,
      totalEvents: events.length,
      ageDist,
      chapterStarts,
      chapterCompletes,
      missionAttempts,
      missionCompletes,
      missionRetries,
      avatarChoices,
      lastEvent,
      sessionsPerDay,
      dropOff,
    }
  }

  async function fetchBackendStats() {
    try {
      const res = await fetch(`${BACKEND_URL}/stats`)
      if (res.ok) return await res.json()
      return null
    } catch {
      return null
    }
  }

  return {
    trackEvent,
    getEvents,
    getStats,
    clearEvents,
    fetchBackendStats,
  }
}
