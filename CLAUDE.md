# Guardianes del Barrio Verde

Juego educativo ambiental web para niños de 7-13 años en México.

## Stack

- **Nuxt 4** (SPA mode, `ssr: false`)
- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** (state management)
- **Phaser 3** (motor de minijuegos: canvas con drag & drop nativo, flip tween, particle effects)
- **GSAP** (animaciones UI: confetti DOM, bounce, shake, heartbeat, elastic)
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
  assets/css/main.css           # Design tokens, animaciones, glassmorphism, glow
  components/
    ui/                         # GameButton, ProgressBar, Modal, ActionButton
    hud/                        # GameHud (score, semillas, insignias con GSAP bounce)
    dialogue/                   # DialogueBox, CharacterPortrait, CharacterFace, CharacterBody,
                                #   ChoicePanel, DialogueScene
    scene/                      # SceneSky (cielos SVG), SceneStreet (barrio SVG)
    minigame/                   # MinigameShell (wrapper con timer adaptativo)
    reward/                     # RewardPopup (con GSAP confetti)
    chapter/chapter-1/          # 5 minijuegos Vue + 5 Phaser wrappers (*Phaser.vue)
    chapter/chapter-2/          # 5 minijuegos Vue + 5 Phaser wrappers (*Phaser.vue)
    chapter/chapter-3/          # 3 minijuegos Vue + 3 Phaser wrappers (*Phaser.vue)
  composables/
    useGameAnimations.ts        # GSAP helpers: popIn, shake, confetti, heartbeat, etc.
    usePhaserGame.ts            # Monta/destruye Phaser en lifecycle Vue (lazy import)
  phaser/
    types.ts                    # MinigameBridge, DragItemConfig, DropZoneConfig, etc.
    BaseMinigameScene.ts        # Scene base con bridge + emoji helpers + animaciones
    PhaserCanvas.vue            # Wrapper <div> que monta Phaser game con usePhaserGame
    mechanics/
      DragDropMechanic.ts       # Drag & drop reutilizable con zonas y hit detection
      MemoramaMechanic.ts       # Grid de cartas con flip tween (scaleX), Fisher-Yates shuffle
      TapPlacementMechanic.ts   # Seleccionar ítem de tray + tocar zona para colocar
    effects/
      ConfettiEmitter.ts        # Partículas emoji de celebración (burst central + posicional)
    scenes/
      chapter-1/                # SidewalkCleanupScene, HeatDetectorScene, ShadePlanterScene,
                                #   LeakFixerScene, SpaceRestorerScene
      chapter-2/                # PathClearScene, SoilMemoryScene, WaterDragDropScene,
                                #   WildlifeMemoryScene, ParkDragRestoreScene
      chapter-3/                # FloodDragClearScene, WetlandMemoryScene, PipeDragFitScene
  pages/
    index.vue                   # Pantalla de inicio
    registro.vue                # Registro nombre + edad (estilo Kahoot)
    capitulos.vue               # Selector de capítulos (todos desbloqueados)
    chapter/[chapterId].vue     # Motor del juego (escenas, diálogos, misiones, toggle Phaser)
    dev.vue                     # Catálogo dev (solo localhost): personajes, animaciones, capítulos
  stores/
    useGameStore.ts             # Estado maestro (capítulo, escena, fase)
    usePlayerStore.ts           # Perfil + progreso (nombre, edad, puntos, guardado)
    useDialogueStore.ts         # Cola de diálogos, typewriter, {nombre}, filtro por edad
  data/
    characters/                 # Definición de personajes (8 personajes)
    chapters/chapter-1/         # Datos del capítulo 1 (diálogos, misiones, escenas)
    chapters/chapter-2/         # Datos del capítulo 2 (diálogos, misiones, escenas)
    chapters/chapter-3/         # Datos del capítulo 3 (diálogos, misiones, escenas)
  shared/types/                 # Interfaces TypeScript (mission, chapter, character, game-state)
  plugins/
    gsap.client.ts              # GSAP plugin (client-only)
    phaser.client.ts            # Phaser safety net (client-only)
  deploy/                       # nginx.conf, ecosystem.config.cjs, DEPLOY.md
