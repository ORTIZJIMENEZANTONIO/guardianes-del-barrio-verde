# Guardianes del Barrio Verde

Juego educativo ambiental web para niños de 6-12+ años en México.

## Stack

- **Nuxt 4** (SPA mode, `ssr: false`)
- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** (state management)
- **Phaser 3** (motor de minijuegos — scenes + wrappers creados, `USE_PHASER = false`)
- **GSAP** (animaciones UI: confetti, bounce, shake, heartbeat, elastic)
- **TypeScript**
- CSS puro con custom properties. Glassmorphism, glow effects, spring animations.
- Fuente: Nunito (Google Fonts, pesos 400-900)

## Comandos

```bash
npm run dev       # Dev server
npm run build     # Build producción (preset: node-server)
npm run preview   # Preview del build
```

## Deploy

- Servidor: VPS `72.62.200.124`
- Ruta: `/var/www/cercu-frontend/guardianes/`
- PM2 process: `guardianes` en puerto **3004**
- Nginx: `guardianes.cercu.com.mx` → proxy a `127.0.0.1:3004`

```bash
# Deploy rápido
tar --exclude='node_modules' --exclude='.nuxt' --exclude='.output' --exclude='.git' -czf /tmp/guardianes.tar.gz .
scp /tmp/guardianes.tar.gz root@72.62.200.124:/var/www/cercu-frontend/guardianes/
ssh root@72.62.200.124 "cd /var/www/cercu-frontend/guardianes && tar -xzf guardianes.tar.gz && rm guardianes.tar.gz && npm install && npm run build && pm2 restart guardianes"
```

## Estructura del proyecto

```
app/
  assets/
    css/main.css                # Design tokens, animaciones, glassmorphism
    images/bolillo/             # 14 PNGs de capas para Bolillo (base, ojos, boca, cejas, cola)
  components/
    ui/                         # GameButton, ProgressBar, Modal, ActionButton, PlayerAvatar
    hud/                        # GameHud (avatar, score, semillas, badges, barra progreso)
    dialogue/                   # DialogueBox, CharacterPortrait, CharacterFace, CharacterBody,
                                #   ChoicePanel, DialogueScene
    scene/                      # SceneSky (cielos SVG), SceneStreet (barrio SVG)
    minigame/                   # MinigameShell (timer adaptativo, z-index 100 overlays)
    reward/                     # RewardPopup
    phaser/                     # PhaserCanvas (wrapper Phaser)
    chapter/chapter-1/ a 6/     # 28 minijuegos Vue + Phaser wrappers (caps 1-3)
  composables/
    useGameAnimations.ts        # GSAP helpers
    useSecretAccess.ts          # Gesto secreto para admin (3 taps x 4 esquinas en 6s)
    useAnalytics.ts             # Tracking de eventos (localStorage + backend)
    usePhaserGame.ts            # Monta/destruye Phaser (lazy import)
  phaser/                       # Scenes, mechanics, effects (USE_PHASER = false)
  pages/
    index.vue                   # Pantalla de inicio
    registro.vue                # Registro: nombre + edad + avatar personaje (4 pasos)
    capitulos.vue               # Selector de 6 capítulos
    chapter/[chapterId].vue     # Motor del juego (dificultad adaptativa por edad)
    admin.vue                   # Dashboard de estadísticas (gesto secreto + login)
    dev.vue                     # Catálogo dev + Testing Autobots (solo localhost)
  stores/
    useGameStore.ts             # Estado maestro
    usePlayerStore.ts           # Perfil + progreso + avatarCharacterId
    useDialogueStore.ts         # Diálogos, typewriter, {nombre}, filtro por edad
  data/
    characters/                 # 8 personajes
    chapters/chapter-1/ a 6/    # 6 capítulos (index, dialogues, missions con difficulty)
  shared/types/                 # TypeScript (MissionConfig con difficulty: 1|2|3)
```

## Flujo del usuario

