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

    // Session durations (estimated: time between session_start and last event before next session_start)
    const sessionDurations: number[] = [] // in minutes
    const sessionsByPlayer = new Map<string, AnalyticsEvent[]>()
    for (const e of events) {
      if (!sessionsByPlayer.has(e.playerId)) sessionsByPlayer.set(e.playerId, [])
      sessionsByPlayer.get(e.playerId)!.push(e)
    }
    for (const [, playerEvts] of sessionsByPlayer) {
      const sorted = playerEvts.sort((a, b) => a.timestamp - b.timestamp)
      const starts = sorted.filter(e => e.type === 'session_start')
      for (let i = 0; i < starts.length; i++) {
        const start = starts[i].timestamp
        const nextStart = i < starts.length - 1 ? starts[i + 1].timestamp : Infinity
        // Find last event in this session window
        const sessionEvents = sorted.filter(e => e.timestamp >= start && e.timestamp < nextStart)
        if (sessionEvents.length >= 2) {
          const last = sessionEvents[sessionEvents.length - 1].timestamp
          const durationMin = (last - start) / 60000
          // Cap at 120min to avoid outliers from forgotten sessions
          if (durationMin > 0.5 && durationMin <= 120) {
            sessionDurations.push(Math.round(durationMin))
          }
        }
      }
    }
    const avgSessionMin = sessionDurations.length > 0
      ? Math.round(sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length)
      : 0
    const totalSessionHours = Math.round(sessionDurations.reduce((a, b) => a + b, 0) / 60 * 10) / 10

    // Hours of day distribution (from session_start events)
    const hourDist: Record<number, number> = {}
    for (let h = 0; h < 24; h++) hourDist[h] = 0
    const sessionStarts = events.filter(e => e.type === 'session_start')
    for (const e of sessionStarts) {
      const hour = new Date(e.timestamp).getHours()
      hourDist[hour]++
    }
    // Peak and low hours
    let peakHour = 0, lowHour = 0, peakCount = 0, lowCount = Infinity
    for (let h = 0; h < 24; h++) {
      if (hourDist[h] > peakCount) { peakCount = hourDist[h]; peakHour = h }
      if (hourDist[h] < lowCount) { lowCount = hourDist[h]; lowHour = h }
    }

    // Avatar ranking (sorted most → least)
    const avatarRanking = Object.entries(avatarChoices)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))

    // --- NEW STATS ---

    // Retention: players active on more than 1 unique day
    const playerDays = new Map<string, Set<string>>()
    for (const e of events) {
      if (!playerDays.has(e.playerId)) playerDays.set(e.playerId, new Set())
      playerDays.get(e.playerId)!.add(new Date(e.timestamp).toISOString().slice(0, 10))
    }
    let returnedPlayers = 0
    for (const [, days] of playerDays) {
      if (days.size > 1) returnedPlayers++
    }
    const retentionRate = playerIds.size > 0 ? Math.round((returnedPlayers / playerIds.size) * 100) : 0

    // Full funnel: registration → first mission → first chapter complete → all 6 chapters
    const playersWithMission = new Set(events.filter(e => e.type === 'mission_complete').map(e => e.playerId))
    const playersWithChapter = new Set(events.filter(e => e.type === 'chapter_complete').map(e => e.playerId))
    const allChapterIds = ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6']
    let gameCompleters = 0
    for (const pid of playerIds) {
      const completed = new Set(events.filter(e => e.playerId === pid && e.type === 'chapter_complete').map(e => e.data.chapterId))
      if (allChapterIds.every(ch => completed.has(ch))) gameCompleters++
    }
    const funnel = {
      registered: playerIds.size,
      firstMission: playersWithMission.size,
      firstChapter: playersWithChapter.size,
      allChapters: gameCompleters,
    }

    // Average progress: avg completed chapters per player / 6
    let totalProgress = 0
    for (const pid of playerIds) {
      const completed = new Set(events.filter(e => e.playerId === pid && e.type === 'chapter_complete').map(e => e.data.chapterId))
      totalProgress += completed.size
    }
    const avgProgressPct = playerIds.size > 0 ? Math.round((totalProgress / playerIds.size / 6) * 100) : 0

    // Time per mission (avg minutes between mission_start → mission_complete per mission)
    const missionTimes: Record<string, number[]> = {}
    for (const pid of playerIds) {
      const pe = events.filter(e => e.playerId === pid).sort((a, b) => a.timestamp - b.timestamp)
      for (let i = 0; i < pe.length; i++) {
        if (pe[i].type === 'mission_start') {
          const mid = pe[i].data.missionId
          // Find next mission_complete for same mission
          for (let j = i + 1; j < pe.length; j++) {
            if (pe[j].type === 'mission_complete' && pe[j].data.missionId === mid) {
              const mins = (pe[j].timestamp - pe[i].timestamp) / 60000
              if (mins > 0.1 && mins < 30) { // valid range
                if (!missionTimes[mid]) missionTimes[mid] = []
                missionTimes[mid].push(Math.round(mins * 10) / 10)
              }
              break
            }
            // If another mission_start comes first, this one was abandoned
            if (pe[j].type === 'mission_start') break
          }
        }
      }
    }
    const missionAvgTimes: Record<string, number> = {}
    for (const [mid, times] of Object.entries(missionTimes)) {
      missionAvgTimes[mid] = Math.round(times.reduce((a, b) => a + b, 0) / times.length * 10) / 10
    }

    // Time per chapter (avg minutes)
    const chapterTimes: Record<string, number[]> = {}
    for (const pid of playerIds) {
      const pe = events.filter(e => e.playerId === pid).sort((a, b) => a.timestamp - b.timestamp)
      for (let i = 0; i < pe.length; i++) {
        if (pe[i].type === 'chapter_start') {
          const cid = pe[i].data.chapterId
          for (let j = i + 1; j < pe.length; j++) {
            if (pe[j].type === 'chapter_complete' && pe[j].data.chapterId === cid) {
              const mins = (pe[j].timestamp - pe[i].timestamp) / 60000
              if (mins > 0.5 && mins < 60) {
                if (!chapterTimes[cid]) chapterTimes[cid] = []
                chapterTimes[cid].push(Math.round(mins))
              }
              break
            }
            if (pe[j].type === 'chapter_start') break
          }
        }
      }
    }
    const chapterAvgTimes: Record<string, number> = {}
    for (const [cid, times] of Object.entries(chapterTimes)) {
      chapterAvgTimes[cid] = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    }

    // Timeout rate: mission_start without matching mission_complete (estimated as abandoned)
    const missionAbandoned: Record<string, number> = {}
    for (const pid of playerIds) {
      const pe = events.filter(e => e.playerId === pid).sort((a, b) => a.timestamp - b.timestamp)
      for (let i = 0; i < pe.length; i++) {
        if (pe[i].type === 'mission_start') {
          const mid = pe[i].data.missionId
          let found = false
          for (let j = i + 1; j < pe.length; j++) {
            if (pe[j].type === 'mission_complete' && pe[j].data.missionId === mid) { found = true; break }
            if (pe[j].type === 'mission_start') break
          }
          if (!found) {
            missionAbandoned[mid] = (missionAbandoned[mid] || 0) + 1
          }
        }
      }
    }

    // Error rate by age: retries / attempts per age group
    const errorsByAge: Record<number, { retries: number; attempts: number }> = {}
    for (const e of events) {
      const age = e.data.age
      if (!age) continue
      if (!errorsByAge[age]) errorsByAge[age] = { retries: 0, attempts: 0 }
      if (e.type === 'mission_retry') errorsByAge[age].retries++
      if (e.type === 'mission_start') errorsByAge[age].attempts++
    }

    // Most replayed missions (same player started >1 time)
    const playerMissionStarts = new Map<string, Record<string, number>>()
    for (const e of events.filter(e => e.type === 'mission_start')) {
      const mid = e.data.missionId
      if (!playerMissionStarts.has(e.playerId)) playerMissionStarts.set(e.playerId, {})
      const pm = playerMissionStarts.get(e.playerId)!
      pm[mid] = (pm[mid] || 0) + 1
    }
    const missionReplays: Record<string, number> = {}
    for (const [, missions] of playerMissionStarts) {
      for (const [mid, count] of Object.entries(missions)) {
        if (count > 1) missionReplays[mid] = (missionReplays[mid] || 0) + (count - 1)
      }
    }
    const mostReplayed = Object.entries(missionReplays).sort((a, b) => b[1] - a[1]).slice(0, 10)

    // Device distribution
    let mobileCount = 0, desktopCount = 0
    const screenSizes: Record<string, number> = {}
    for (const e of sessionStarts) {
      if (e.data.isMobile) mobileCount++; else desktopCount++
      if (e.data.screenWidth && e.data.screenHeight) {
        const size = `${e.data.screenWidth}x${e.data.screenHeight}`
        screenSizes[size] = (screenSizes[size] || 0) + 1
      }
    }
    const topScreenSizes = Object.entries(screenSizes).sort((a, b) => b[1] - a[1]).slice(0, 8)

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
      avatarRanking,
      lastEvent,
      sessionsPerDay,
      dropOff,
      sessionDurations,
      avgSessionMin,
      totalSessionHours,
      hourDist,
      peakHour,
      lowHour,
      // New
      retentionRate,
      returnedPlayers,
      funnel,
      gameCompleters,
      avgProgressPct,
      missionAvgTimes,
      chapterAvgTimes,
      missionAbandoned,
      errorsByAge,
      mostReplayed,
      mobileCount,
      desktopCount,
      topScreenSizes,
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
