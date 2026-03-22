<template>
  <!-- LOGIN SCREEN -->
  <div v-if="!isAuthenticated" class="admin-login">
    <div class="login-card">
      <div class="login-icon">🔒</div>
      <h2>Admin</h2>
      <form @submit.prevent="attemptLogin">
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Contraseña"
          class="login-input"
          :class="{ 'login-input--error': loginError }"
          autocomplete="off"
          autofocus
        />
        <Transition name="fade">
          <p v-if="loginError" class="login-error">Contraseña incorrecta</p>
        </Transition>
        <button type="submit" class="login-btn" :disabled="!passwordInput">
          Entrar
        </button>
      </form>
      <button class="login-back" @click="router.push('/')">← Volver</button>
    </div>
  </div>

  <!-- DASHBOARD -->
  <div v-else class="admin-page">
    <div class="admin-header">
      <h1>Panel de Administracion</h1>
      <p class="admin-subtitle">Guardianes del Barrio Verde</p>
      <div class="admin-nav">
        <button class="tab-btn tab-btn--active">
          Estadisticas
        </button>
        <button class="tab-btn tab-btn--ghost" @click="logout">
          Cerrar sesion
        </button>
        <button class="tab-btn tab-btn--ghost" @click="router.push('/')">
          Volver al juego
        </button>
      </div>
    </div>

    <!-- ===== ESTADISTICAS ===== -->
    <div class="stats-content">

      <!-- Summary cards -->
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalPlayers }}</div>
          <div class="stat-label">Jugadores</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalEvents }}</div>
          <div class="stat-label">Eventos registrados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalMissionsCompleted }}</div>
          <div class="stat-label">Misiones completadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalChaptersCompleted }}</div>
          <div class="stat-label">Capitulos completados</div>
        </div>
      </div>

      <!-- Age Distribution -->
      <section class="stat-section">
        <h2>Distribucion por edad</h2>
        <div class="bar-chart">
          <div v-for="age in ageLabels" :key="age" class="bar-row">
            <span class="bar-label">{{ age === 13 ? '12+' : age }}</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: agePercent(age) + '%' }" />
            </div>
            <span class="bar-count">{{ stats.ageDist[age] || 0 }}</span>
          </div>
        </div>
      </section>

      <!-- Chapter Funnel -->
      <section class="stat-section">
        <h2>Embudo de capitulos</h2>
        <div class="funnel">
          <div v-for="ch in chapterList" :key="ch.id" class="funnel-row">
            <span class="funnel-icon">{{ ch.icon }}</span>
            <span class="funnel-name">{{ ch.title }}</span>
            <div class="funnel-bars">
              <div class="funnel-bar funnel-bar--start">
                <div class="funnel-fill" :style="{ width: funnelPercent(ch.id, 'start') + '%' }" />
                <span class="funnel-val">{{ funnelCount(ch.id, 'start') }} iniciaron</span>
              </div>
              <div class="funnel-bar funnel-bar--end">
                <div class="funnel-fill funnel-fill--green" :style="{ width: funnelPercent(ch.id, 'end') + '%' }" />
                <span class="funnel-val">{{ funnelCount(ch.id, 'end') }} completaron</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission Completion Rates -->
      <section class="stat-section">
        <h2>Misiones: intentos vs completadas</h2>
        <div class="mission-stats">
          <div v-for="m in missionList" :key="m.id" class="mstat-row">
            <span class="mstat-name">{{ m.title }}</span>
            <div class="mstat-bars">
              <span class="mstat-attempts">{{ stats.missionAttempts[m.id] || 0 }} intentos</span>
              <span class="mstat-completes">{{ stats.missionCompletes[m.id] || 0 }} OK</span>
              <span class="mstat-retries">{{ stats.missionRetries[m.id] || 0 }} reintentos</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Drop-off Points -->
      <section class="stat-section">
        <h2>Puntos de abandono</h2>
        <p class="stat-desc">Capitulo donde los jugadores dejaron de avanzar.</p>
        <div class="dropoff">
          <div v-for="ch in chapterList" :key="ch.id" class="dropoff-row">
            <span class="dropoff-icon">{{ ch.icon }}</span>
            <span class="dropoff-name">{{ ch.title }}</span>
            <span class="dropoff-count">{{ stats.dropOff[ch.id] || 0 }} jugadores</span>
          </div>
        </div>
      </section>

      <!-- Avatar Choices -->
      <section class="stat-section">
        <h2>Avatares elegidos</h2>
        <div class="avatar-stats">
          <div v-for="(count, avatar) in stats.avatarChoices" :key="avatar" class="avatar-stat">
            <span class="avatar-name">{{ avatar }}</span>
            <span class="avatar-count">{{ count }}</span>
          </div>
        </div>
      </section>

      <!-- Activity Timeline (last 30 days) -->
      <section class="stat-section">
        <h2>Sesiones por dia (ultimos 30 dias)</h2>
        <div class="timeline">
          <div v-for="(count, day) in stats.sessionsPerDay" :key="day" class="timeline-row">
            <span class="timeline-day">{{ day }}</span>
            <div class="timeline-bar" :style="{ width: Math.min(100, count * 20) + '%' }" />
            <span class="timeline-count">{{ count }}</span>
          </div>
        </div>
        <p v-if="Object.keys(stats.sessionsPerDay).length === 0" class="stat-empty">
          Sin datos de sesiones aun.
        </p>
      </section>

      <!-- Backend Status -->
      <section class="stat-section">
        <h2>Conexion backend</h2>
        <div class="backend-status" :class="backendConnected ? 'backend--ok' : 'backend--off'">
          {{ backendConnected ? 'Conectado a /cercu-backend' : 'Sin conexion — usando datos locales' }}
        </div>
        <div class="admin-actions">
          <button class="action-btn" @click="refreshStats">Actualizar estadisticas</button>
          <button class="action-btn action-btn--red" @click="clearAnalytics">Limpiar datos locales</button>
        </div>
      </section>

      <!-- Raw Events (collapsible) -->
      <section class="stat-section">
        <div class="section-toggle" @click="showRawEvents = !showRawEvents">
          <h2>Eventos crudos ({{ rawEvents.length }})</h2>
          <span>{{ showRawEvents ? 'Ocultar' : 'Mostrar' }}</span>
        </div>
        <div v-if="showRawEvents" class="raw-events">
          <div v-for="e in rawEvents.slice(0, 100)" :key="e.id" class="raw-event">
            <span class="event-type" :class="'evt--' + e.type">{{ e.type }}</span>
            <span class="event-player">{{ e.playerId }}</span>
            <span class="event-time">{{ formatTime(e.timestamp) }}</span>
            <span class="event-data">{{ JSON.stringify(e.data) }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '~/composables/useAnalytics'
import { useSecretAccess } from '~/composables/useSecretAccess'
import { chapter1 } from '~/data/chapters/chapter-1'
import { chapter1Missions } from '~/data/chapters/chapter-1/missions'
import { chapter2 } from '~/data/chapters/chapter-2'
import { chapter2Missions } from '~/data/chapters/chapter-2/missions'
import { chapter3 } from '~/data/chapters/chapter-3'
import { chapter3Missions } from '~/data/chapters/chapter-3/missions'
import { chapter4 } from '~/data/chapters/chapter-4'
import { chapter4Missions } from '~/data/chapters/chapter-4/missions'
import { chapter5 } from '~/data/chapters/chapter-5'
import { chapter5Missions } from '~/data/chapters/chapter-5/missions'
import { chapter6 } from '~/data/chapters/chapter-6'
import { chapter6Missions } from '~/data/chapters/chapter-6/missions'

const router = useRouter()
const { getEvents, getStats, clearEvents, fetchBackendStats } = useAnalytics()

// --- Auth ---
// To change the password: run `echo -n "your-new-password" | shasum -a 256` and paste the hash below
const ADMIN_HASH = '3436d1f54d3a1cf2487071bd9721049de92bc0c7a8e73ae94efccc2ce7585425' // barrio-verde-admin
const AUTH_KEY = 'guardianes-admin-auth'

const isAuthenticated = ref(false)
const passwordInput = ref('')
const loginError = ref(false)

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function attemptLogin() {
  loginError.value = false
  const hash = await sha256(passwordInput.value)
  if (hash === ADMIN_HASH) {
    sessionStorage.setItem(AUTH_KEY, 'true')
    isAuthenticated.value = true
    passwordInput.value = ''
    await initDashboard()
  } else {
    loginError.value = true
    passwordInput.value = ''
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY)
  const { clearGesture } = useSecretAccess()
  clearGesture()
  router.replace('/')
}

// --- Dashboard state ---
const showRawEvents = ref(false)
const backendConnected = ref(false)

const chapterList = [
  { id: 'chapter-1', icon: chapter1.icon, title: chapter1.title },
  { id: 'chapter-2', icon: chapter2.icon, title: chapter2.title },
  { id: 'chapter-3', icon: chapter3.icon, title: chapter3.title },
  { id: 'chapter-4', icon: chapter4.icon, title: chapter4.title },
  { id: 'chapter-5', icon: chapter5.icon, title: chapter5.title },
  { id: 'chapter-6', icon: chapter6.icon, title: chapter6.title },
]

const missionList = [
  ...chapter1Missions, ...chapter2Missions, ...chapter3Missions,
  ...chapter4Missions, ...chapter5Missions, ...chapter6Missions,
]

const ageLabels = [6, 7, 8, 9, 10, 11, 12, 13]

const stats = ref(getStats())
const rawEvents = ref(getEvents().reverse())

const totalMissionsCompleted = computed(() =>
  Object.values(stats.value.missionCompletes).reduce((a, b) => a + b, 0),
)

const totalChaptersCompleted = computed(() => {
  let total = 0
  for (const ch of Object.values(stats.value.chapterCompletes)) {
    total += ch.size
  }
  return total
})

function agePercent(age: number): number {
  const max = Math.max(1, ...Object.values(stats.value.ageDist))
  return ((stats.value.ageDist[age] || 0) / max) * 100
}

function funnelCount(chapterId: string, type: 'start' | 'end'): number {
  const map = type === 'start' ? stats.value.chapterStarts : stats.value.chapterCompletes
  return map[chapterId]?.size ?? 0
}

function funnelPercent(chapterId: string, type: 'start' | 'end'): number {
  const max = Math.max(1, ...Object.values(stats.value.chapterStarts).map(s => s.size))
  return (funnelCount(chapterId, type) / max) * 100
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
}

function refreshStats() {
  stats.value = getStats()
  rawEvents.value = getEvents().reverse()
}

function clearAnalytics() {
  if (confirm('Seguro que quieres limpiar todos los datos de analytics locales?')) {
    clearEvents()
    refreshStats()
  }
}

async function initDashboard() {
  const backendStats = await fetchBackendStats()
  backendConnected.value = !!backendStats
}

onMounted(async () => {
  // Block direct URL access — gesture must have been used this session
  const { wasGestureUsed } = useSecretAccess()
  if (!wasGestureUsed()) {
    router.replace('/')
    return
  }

  // Restore session if already authenticated
  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    isAuthenticated.value = true
    await initDashboard()
  }
})
</script>