```

## Configuración importante (nuxt.config.ts)

- `components: [{ path: '~/components', pathPrefix: false }]` — auto-import sin prefijo de directorio
- `ssr: false` — SPA mode para juego client-side

## Flujo del usuario

```
Home (/) → Registro (/registro) → Capítulos (/capitulos) → Capítulo (/chapter/chapter-N)
              ↓                         ↓                         ↓
        Nombre + Edad            Todos los capítulos        Escenas secuenciales
        (personaliza timer       disponibles para           (cinemática → diálogos →
         y diálogos)              elegir libremente          exploración → misiones →
                                                            transformación → resumen → hook)

Post-capítulo:
  Hook → navega al siguiente capítulo en orden
  Si es el último → busca el primer capítulo no completado (wrap-around)
  Si todos completos → botón "Ver capítulos" con reflexión y agradecimiento
```

## Sistema de registro y personalización

### Pantalla de registro (`/registro`)
3 pasos estilo Kahoot:
1. Input de nombre (mínimo 2 caracteres)
2. Grid de botones de edad (7-13)
3. Bienvenida con Lila animada → redirige a `/capitulos`

### Selector de capítulos (`/capitulos`)
- Muestra todos los capítulos — **todos desbloqueados**, el jugador elige libremente
- Marca capítulos completados con ✅
- Si todos están completos: muestra mensaje de reflexión y agradecimiento con stats del jugador

### Navegación post-capítulo
- Al terminar un capítulo (escena hook): botón navega al **siguiente capítulo en orden**
- Si estás en el **último capítulo**: navega al **primer capítulo no completado** (wrap-around)
- Si **todos están completos**: botón "Ver capítulos" → muestra reflexión final

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

### Arquitectura híbrida Vue + Phaser

```
┌──────────────────────────────────────────┐
│  Vue (z-index alto) — NO CAMBIA         │
│  ├─ MinigameShell (timer, instrucciones) │
│  ├─ Feedback toast (glassmorphism)       │
│  ├─ DialogueScene, HUD, menús           │
│  └─ SceneSky + SceneStreet (SVG fondo)  │
├──────────────────────────────────────────┤
│  Phaser Canvas (transparent, z-index 5)  │
│  ├─ Emoji game objects (draggable)       │
│  ├─ Drop zones con detección nativa      │
│  ├─ Card flip tweens (memorama)          │
│  ├─ Particle emitters (confetti)         │
│  └─ Camera shake                         │
├──────────────────────────────────────────┤
│  Event Bridge (callbacks Vue ↔ Phaser)   │
│  ├─ onItemCompleted → completed count    │
│  ├─ onFeedback → toast overlay           │
│  └─ onAllCompleted → result modal        │
└──────────────────────────────────────────┘
```

- **`USE_PHASER` flag** en `[chapterId].vue` — `true` usa Phaser, `false` usa Vue originales
- **Lazy import**: `defineAsyncComponent(() => import(...))` mantiene Phaser (~333KB gzip) fuera del bundle inicial
- **Canvas transparente**: fondos SVG (SceneSky + SceneStreet) se renderizan debajo en Vue
- **Event bridge**: Phaser scene → `MinigameBridge` callbacks → Vue refs (no Pinia directo en Phaser)
- **Cleanup**: `usePhaserGame` destruye el game en `onUnmounted`
- **Emoji como assets**: `Phaser.GameObjects.Text` con emoji, no spritesheets

### Componentes clave de Phaser

| Archivo | Propósito |
|---------|-----------|
| `usePhaserGame.ts` | Composable: monta/destruye Phaser, lazy import, resize |
| `BaseMinigameScene.ts` | Scene base: bridge, createEmoji, createLabel, celebrateItem, shakeItem, cameraShake |
| `PhaserCanvas.vue` | Wrapper Vue: `<div ref>`, pasa bridge al scene |
| `DragDropMechanic.ts` | Crea items arrastrables + drop zones, gestiona eventos drag nativo Phaser |
| `MemoramaMechanic.ts` | Grid de cartas, flip con `scaleX` tween, Fisher-Yates shuffle, match detection |
| `TapPlacementMechanic.ts` | Tray de selección + zonas de colocación con pulse animation |
| `ConfettiEmitter.ts` | Burst de emojis con tweens radiales (central + posicional) |

### Patrón de cada minijuego Phaser

1. **Scene** (`app/phaser/scenes/chapter-N/XxxScene.ts`): extiende `BaseMinigameScene`, usa mecánica reutilizable, llama callbacks del bridge
2. **Wrapper** (`app/components/chapter/chapter-N/XxxPhaser.vue`): `MinigameShell` + `SceneSky` + `SceneStreet` + `PhaserCanvas` + feedback toast Vue
3. **[chapterId].vue**: `defineAsyncComponent(() => import(...))` en `missionComponentMap` con ternario `USE_PHASER`

### Escenas visuales
- **SceneSky** (`components/scene/SceneSky.vue`): cielos SVG con nubes, sol con rayos, pájaros, estrellas. Variantes: `hot`, `nice`, `sunset`.
- **SceneStreet** (`components/scene/SceneStreet.vue`): barrio SVG con 6 edificios detallados (techos, ventanas iluminadas, puertas, tiendas), banqueta, calle con línea central, postes de luz. Variantes: `dirty`, `normal`, `clean`.
- Ambos se usan en TODAS las pantallas: home, capítulo, y cada minijuego (debajo del canvas Phaser).

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
| Bolillo | Perrito del barrio | #c89850 | Mestizo beige, ojos chicos con párpados pesados, hocico prominente, orejas semi-caídas asimétricas, paliacate rojo en pecho, placa "B", brazos animados, cola expresiva |

Cada personaje tiene:
- **CharacterFace** (SVG): cara con parpadeo automático, expresiones por emoción, boca que abre/cierra al hablar (180ms toggle)
- **CharacterBody** (SVG): cuerpo completo con ropa, animaciones de brazos (idle swing + gesto al hablar), items en mano
- **DialogueScene**: layout bottom-strip con personaje a la izquierda (28vw) y burbuja a la derecha, scrim oscuro para legibilidad

**Bolillo** (vibra Cheempe — perro mestizo mexicano noble y memeable):
- **Cara**: elipse `rx=33 ry=30` en `#c89850` (beige arenoso). Hocico prominente `rx=16 ry=13` con philtrum. Ojos pequeños `rx=4 ry=4` con párpados rellenos (fur-color ellipses que cubren ~35% superior, asimétricos: derecho más pesado). Boca ω amigable mínima. Orejas semi-caídas triangulares suaves, nacen de los lados, asimetría (derecha con fold). Mancha oscura sutil en ojo derecho.
- **Cuerpo**: torso horizontal `rx=26 ry=17` (sentado, no bípedo). Brazos animados (`arm-left`/`arm-right` con idle sway + gesture). Patas cortas con deditos. Paliacate rojo + placa "B" sobre el pecho. Cola curva con wagging al hablar.
- **foreignObject**: `y=26` (solo Bolillo — más abajo que humanos `y=20` para unir cabeza a cuerpo).
- **Expresión default**: sonrisa ω suave, amigable. Párpados pesados dan calma natural.
- **Narrativa Cap. 2**: no habla en escenas 0-1 y misión 1 (Xani interpreta). **A partir de misión 2 habla directamente** como narrador. Arco emocional: escondido → curioso → se acerca → bebe agua → mueve cola → echado tranquilo. Representa a los animales callejeros del barrio.
- **Paleta**: `#c89850` (pelaje), `#d8b878`/`#dcc080`/`#e0c488` (crema claro), `#a07028` (sombras), `#dc2626` (paliacate), `#fbbf24` (placa).

