# Guardianes del Barrio Verde

Juego educativo ambiental web para niños de 7-13 años en México.

## Stack

- **Nuxt 4** (SPA mode, `ssr: false`)
- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** (state management)
- **GSAP** (animaciones: confetti, bounce, shake, heartbeat, elastic)
- **TypeScript**
- CSS puro con custom properties. Design system con glassmorphism, glow effects, spring animations.
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
- Config en `cercu-frontend/deploy/`: `ecosystem.config.cjs`, `deploy.sh`, `nginx.conf`

```bash
# Deploy rápido
tar --exclude='node_modules' --exclude='.nuxt' --exclude='.output' --exclude='.git' -czf /tmp/guardianes.tar.gz .
scp /tmp/guardianes.tar.gz root@72.62.200.124:/var/www/cercu-frontend/guardianes/
ssh root@72.62.200.124 "cd /var/www/cercu-frontend/guardianes && tar -xzf guardianes.tar.gz && rm guardianes.tar.gz && npm install && npm run build && pm2 restart guardianes"
```

## Estructura del proyecto

```
app/
  assets/css/main.css         # Design tokens, animaciones, glassmorphism, glow
  components/
    ui/                       # GameButton, ProgressBar, Modal, ActionButton
    hud/                      # GameHud (score, semillas, insignias con GSAP bounce)
    dialogue/                 # DialogueBox, CharacterPortrait, CharacterFace, CharacterBody,
                              #   ChoicePanel, DialogueScene
    scene/                    # SceneSky (cielos SVG), SceneStreet (barrio SVG)
    minigame/                 # MinigameShell (wrapper con timer adaptativo)
    reward/                   # RewardPopup (con GSAP confetti)
    chapter/chapter-1/        # 5 componentes de minijuegos del Cap.1
  composables/
    useGameAnimations.ts      # GSAP helpers: popIn, shake, confetti, heartbeat, etc.
  pages/
    index.vue                 # Pantalla de inicio
    registro.vue              # Registro nombre + edad (estilo Kahoot)
    chapter/[chapterId].vue   # Motor del juego (escenas, diálogos, misiones)
  stores/
    useGameStore.ts           # Estado maestro (capítulo, escena, fase)
    usePlayerStore.ts         # Perfil + progreso (nombre, edad, puntos, guardado)
    useDialogueStore.ts       # Cola de diálogos, typewriter, {nombre}, filtro por edad
  data/
    characters/               # Definición de personajes
    chapters/chapter-1/       # Datos del capítulo 1 (diálogos, misiones, escenas)
  shared/types/               # Interfaces TypeScript
  plugins/
    gsap.client.ts            # GSAP plugin (client-only)
  deploy/                     # nginx.conf, ecosystem.config.cjs, DEPLOY.md
```

## Configuración importante (nuxt.config.ts)

- `components: [{ path: '~/components', pathPrefix: false }]` — auto-import sin prefijo de directorio
- `ssr: false` — SPA mode para juego client-side

## Flujo del usuario

```
Home (/) → Registro (/registro) → Capítulo (/chapter/chapter-1)
              ↓                         ↓
        Nombre + Edad            12 escenas secuenciales
        (personaliza timer       (cinemática → diálogos →
         y diálogos)              exploración → 5 misiones →
                                  transformación → resumen → hook)
```

## Sistema de registro y personalización

### Pantalla de registro (`/registro`)
3 pasos estilo Kahoot:
1. Input de nombre (mínimo 2 caracteres)
2. Grid de botones de edad (7-13)
3. Bienvenida con Lila animada

### Personalización por edad

| Edad | Timer | Diálogos | Dificultad |
|------|-------|----------|------------|
| 7-8 | ×1.3 (117s) | Completos | Más tiempo |
| 9 | ×1.15 (103s) | Completos | |
| 10 | ×1.0 (90s) | Completos | Base |
| 11 | ×0.85 (76s) | Compactos | Menos tiempo |
| 12-13 | ×0.75 (67s) | Compactos | Más reto |

### Nombre en diálogos
- `{nombre}` en el texto de diálogos se reemplaza con el nombre del jugador
- Procesado automáticamente en `useDialogueStore.startDialogue()`

### Diálogos compactos (11+ años)
- Líneas con `optional: true` se filtran automáticamente
- Se mantiene la narrativa esencial, se omiten líneas de contexto extra

## Arquitectura del juego

### Escenas visuales
- **SceneSky** (`components/scene/SceneSky.vue`): cielos SVG con nubes, sol con rayos, pájaros, estrellas. Variantes: `hot`, `nice`, `sunset`.
- **SceneStreet** (`components/scene/SceneStreet.vue`): barrio SVG con 6 edificios detallados (techos, ventanas iluminadas, puertas, tiendas), banqueta, calle con línea central, postes de luz. Variantes: `dirty`, `normal`, `clean`.
- Ambos se usan en TODAS las pantallas: home, capítulo, y cada minijuego.

### Personajes

| Personaje | Rol | Color | SVG |
|-----------|-----|-------|-----|
| Lila | Líder | #2d9d5e | Trenzas, diadema verde, chaleco de brigada, badge "G" |
| Timo | Inventor | #f97316 | Goggles, overol azul, cinturón de herramientas, llave |
| Xani | Naturaleza | #8b5cf6 | Pelo largo, flor morada, vestido con hojas, planta |
| Don Toño | Vecino | #8b6f47 | Sombrero, camisa a cuadros, bigote |
| Nube Gris | Antagonista | #6b7280 | Cuerpo de nube flotante, basura flotando |
| Nico | Deportista | #3b82f6 | Jersey #7, headband, balón |
| Vale | Comerciante | #fbbf24 | Delantal amarillo, aretes |