```
Home → Registro (nombre + edad + personaje) → Capítulos → Capítulo
         4 pasos                               6 caps      Escenas adaptadas por edad
         (6-12 + botón 12+)                    desbloqueados
```

## Sistema de registro y personalización

### Registro (`/registro`) — 4 pasos
1. Nombre (mín. 2 caracteres)
2. Edad: botones `6, 7, 8, 9, 10, 11, 12` + botón especial `12+` (guarda como 13)
3. **Avatar**: elegir personaje existente (Lila, Timo, Xani, Don Toño, Vale, Nico). Excluidos: Bolillo (mascota) y Nube Gris (villano). Muestra CharacterBody + CharacterFace.
4. Bienvenida con Lila → `/capitulos`

### Avatar como personaje
- `avatarCharacterId` guardado en playerStore
- **GameHud** muestra CharacterFace del personaje elegido (32px circular)
- Persistido en localStorage

### Adaptación por edad y dificultad

Cada misión tiene `difficulty: 1 | 2 | 3` (fácil, medio, difícil).

| Edad | Misiones | Timer | Diálogos | Misiones/cap |
|------|----------|:-----:|----------|:------------:|
| **6-7** | dificultad 1+2 (skip 3) | ×1.4 | Completos | ~3-4 |
| **8** | TODAS | ×1.25 | Completos | ~4-6 |
| **9** | TODAS | ×1.1 | Completos | ~4-6 |
| **10** | TODAS | ×1.0 | Completos | ~4-6 |
| **11** | dificultad 2+3 (skip 1) | ×0.85 | Compactos | ~3-4 |
| **12** | dificultad 2+3 (skip 1) | ×0.75 | Compactos | ~3-4 |
| **12+** | **SOLO dificultad 3** | **×0.6** | Compactos | **~2-3** |

Cada capítulo dura máximo ~15 minutos. El `shouldSkipMission()` en `[chapterId].vue` auto-avanza las misiones que no corresponden a la edad. El HUD muestra solo las misiones activas (`activeMissionCount`).

## Mejoras de UX

- **Inicio acortado**: cinemática 2 líneas + bienvenida con choices (antes 4 escenas)
- **Opciones negativas**: "¿Te unes?" → "¡Sí!" / "Mmm, no sé..." / "¿Y si mejor no?" + convencimiento
- **Exploración scroll infinito**: calle 2x duplicada, scroll bidireccional con loop, spots sin label, spots falsos, hint "→ Desliza"
- **Preview de recompensa**: "🌿 20pts 🏅 Badge" antes de cada misión
- **Misión fuga sorpresa**: Cap.1 misión 4 como evento inesperado
- **Barra de progreso en HUD**: dots 🟢⚪ (solo misiones activas por edad)
- **Celebración visual progresiva**: emojis aparecen entre misiones
- **ShadePlanter drag & drop**: arrastrar árboles en vez de tap
- **LeakFixer rediseñado**: ruta SVG visual con huecos y gotas
- **Mensajes de error educativos**: "Por qué estuvo mal. 💡 Consejo suave." Sin dar respuesta, sin "Piensa:"
- **Bolillo expresivo en BolilloRoute**: PNG layers con emociones progresivas (asustado→neutral→feliz) según avanza la ruta
- **Mobile-first flex fix**: paneles laterales (termómetro, gauge, contador) con `flex-shrink: 0` + `overflow: hidden` en contenedores

## Capítulo 1 — La Calle Caliente

11 escenas, 5 misiones. Tema: calor urbano, limpieza, sombra, fugas, espacio público.

| # | Misión | Componente | Mecánica | Diff |
|---|--------|------------|----------|:----:|
| 3 | Limpiar banqueta | `SidewalkCleanup` | drag (10→4 bins, 90s) | 2 |
| 4 | Detectar calor | `HeatDetector` | tap-detect (3 hot de 6) | 1 |
| 5 | Plantar sombra | `ShadePlanter` | drag (6 árboles→7 zonas) | 2 |
| 6 | Reparar fuga (sorpresa) | `LeakFixer` | pipe-fit SVG (5 huecos, 45s) | 3 |
| 7 | Recuperar espacio | `SpaceRestorer` | placement (5+2 distractores) | 3 |