### Mecánicas de minijuegos

| Mecánica | Implementación Phaser | Implementación Vue (fallback) | Capítulos |
|----------|----------------------|-------------------------------|-----------|
| **Drag & drop** | `DragDropMechanic.ts` — drag nativo Phaser, drop zones con `getBounds()` | Pointer events, `position: fixed`, `elementsFromPoint()` | Cap. 1, 2, 3 |
| **Memorama** | `MemoramaMechanic.ts` — flip con `scaleX` tween (mejor en Android) | CSS 3D flip `rotateY(180deg)`, `backface-visibility` | Cap. 2, 3 |
| **Tap-detect** | Custom en scene — containers interactivos con `pointerdown` | Click handlers en divs posicionados | Cap. 1 |
| **Placement** | `TapPlacementMechanic.ts` — tray + zones con pulse | Botones en tray + divs posicionados con click | Cap. 1 |
| **Pipe-fit** | `DragDropMechanic.ts` con piezas trampa + type matching | Select + tap en grid (variante de placement) | Cap. 1, 3 |

Todas las mecánicas son de **dominio público** (sin copyright).

### MinigameShell
- `MinigameShell` envuelve todos los minijuegos (Vue y Phaser): instrucciones, timer adaptativo, progreso, resultado
- Timer se detiene al completar objetivo (`completed >= total`)
- Timer ajustado por edad con `playerStore.timerMultiplier`
- Display en formato `m:ss` (ej: `1:30`)
- GSAP: heartbeat cuando quedan <10s
- Tipos de misión: `drag-drop`, `tap-detect`, `placement`, `pipe-fit`, `scenario-choice`, `observation`, `memorama`

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
3. Crear componentes de minijuegos:
   - **Phaser scenes** en `app/phaser/scenes/chapter-N/` (extiende `BaseMinigameScene`, usa mecánicas reutilizables)
   - **Vue wrappers** en `app/components/chapter/chapter-N/` (`*Phaser.vue`: MinigameShell + PhaserCanvas + feedback)
   - (Opcional) **Vue fallback** en `app/components/chapter/chapter-N/` (sin Phaser, pointer events)