Cada personaje tiene:
- **CharacterFace** (SVG): cara con parpadeo automático, expresiones por emoción, boca que abre/cierra al hablar (180ms toggle)
- **CharacterBody** (SVG): cuerpo completo con ropa, animaciones de brazos (idle swing + gesto al hablar), items en mano
- **DialogueScene**: layout bottom-strip con personaje a la izquierda (28vw) y burbuja a la derecha, scrim oscuro para legibilidad

### Minijuegos
- `MinigameShell` envuelve todos: instrucciones, timer adaptativo, progreso, resultado
- Timer se detiene al completar objetivo (`completed >= total`)
- Timer ajustado por edad con `playerStore.timerMultiplier`
- Display en formato `m:ss` (ej: `1:30`)
- GSAP: heartbeat cuando quedan <10s
- Tipos: drag+tap, tap-detect, placement, pipe-fit

### Botones de acción
- `ActionButton` componente con transiciones GSAP (elastic bounce in, fade out)
- Reemplaza los `v-if` + CSS animation estáticos

### Diálogos
- `useDialogueStore` procesa líneas: reemplaza `{nombre}`, filtra `optional` por edad
- `DialogueScene`: personaje bottom-left, burbuja bottom-right, scrim gradient
- Personaje entra con bounce GSAP al cambiar de speaker
- Boca abre/cierra a 180ms mientras habla

## Agregar un nuevo capítulo

1. Crear `app/data/chapters/chapter-N/` con `index.ts`, `dialogues.ts`, `missions.ts`
2. Usar `{nombre}` en textos de diálogos y `optional: true` en líneas prescindibles
3. Crear componentes de minijuegos en `app/components/chapter/chapter-N/`
4. En `pages/chapter/[chapterId].vue`: importar y registrar en `chapter` computed + `missionComponentMap`
5. Última escena debe ser tipo `'hook'`

## Capítulo 1 — La Calle Caliente

12 escenas, 5 misiones (timers base: 90s, ajustados por edad):

| # | Escena | Tipo | Notas |
|---|--------|------|-------|
| 0 | Cinemática | cinematic | Barrio deteriorado, cielo caliente |
| 1 | Bienvenida | dialogue | "{nombre}! ¡Llegaste justo a tiempo!" + choices |
| 2 | Observación | exploration | 5 spots, todos requeridos |
| 3 | Tutorial | dialogue | EcoKit, nombre del jugador |
| 4 | Limpiar banqueta | mission | Drag+tap: 10 residuos → 4 contenedores |
| 5 | Detectar calor | mission | Tap: 3 superficies calientes de 6 |
| 6 | Plantar sombra | mission | Placement: 4 de 7 spots |
| 7 | Reparar fuga | mission | Pipe-fit: 5 piezas, timer |
| 8 | Recuperar espacio | mission | Placement: 5 elementos |
| 9 | Transformación | transformation | Cielo hot→nice dinámico |
| 10 | Resumen | summary | Recompensas (idempotente) |
| 11 | Gancho | hook | Preview Parque Dormido, cielo sunset |

## Reglas de diseño

- **Alto contraste**: texto `#111827` sobre fondos claros. Texto blanco solo sobre fondos oscuros con `text-shadow`.
- **Glassmorphism**: `var(--glass-bg)` con `backdrop-filter: blur()` y border de vidrio.
- **Botones**: gradientes 3 colores, sombra 3D, hover glow+shimmer, active hundimiento. `@media (hover: none)` para touch.
- **Español mexicano**, tono optimista, nunca moralista. Incluir `{nombre}` del jugador.
- **Touch-first** (mobile). Mínimo 44x44px en áreas tocables.
- **Feedback GSAP**: confetti en éxito, shake en error, heartbeat en timer bajo, elastic bounce en entradas.
- **Fondos SVG detallados**: SceneSky y SceneStreet en todas las pantallas, nunca gradientes planos solos.

## Bugs corregidos (historial)

- Escena hook tipo `dialogue` atrapaba al jugador → tipo `hook`
- 5 spots observación con umbral 4 → corregido a 5
- Timer no reiniciaba al reintentar → `stopTimer()` en `startTimer()`
- Timer bajaba de 2 en 2 → `startTimer()` ahora limpia timer anterior
- Timer no se detenía al completar objetivo → watch `completed >= total`
- Summary recompensas duplicadas → guard `isChapterComplete()`
- Misión 5 sin insignia → "Restaurador del Espacio"
- GameButton `$emit('click')` crasheaba con `.stop` → eliminado emit, click nativo burbujea
- Componentes no resueltos → `pathPrefix: false`
- Contenedores invisibles en minijuegos → `z-index: 5` sobre SceneStreet
- Variables CSS renombradas → refs actualizadas

## Estado actual

- Registro de jugador con personalización por edad
- Capítulo 1 completo y jugable de inicio a fin
- Deploy en guardianes.cercu.com.mx
- Capítulos 2-6 pendientes: El Parque Dormido, La Fuga Infinita, La Ruta de la Basura, Azoteas con Vida, El Gran Festival Verde