Recompensa: 50 pts, "Guardián de la Calle Caliente".

## Capítulo 2 — El Parque Dormido

13 escenas, 6 misiones. Narrado por **Bolillo**.

| # | Misión | Componente | Mecánica | Diff |
|---|--------|------------|----------|:----:|
| 1 | Despejar senderos | `PathClear` | drag (6→zona, 90s) | 1 |
| 2 | Cuidar el suelo | `SoilMemory` | memorama (4 parejas) | 1 |
| 3 | Regar con estrategia | `WaterDragDrop` | drag (6 gotas→plantas, 90s) | 2 |
| 4 | Vida en el parque | `WildlifeMemory` | memorama (4 parejas) | 1 |
| 5 | Reactivar parque | `ParkDragRestore` | drag (5→zonas) | 2 |
| 6 | **Ruta de Bolillo** | `BolilloRoute` | placement (5+2 distractores, Bolillo PNG expresivo) | 2 |

Recompensa: 60 pts. Bolillo: agua → sombra → comida → cama → compañía. No chocolate (tóxico), no perseguir. Bolillo usa capas PNG con emociones progresivas: asustado (stops 0-1) → neutral (2-3) → feliz (4-5), cola mueve desde stop 3, parpadeo natural.

## Capítulo 3 — La Fuga Infinita

8 escenas, 3 misiones. Tema: agua, humedales.

| # | Misión | Componente | Mecánica | Diff |
|---|--------|------------|----------|:----:|
| 1 | Controlar desperdicio | `FloodDragClear` | drag (5→zona, 90s) | 1 |
| 2 | Proteger humedal | `WetlandMemory` | memorama (4 parejas) | 2 |
| 3 | Reparar tubería | `PipeDragFit` | drag (4+2 trampa, 90s) | 3 |

Recompensa: 50 pts.

## Capítulo 4 — La Ruta de la Basura

11 escenas, 5 misiones. Tema: residuos, reciclaje, composta. Protagonistas: Vale + Timo.

| # | Misión | Componente | Mecánica | Diff |
|---|--------|------------|----------|:----:|
| 1 | Recolectar basura | `TrashCollector` | tap (8 items) | 1 |
| 2 | Separar residuos | `WasteSeparator` | drag (8→4 bins, 90s, datos degradación) | 2 |
| 3 | Detectar contaminación | `PollutionDetector` | tap-detect (4 de 7) | 2 |
| 4 | **Hacer composta** | `CompostBuilder` | placement (5 capas + 3 distractores) | 3 |
| 5 | Centro de reciclaje | `RecycleMemory` | memorama (5 parejas: material→producto) | 2 |

Recompensa: 60 pts.

## Capítulo 5 — Azoteas con Vida

11 escenas, 5 misiones. Tema: techos verdes, ref. CIIEMAD/IPN. Protagonistas: Xani + Timo.

| # | Misión | Componente | Mecánica | Diff |
|---|--------|------------|----------|:----:|
| 0 | **Construir techo verde** | `GreenRoofBuilder` | placement (5 capas + 3 distractores, 70°C vs 35°C) | 2 |
| 1 | Evaluar azotea | `RoofEvaluator` | tap-detect (4 de 6) | 1 |
| 2 | Diseñar espacio | `RoofDesigner` | placement (6+2 distractores) | 3 |
| 3 | Elegir plantas | `PlantMatcher` | memorama (4 parejas) | 2 |
| 4 | Instalar riego | `IrrigationBuilder` | drag (5+2 trampa, 90s) | 3 |

Recompensa: 60 pts.

## Capítulo 6 — El Gran Festival Verde

9 escenas, 4 misiones. Tema: comunidad, cierre. TODOS los personajes.