4. En `pages/chapter/[chapterId].vue`:
   - Importar datos (`chapterN`, `chapterNDialogues`, `chapterNMissions`)
   - Importar componentes Vue fallback
   - Agregar `defineAsyncComponent(() => import(...))` para wrappers Phaser
   - Agregar a `chapter` computed, `chapterDialogues`, `chapterMissions`
   - Agregar misiones a `missionComponentMap` (con ternario `USE_PHASER`) y `missionIconMap`
   - Agregar datos específicos a `transformEmojis`, `summaryData`, `hookData`/`chapterMeta`, `cinematicFloats`
   - Si tiene exploración: agregar spots en `defaultSpots`
5. En `pages/capitulos.vue`: agregar entrada en `allChapters`
6. En `[chapterId].vue`: agregar al array `chapterOrder` para navegación post-hook
7. Última escena debe ser tipo `'hook'`

## Capítulo 1 — La Calle Caliente

13 escenas, 6 misiones (timers base: 90s, ajustados por edad).
Tema: calor urbano, limpieza, sombra, fugas, recuperación del espacio, techos verdes (ref. CIIEMAD/IPN).

| # | Escena | Tipo | Componente Vue | Mecánica | Notas |
|---|--------|------|----------------|----------|-------|
| 0 | Cinemática | cinematic | — | — | Barrio deteriorado |
| 1 | Bienvenida | dialogue | — | — | "{nombre}! ¡Llegaste!" |
| 2 | Observación | exploration | — | tap (5 spots) | Todos requeridos |
| 3 | Tutorial | dialogue | — | — | EcoKit |
| 4 | Limpiar banqueta | mission | `SidewalkCleanup` | drag (10→4 bins) | 90s timer |
| 5 | Detectar calor | mission | `HeatDetector` | tap (3 hot de 6) | Sin timer |
| 6 | Plantar sombra | mission | `ShadePlanter` | tap (4 de 7 slots, 6 semillas) | Sin timer |
| 7 | Reparar fuga | mission | `LeakFixer` | pipe-fit (5 piezas) | 45s timer |
| 8 | Recuperar espacio | mission | `SpaceRestorer` | placement (5 soluciones + 2 distractores) | Urbanismo táctico |
| 9 | Techo verde | mission | `GreenRoofBuilder` | placement (5 capas + 3 distractores, shuffle) | Ref. CIIEMAD/IPN |
| 10 | Transformación | transformation | — | — | Cielo hot→nice |
| 11 | Resumen | summary | — | — | Recompensas |
| 12 | Gancho | hook | — | — | → Cap. 2 |