<style scoped>
/* ===== LOGIN ===== */
.admin-login {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 40px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  min-width: 280px;
}

.login-icon { font-size: 40px; }

.login-card h2 {
  font-size: 20px;
  font-weight: 900;
  color: #f1f5f9;
  margin: 0;
}

.login-card form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.login-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid #334155;
  background: #0f172a;
  color: #f1f5f9;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-main);
  outline: none;
  transition: border-color 150ms;
}

.login-input:focus { border-color: #3b82f6; }
.login-input--error { border-color: #ef4444; animation: shake 300ms ease; }

.login-error {
  font-size: 12px;
  font-weight: 700;
  color: #ef4444;
  margin: 0;
}

.login-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #22c55e;
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 150ms;
}

.login-btn:hover:not(:disabled) { background: #16a34a; }
.login-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.login-back {
  background: none;
  border: none;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
}
.login-back:hover { color: #94a3b8; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.fade-enter-active { transition: opacity 0.3s; }
.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ===== DASHBOARD ===== */
.admin-page {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0f172a;
  color: #e2e8f0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20px 20px 80px;
}

.admin-header {
  text-align: center;
  margin-bottom: 24px;
}

.admin-header h1 {
  font-size: 24px;
  font-weight: 900;
  color: #f1f5f9;
}

.admin-subtitle {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  margin: 4px 0 16px;
}

.admin-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: 2px solid #334155;
  background: #1e293b;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 150ms;
}

.tab-btn:hover { background: #334155; color: #e2e8f0; }

.tab-btn--active {
  background: #22c55e;
  border-color: #22c55e;
  color: white;
}

.tab-btn--ghost {
  border-color: transparent;
  background: transparent;
  color: #64748b;
}
.tab-btn--ghost:hover { color: #94a3b8; }

/* ===== STATS ===== */
.stats-content {
  max-width: 800px;
  margin: 0 auto;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 900;
  color: #22c55e;
}

.stat-label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin-top: 4px;
}

.stat-section {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.stat-section h2 {
  font-size: 15px;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 12px;
}

.stat-desc {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

.stat-empty {
  font-size: 13px;
  color: #475569;
  font-style: italic;
}

/* Bar chart */
.bar-chart { display: flex; flex-direction: column; gap: 6px; }
.bar-row { display: flex; align-items: center; gap: 8px; }
.bar-label { width: 28px; font-size: 12px; font-weight: 800; color: #94a3b8; text-align: right; }
.bar-track { flex: 1; height: 20px; background: #0f172a; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: #3b82f6; border-radius: 4px; transition: width 0.5s ease; min-width: 2px; }
.bar-count { width: 28px; font-size: 12px; font-weight: 700; color: #64748b; }

/* Funnel */
.funnel { display: flex; flex-direction: column; gap: 10px; }
.funnel-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.funnel-icon { font-size: 20px; }
.funnel-name { font-size: 12px; font-weight: 700; color: #94a3b8; width: 140px; }
.funnel-bars { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 150px; }
.funnel-bar { height: 16px; background: #0f172a; border-radius: 3px; overflow: hidden; position: relative; }
.funnel-fill { height: 100%; background: #3b82f6; border-radius: 3px; transition: width 0.5s ease; min-width: 2px; }
.funnel-fill--green { background: #22c55e; }
.funnel-val { position: absolute; right: 4px; top: 0; font-size: 10px; font-weight: 700; color: #94a3b8; line-height: 16px; }

/* Mission stats */
.mission-stats { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow-y: auto; }
.mstat-row { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 4px; background: #0f172a; flex-wrap: wrap; }
.mstat-name { font-size: 11px; font-weight: 700; color: #cbd5e1; flex: 1; min-width: 120px; }
.mstat-bars { display: flex; gap: 8px; }
.mstat-attempts { font-size: 10px; color: #64748b; }
.mstat-completes { font-size: 10px; color: #22c55e; font-weight: 700; }
.mstat-retries { font-size: 10px; color: #f59e0b; }

/* Drop-off */
.dropoff { display: flex; flex-direction: column; gap: 6px; }
.dropoff-row { display: flex; align-items: center; gap: 8px; }
.dropoff-icon { font-size: 18px; }
.dropoff-name { font-size: 12px; font-weight: 700; color: #94a3b8; flex: 1; }
.dropoff-count { font-size: 12px; font-weight: 800; color: #f87171; }

/* Avatar stats */
.avatar-stats { display: flex; flex-wrap: wrap; gap: 8px; }
.avatar-stat {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; background: #0f172a; border-radius: 6px;
}
.avatar-name { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: capitalize; }
.avatar-count { font-size: 14px; font-weight: 900; color: #22c55e; }

/* Timeline */
.timeline { display: flex; flex-direction: column; gap: 4px; max-height: 250px; overflow-y: auto; }
.timeline-row { display: flex; align-items: center; gap: 8px; }
.timeline-day { font-size: 10px; font-weight: 700; color: #64748b; width: 70px; font-family: monospace; }
.timeline-bar { height: 14px; background: #3b82f6; border-radius: 3px; min-width: 4px; transition: width 0.3s ease; }
.timeline-count { font-size: 10px; font-weight: 700; color: #94a3b8; }

/* Backend status */
.backend-status {
  padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; margin-bottom: 12px;
}
.backend--ok { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
.backend--off { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }

.admin-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.action-btn {
  padding: 8px 16px; border-radius: 8px; border: 1px solid #334155;
  background: #1e293b; color: #94a3b8; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 150ms;
}
.action-btn:hover { background: #334155; color: #e2e8f0; }
.action-btn--red { border-color: #7f1d1d; color: #f87171; }
.action-btn--red:hover { background: #7f1d1d; color: white; }

/* Raw events */
.section-toggle {
  display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; margin-bottom: 0;
}
.section-toggle:hover h2 { color: #22c55e; }
.section-toggle span { font-size: 12px; color: #64748b; font-weight: 700; }

.raw-events { max-height: 400px; overflow-y: auto; margin-top: 10px; }
.raw-event {
  display: flex; align-items: center; gap: 6px; padding: 3px 0;
  border-bottom: 1px solid #1e293b; font-family: monospace; font-size: 10px;
  flex-wrap: wrap;
}
.event-type {
  padding: 1px 6px; border-radius: 3px; font-weight: 800; font-size: 9px;
  text-transform: uppercase; color: white;
}
.evt--registration { background: #8b5cf6; }
.evt--session_start { background: #3b82f6; }
.evt--chapter_start { background: #f59e0b; }
.evt--chapter_complete { background: #22c55e; }
.evt--mission_start { background: #06b6d4; }
.evt--mission_complete { background: #10b981; }
.evt--mission_retry { background: #ef4444; }
.event-player { color: #475569; }
.event-time { color: #64748b; }
.event-data { color: #334155; word-break: break-all; }
</style>