| # | Misión | Componente | Mecánica | Diff |
|---|--------|------------|----------|:----:|
| 1 | Preparar espacio | `FestivalSetup` | placement (5+2 distractores) | 2 |
| 2 | Invitar al barrio | `NeighborInviter` | tap (6 vecinos) | 1 |
| 3 | Resolver imprevistos | `FestivalProblems` | memorama (4 parejas) | 2 |
| 4 | Inaugurar festival | `FestivalInauguration` | drag (5 elementos) | 1 |

Final emocional. Nube Gris: "El barrio ya no me necesita..." Bolillo: *mueve la cola feliz*.
Recompensa: 80 pts.

## Distribución de temas educativos

| Tema | Capítulo | Profundidad |
|------|----------|-------------|
| Calor urbano / isla de calor | Cap. 1 | Completo |
| Espacio público / urbanismo | Cap. 1 | Misión dedicada (SpaceRestorer) |
| Biodiversidad / animales callejeros | Cap. 2 | Completo (Bolillo + BolilloRoute) |
| Agua / humedales | Cap. 3 | Capítulo completo |
| Separación de residuos | Cap. 1 (general) + Cap. 4 (datos) | Diferenciados |
| **Composta** | Cap. 4 | Misión dedicada (CompostBuilder) |
| **Techos verdes** | Cap. 5 | Capítulo completo (CIIEMAD/IPN) |
| Comunidad / activación | Cap. 6 | Capítulo completo (festival) |

## Personajes

| Personaje | Rol | Color | Avatar | Protagoniza |
|-----------|-----|-------|:------:|-------------|
| Lila | Líder | #2d9d5e | ✅ | Todos |
| Timo | Inventor | #f97316 | ✅ | Cap. 1, 4, 5 |
| Xani | Naturaleza | #8b5cf6 | ✅ | Cap. 2, 3, 5 |
| Don Toño | Vecino | #8b6f47 | ✅ | Cap. 1, 2 |
| Nube Gris | Antagonista | #6b7280 | ❌ | Todos (sarcasmo) |
| Nico | Deportista | #3b82f6 | ✅ | Cap. 1, 2 |
| Vale | Comerciante | #fbbf24 | ✅ | Cap. 4, 6 |
| Bolillo | Perrito mestizo | #c89850 | ❌ | Cap. 2, 6 |

### Bolillo — Sistema de capas PNG

Imágenes en `app/assets/images/bolillo/` (14 PNGs):

| Capa | Archivos | z-index | Cambia por |
|------|----------|---------|------------|
| Cola | tail-down/up | 1 | emoción + speaking |
| Base | base | 2 | nunca |
| Ojos | eyes-neutral/happy/sad/closed | 3 | emoción + blink (3-4s) |
| Cejas | brows-neutral/worried/angry | 4 | emoción |
| Boca | mouth-2-closed/open/wide | 3 | speaking (180ms) + emoción |

- **Easter egg**: 5 taps rápidos → sonríe, cola super-wag, corazones ❤️💛 (3s)
- **foreignObject** `x=10 y=8 width=80 height=162`, base `width:100%; height:auto`
- **BolilloRoute**: usa capas PNG directamente (no CharacterBody), emoción mapeada a `needsMet` (0-1: sad/worried, 2-3: neutral, 4-5: happy/wide), blink cada 3-5s, tail wag desde `needsMet >= 3`

### Mensajes de error educativos

Patrón: **"Por qué estuvo mal. 💡 Consejo suave."**
- No dar respuesta directa
- No usar "Piensa:" (agresivo)
- Usar: "Fíjate en...", "Cada... tiene...", "Intenta con..."

## Acceso secreto a Admin/Dev

**Gesto secreto**: tocar **3 veces cada una de las 4 esquinas** de la pantalla (zonas de 80x80px) **en 6 segundos** desde cualquier página → navega a `/admin`. El orden de las esquinas no importa, solo que las 4 acumulen 3 taps dentro de la ventana de tiempo.

