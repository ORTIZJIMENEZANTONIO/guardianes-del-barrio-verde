# Guardianes del Barrio Verde

Juego educativo ambiental web para niños de 8-12 años en México.

## Stack

- **Nuxt 4** (SPA mode, `ssr: false`)
- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** (state management)
- **TypeScript**
- CSS puro con custom properties (sin Tailwind). Design system con glassmorphism, glow effects, spring animations.
- Fuente: Nunito (Google Fonts, pesos 400-900)

## Comandos

```bash
npm run dev       # Dev server
npm run build     # Build producción
npm run preview   # Preview del build
```

## Estructura del proyecto

```
app/
  assets/css/main.css      # Design tokens, animaciones, glassmorphism, glow effects
  components/
    ui/                    # GameButton, ProgressBar, Modal
    hud/                   # GameHud (score, semillas, insignias)
    dialogue/              # DialogueBox, CharacterPortrait, CharacterFace, ChoicePanel, DialogueScene
    minigame/              # MinigameShell (wrapper para todos los minijuegos)
    reward/                # RewardPopup
    chapter/chapter-1/     # 5 componentes de minijuegos del Cap.1
  pages/
    index.vue              # Pantalla de inicio
    chapter/[chapterId].vue # Motor del juego (escenas, diálogos, misiones, transiciones)
  stores/
    useGameStore.ts        # Estado maestro (capítulo, escena, fase)
    usePlayerStore.ts      # Progreso (puntos, semillas, insignias, localStorage)
    useDialogueStore.ts    # Cola de diálogos, typewriter, choices
  data/
    characters/            # Definición de personajes (id, color, emoji, personality)
    chapters/chapter-1/    # Datos del capítulo 1 (diálogos, misiones, config de escenas)
  shared/types/            # Interfaces TypeScript (character, chapter, mission, game-state)
```

## Configuración importante (nuxt.config.ts)

- `components: [{ path: '~/components', pathPrefix: false }]` — auto-import sin prefijo de directorio. `GameButton` en vez de `UiGameButton`.
- `ssr: false` — SPA mode para juego client-side.

## Arquitectura del juego

### Flujo de escenas
- El motor del juego vive en `pages/chapter/[chapterId].vue`
- Cada capítulo define sus escenas en `data/chapters/chapter-N/index.ts`
- Las escenas se recorren secuencialmente con `gameStore.currentSceneIndex`
- `startSceneDialogue()` inicializa cada escena según su tipo
- `advanceScene()` avanza al siguiente índice (con guard: si es la última escena, va al menú)

### Tipos de escena (SceneType)
- `cinematic` — intro con cielo, ciudad en capas, elementos flotantes
- `dialogue` — diálogo con personajes sobre fondo de barrio
- `exploration` — escena interactiva con spots tocables (observación)
- `mission` — fases: intro → playing (minijuego) → success (diálogo + reward)
- `transformation` — antes/después visual con animación
- `summary` — resumen del capítulo, recompensas (idempotente, no duplica rewards)
- `hook` — gancho al siguiente capítulo con "Volver al inicio"

### Minijuegos
- Cada minijuego es un componente Vue que emite `@complete`
- `MinigameShell` envuelve todos: instrucciones, timer, progreso, resultado
- El timer se reinicia automáticamente al reintentar (watch en `showResult`)
- Tipos de mecánica: tap-select (seleccionar+contenedor), tap-detect, placement, pipe-fit

### Diálogos
- `useDialogueStore` maneja cola, typewriter, choices
- `DialogueScene` orquesta portrait + box + choices
- Las choices avanzan automáticamente la línea tras selección
- No iniciar diálogos mientras otro está activo

### Personajes con caras SVG
- `CharacterFace.vue` — caras SVG únicas para cada personaje
- Parpadeo automático cada 3-5 segundos
- Expresiones reactivas según `emotion`: cejas, boca y pupilas cambian
- Emotions: neutral, happy, sad, excited, angry, worried, thinking, surprised, proud, mischievous

## Agregar un nuevo capítulo