Recompensa: 50 pts, "Guardián de la Calle Caliente".

### Misión 8: Recuperar el espacio (urbanismo táctico)
- Zonas con PROBLEMAS: "Esquina oscura", "Pared vacía", "Nadie se detiene", "Basura en el piso", "Sol directo"
- 7 items: 5 soluciones correctas (luminaria, mural, banca, contenedor, jardinera) + 2 distractores (carpa de circo, alberca inflable)
- Feedback educativo: cada acierto explica POR QUÉ esa solución funciona
- Distractores se rechazan con explicación

### Misión 9: Techo verde (referencia CIIEMAD/Instituto Politécnico Nacional)
- El jugador arma un techo verde colocando **5 capas en orden**: impermeabilizante → drenaje → filtro → sustrato → plantas nativas
- 8 items shuffled: 5 correctos + **3 distractores** (cemento, pintura verde, plástico) con feedback educativo
- Diálogos mencionan al **CIIEMAD del Instituto Politécnico Nacional** como referencia real
- Datos: baja temperatura 15%, absorbe lluvia, da hogar a polinizadores
- Insignia: "Arquitecto Verde"

## Capítulo 2 — El Parque Dormido

12 escenas, 5 misiones. Narrado por **Bolillo** (Xani interpreta).
Tema: parques, biodiversidad, suelo, riego, animales callejeros, comunidad.

| # | Escena | Tipo | Componente Vue | Scene Phaser | Mecánica |
|---|--------|------|----------------|--------------|----------|
| 0 | Cinemática | cinematic | — | — | — |
| 1 | Llegada | dialogue | — | — | — |
| 2 | Diagnóstico | exploration | — | — | tap (5 spots) |
| 3 | Tutorial | dialogue | — | — | — |
| 4 | Despejar senderos | mission | `PathClear` | `PathClearScene` | drag (6→zona limpieza) |
| 5 | Cuidar el suelo | mission | `SoilMemory` | `SoilMemoryScene` | memorama (4 parejas) |
| 6 | Regar con estrategia | mission | `WaterDragDrop` | `WaterDragDropScene` | drag (6 gotas→plantas) |
| 7 | Vida en el parque | mission | `WildlifeMemory` | `WildlifeMemoryScene` | memorama (4 parejas) |
| 8 | Reactivar parque | mission | `ParkDragRestore` | `ParkDragRestoreScene` | drag (5→zonas) |
| 9 | Transformación | transformation | — | — | — |
| 10 | Resumen | summary | — | — | — |
| 11 | Gancho | hook | — | — | → Cap. 3 |

Recompensa: 60 pts, "Guardián del Parque Dormido".

### Bolillo como narrador
- **Escenas 0-1 y Misión 1**: Bolillo NO habla. Xani interpreta su lenguaje corporal.
- **A partir de Misión 2**: Bolillo **habla directamente** (`speaker: 'bolillo'`). Narra la historia, explica la problemática, guía al jugador.
- Arco emocional: escondido/asustado → curioso → se acerca → bebe agua → mueve cola → echado tranquilo
- Reflexión sobre animales callejeros: plato de agua, no forzar contacto, gruñido ≠ agresión, pedir ayuda a adulto
- Spot de exploración: "Bolillo escondido" como punto de observación
- Misión 3: "plato para Bolillo" como zona válida de riego
- Misión 4: par Bolillo↔agua y sombra en memorama
- Villanos (Nube Gris) siguen interviniendo con sus comentarios

### Personajes que brillan
Xani (ecología + animales), Nico (espacio público), Don Toño (memoria del barrio), Bolillo (hilo narrativo).

## Capítulo 3 — La Fuga Infinita

8 escenas, 3 misiones (capítulo corto, 12-18 min).
Tema: desperdicio de agua, humedales urbanos, biodiversidad acuática, reparación.