- `/admin` — Login con contraseña → Dashboard de estadísticas. Password hasheada con SHA-256 en `admin.vue` (`ADMIN_HASH`). Para cambiar: `echo -n "nueva-password" | shasum -a 256` y pegar el hash. Default: `barrio-verde-admin`. Sesión en `sessionStorage` (se resetea al cerrar pestaña).
- `/dev` — Catálogo de desarrollo, **solo accesible en localhost/127.0.0.1/192.168.x.x**
- No hay botón visible ni URL pública para acceder a ninguno

## Panel de administración (`/admin`)

Dashboard oscuro con estadísticas:
- **Resumen**: total jugadores, eventos, misiones completadas, capítulos completados
- **Distribución por edad**: barras horizontales (6-12, 12+)
- **Embudo de capítulos**: jugadores que iniciaron vs completaron cada capítulo
- **Misiones**: intentos, completadas, reintentos por misión
- **Puntos de abandono**: último capítulo jugado antes de dejar de avanzar
- **Avatares elegidos**: distribución de personajes
- **Sesiones por día**: timeline de los últimos 30 días
- **Estado backend**: indicador de conexión a `/cercu-backend`
- **Eventos crudos**: tabla expandible con todos los eventos

### Analytics (`useAnalytics.ts`)

Eventos rastreados:
- `registration` — al registrar perfil (nombre, edad, avatar)
- `session_start` — al cargar progreso guardado
- `chapter_start` — al entrar a un capítulo
- `chapter_complete` — al completar un capítulo
- `mission_start` — al iniciar una misión
- `mission_complete` — al completar una misión
- `mission_retry` — al reintentar una misión

Almacenamiento dual:
- **Local**: `guardianes-analytics-v1` en localStorage (máx 5000 eventos)
- **Backend**: POST a `/cercu-backend/api/guardianes/events` (silently fails si no hay backend)

## Catálogo dev (`/dev`)

Solo localhost. Secciones:
- **Personajes**: emociones + hablar
- **Capítulos**: "▶ Jugar este capítulo"
- **Misiones**: 28 minijuegos con "▶ Jugar" (overlay Teleport)
- **🤖 Testing / Autobots**:

| Botón | Función |
|-------|---------|
| 🤖 Verificar TODOS | Checa componente + diálogos + icon + objectives + reward |
| ▶ Correr TODOS | Abre cada misión secuencialmente (1.5s), completa, cierra |
| ▶ Correr capítulo | Igual pero solo un capítulo |
| ▶ Correr misión | Abre 1 misión (2s), completa, cierra |
| ⚡ Completar | Marca done instantáneamente |
| 🔄 Reset | Limpia progreso |

Log en terminal oscuro. Banner amarillo cuando corre. Resumen PASS/FAIL.

## Estado actual

- **6 capítulos, 28 minijuegos** jugables
- **Edades 6-12 + modo 12+** (solo misiones difíciles, timer ×0.6)
- **Dificultad adaptativa**: `difficulty: 1|2|3` por misión, `shouldSkipMission()` por edad
- **Registro**: nombre + edad (6-12, 12+) + avatar = personaje existente
- **Bolillo** con capas PNG expresivas + easter egg + emociones progresivas en BolilloRoute
- **Mensajes de error** educativos y amigables
- **Admin dashboard** con estadísticas de usuarios (local + backend)
- **Acceso secreto** a admin via gesto (3 taps x 4 esquinas en 6s) + login con password
- **Analytics** rastrean: registro, sesiones, capítulos, misiones (localStorage + /cercu-backend)
- **Dev tools** con autobots (verificar, correr, completar)
- **Mobile-first**: paneles laterales con `flex-shrink: 0`, `overflow: hidden` en contenedores de juego
- **Exploración infinita**: scroll bidireccional con loop (2 paneles duplicados)
- **Siluetas de monumentos mexicanos**: 20 landmarks regionales por capítulo (opacity 0.35)
- Integración Phaser.js preparada (`USE_PHASER = false`)
- Deploy en guardianes.cercu.com.mx