1. Crear `app/data/chapters/chapter-N/` con:
   - `index.ts` — config del capítulo, lista de escenas con tipos y IDs
   - `dialogues.ts` — pools de diálogos para cada escena/misión
   - `missions.ts` — configuración de cada misión (tipo, objetivos, recompensas)
2. Crear componentes de minijuegos en `app/components/chapter/chapter-N/`
3. En `pages/chapter/[chapterId].vue`:
   - Importar datos del capítulo y misiones
   - Importar componentes de minijuegos
   - Agregar al `missionComponentMap` y al computed de `chapter`
4. La última escena debe ser tipo `'hook'` para mostrar preview del siguiente capítulo

## Capítulo 1 — La Calle Caliente

12 escenas, 5 misiones:

| # | Escena | Tipo | Notas |
|---|--------|------|-------|
| 0 | Cinemática | cinematic | Intro del barrio deteriorado |
| 1 | Bienvenida | dialogue | Choices para unirse a la brigada |
| 2 | Observación | exploration | 5 spots tocables, todos requeridos |
| 3 | Tutorial | dialogue | Entrega del EcoKit |
| 4 | Limpiar banqueta | mission | Tap-select: residuo → contenedor |
| 5 | Detectar calor | mission | Tap: encontrar 3 superficies calientes |
| 6 | Plantar sombra | mission | Placement: 4 árboles en 7 spots (4 válidos, 3 inválidos) |
| 7 | Reparar fuga | mission | Pipe-fit: 5 piezas en tubería, timer 45s |
| 8 | Recuperar espacio | mission | Placement: 5 elementos con feedback |
| 9 | Transformación | transformation | Antes/después con diálogo de cierre |
| 10 | Resumen | summary | Recompensas del capítulo (idempotente) |
| 11 | Gancho | hook | Preview del Parque Dormido, volver al menú |

## Personajes

| Personaje | Rol | Color | Cara SVG |
|-----------|-----|-------|----------|
| Lila | Líder de brigada | #2d9d5e | Trenzas, diadema verde, piel morena |
| Timo | Inventor | #f97316 | Pelo despeinado, goggles, pecas |
| Xani | Naturaleza | #8b5cf6 | Pelo largo oscuro, flor morada |
| Don Toño | Vecino | #8b6f47 | Sombrero, bigote, cejas pobladas |
| Nube Gris | Antagonista | #6b7280 | Forma de nube, cara pícara |
| Nico | Deportista | #3b82f6 | Headband azul |
| Vale | Comerciante | #fbbf24 | Pañoleta amarilla, aretes |

## Reglas de diseño

- **Alto contraste**: texto `#111827` sobre fondos claros. Texto blanco solo sobre fondos oscuros con `text-shadow`. Fondos interactivos con opacidad mínima 0.7.
- **Glassmorphism**: `var(--glass-bg)` / `var(--glass-bg-strong)` con `backdrop-filter: blur()` y border de vidrio.
- **Botones visibles**: gradientes de 3 colores, sombra 3D con `box-shadow`, hover con glow + shimmer + translate, active con hundimiento. Touch devices: hover deshabilitado con `@media (hover: none)`.
- **Español mexicano**, tono optimista, nunca moralista.
- **Touch-first** (mobile). Mínimo 44x44px en áreas tocables. Tap-select en vez de drag-and-drop.
- **Feedback inmediato**: partículas en éxito, ping en elementos interactivos, shake en errores.

## Bugs corregidos (historial)

- Escena hook tipo `dialogue` atrapaba al jugador al final → cambiado a tipo `hook`
- 5 spots de observación con umbral de 4 → umbral corregido a 5
- Timer no reiniciaba al reintentar minijuegos → watcher en `showResult` reinicia timer
- Summary otorgaba recompensas duplicadas → guard con `isChapterComplete()`
- Misión 5 sin insignia → agregada "Restaurador del Espacio"
- Componentes `GameButton`/`Modal` no resueltos → `pathPrefix: false` en nuxt.config
- Variables CSS `--border-radius` renombradas a `--radius-md` → refs actualizadas

## Estado actual

- Capítulo 1 completo y jugable de inicio a fin
- Capítulos 2-6 pendientes: El Parque Dormido, La Fuga Infinita, La Ruta de la Basura, Azoteas con Vida, El Gran Festival Verde