| # | Escena | Tipo | Componente Vue | Scene Phaser | Mecánica |
|---|--------|------|----------------|--------------|----------|
| 0 | Cinemática | cinematic | — | — | — |
| 1 | Descubrimiento | dialogue | — | — | — |
| 2 | Controlar desperdicio | mission | `FloodDragClear` | `FloodDragClearScene` | drag (5→zona segura) |
| 3 | Proteger humedal | mission | `WetlandMemory` | `WetlandMemoryScene` | memorama (4 parejas) |
| 4 | Reparar tubería | mission | `PipeDragFit` | `PipeDragFitScene` | drag (4+2 trampa→slots) |
| 5 | Transformación | transformation | — | — | — |
| 6 | Resumen | summary | — | — | — |
| 7 | Gancho | hook | — | — | → Cap. 4 |

Recompensa: 50 pts, "Guardián de la Fuga Infinita".

Concepto educativo clave: "Un humedal es donde el agua y la tierra se encuentran. Puede guardar agua, filtrarla y dar hogar a plantas, aves e insectos." Presentado como "el rincón húmedo del barrio".

Personajes que brillan: Timo (reparaciones), Xani (humedales y biodiversidad).

## Reglas de diseño

- **Alto contraste**: texto `#111827` sobre fondos claros. Texto blanco solo sobre fondos oscuros con `text-shadow`.
- **Glassmorphism**: `var(--glass-bg)` con `backdrop-filter: blur()` y border de vidrio.
- **Botones**: gradientes 3 colores, sombra 3D, hover glow+shimmer, active hundimiento. `@media (hover: none)` para touch.
- **Español mexicano**, tono optimista, nunca moralista. Incluir `{nombre}` del jugador.
- **Touch-first** (mobile). Mínimo 44x44px en áreas tocables. `touch-action: none` en drag & drop.
- **Feedback**: Phaser tweens para game objects (celebrate, shake, confetti particles). GSAP para UI Vue (heartbeat timer, bounce entries).
- **Fondos SVG detallados**: SceneSky y SceneStreet en todas las pantallas, nunca gradientes planos solos. Se renderizan debajo del canvas Phaser.
- **Phaser drag & drop**: drag nativo Phaser con `setInteractive({ draggable: true })`, drop zones con `getBounds().contains()`, bounce back con `Back.easeOut`.
- **Phaser memorama**: flip con `scaleX` tween (0→1), mejor que CSS `rotateY` en Android. Fisher-Yates shuffle, max 2 cartas, lock board.
- **Catálogo dev** (`/dev`): solo visible en localhost. Muestra personajes con emociones/animaciones, capítulos con escenas, misiones con botón "▶ Jugar" para probar cada minijuego individualmente (overlay fullscreen con Teleport), y mecánicas. Usa `position: fixed` + `overflow-y: scroll`.

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
- Selector de capítulos (`/capitulos`) — todos desbloqueados, el jugador elige libremente
- Capítulo 1 "La Calle Caliente" completo y jugable (6 misiones: drag, tap, placement, pipe-fit, urbanismo táctico, techo verde)
- Capítulo 2 "El Parque Dormido" completo y jugable (5 misiones: drag & drop + memorama, Bolillo narra)
- Capítulo 3 "La Fuga Infinita" completo y jugable (3 misiones: drag & drop + memorama, humedales)
- **14 minijuegos** en total, 8 personajes, 3 mecánicas principales
- **Integración Phaser.js**: 13 scenes + wrappers creados. Actualmente `USE_PHASER = false` (componentes Vue activos). Toggle en `[chapterId].vue`.
- Navegación post-capítulo: hook → siguiente capítulo → wrap-around al primero incompleto → selector si todos completos
- Reflexión y agradecimiento cuando todos los capítulos están completos
- **Catálogo dev** (`/dev`): personajes, animaciones, capítulos, mecánicas + **jugar cada minijuego individualmente** con botón "▶ Jugar"
- Deploy en guardianes.cercu.com.mx
- Capítulos 4-6 pendientes: La Ruta de la Basura, Azoteas con Vida, El Gran Festival Verde
