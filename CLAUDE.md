# Guardianes del Barrio Verde

Juego educativo ambiental web para niños de 7-13 años en México.

## Stack

- **Nuxt 4** (SPA mode, `ssr: false`)
- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** (state management)
- **Phaser 3** (motor de minijuegos — scenes + wrappers creados, actualmente `USE_PHASER = false`)
- **GSAP** (animaciones UI: confetti, bounce, shake, heartbeat, elastic)
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
    ui/                         # GameButton, ProgressBar, Modal, ActionButton, PlayerAvatar
    hud/                        # GameHud (score, semillas, insignias, barra progreso, avatar)
    dialogue/                   # DialogueBox, CharacterPortrait, CharacterFace, CharacterBody,
                                #   ChoicePanel, DialogueScene
    scene/                      # SceneSky (cielos SVG), SceneStreet (barrio SVG)
    minigame/                   # MinigameShell (wrapper con timer adaptativo, z-index 100 overlays)
    reward/                     # RewardPopup (con GSAP confetti)
    phaser/                     # PhaserCanvas (wrapper Phaser, auto-import Nuxt)
    chapter/chapter-1/          # 5 minijuegos + Phaser wrappers
    chapter/chapter-2/          # 6 minijuegos + Phaser wrappers
    chapter/chapter-3/          # 3 minijuegos + Phaser wrappers
    chapter/chapter-4/          # 5 minijuegos (La Ruta de la Basura)
    chapter/chapter-5/          # 5 minijuegos (Azoteas con Vida)
    chapter/chapter-6/          # 4 minijuegos (El Gran Festival Verde)
  composables/
    useGameAnimations.ts        # GSAP helpers: popIn, shake, confetti, heartbeat, etc.
    usePhaserGame.ts            # Monta/destruye Phaser en lifecycle Vue (lazy import)
  phaser/                       # Phaser scenes, mechanics, effects (USE_PHASER = false por ahora)
  pages/
    index.vue                   # Pantalla de inicio
    registro.vue                # Registro: nombre + edad + avatar (4 pasos)
    capitulos.vue               # Selector de 6 capítulos (todos desbloqueados)
    chapter/[chapterId].vue     # Motor del juego
    dev.vue                     # Catálogo dev con "▶ Jugar" por minijuego
  stores/
    useGameStore.ts             # Estado maestro (capítulo, escena, fase)
    usePlayerStore.ts           # Perfil + progreso + avatar (nombre, edad, skin/hair/accessory)
    useDialogueStore.ts         # Cola de diálogos, typewriter, {nombre}, filtro por edad
  data/
    characters/                 # 8 personajes
    chapters/chapter-1/ a chapter-6/  # Datos de 6 capítulos (index, dialogues, missions)
  shared/types/                 # Interfaces TypeScript
```

## Flujo del usuario

```
Home → Registro (nombre + edad + avatar) → Capítulos → Capítulo
         4 pasos                            6 caps       Escenas secuenciales
                                            desbloqueados  (cinemática → diálogos → exploración →
                                                            misiones → transformación → resumen → hook)
```

## Sistema de registro y personalización

### Registro (`/registro`) — 4 pasos
1. Nombre (mín. 2 caracteres)
2. Edad (7-13)
3. **Avatar** (tono de piel × 3, pelo × 4, accesorio × 3 + ninguno)
4. Bienvenida con Lila → `/capitulos`

### Avatar (PlayerAvatar)
- SVG component con `size` prop
- 3 tonos de piel, 4 estilos de pelo, 3 accesorios (gorra, lentes, moño)
- Visible en el **GameHud** junto al título del capítulo
- Guardado en playerStore (`avatarSkin`, `avatarHair`, `avatarAccessory`)
- `spendSeeds(amount)` action para futura tienda

### Personalización por edad

| Edad | Timer | Diálogos |
|------|-------|----------|
| 7-8 | ×1.3 | Completos |
| 9 | ×1.15 | Completos |
| 10 | ×1.0 | Completos |
| 11 | ×0.85 | Compactos |
| 12-13 | ×0.75 | Compactos |

## Mejoras de UX implementadas

- **Inicio acortado**: Cap.1 cinemática 2 líneas + bienvenida con choices (antes 4 escenas)
- **Opciones negativas**: "¿Te unes?" → "¡Sí!" / "Mmm, no sé..." / "¿Y si mejor no?" + convencimiento con factos
- **Exploración con scroll horizontal**: calle 2x más ancha, spots sin label (descubrimiento), spots falsos, hint "→ Desliza"
- **Preview de recompensa**: antes de cada misión se muestra "🌿 20pts 🏅 Badge"
- **Misión fuga sorpresa**: Cap.1 misión 4 se presenta como evento inesperado
- **Barra de progreso en HUD**: dots 🟢🟢⚪⚪ muestran avance del capítulo
- **Celebración visual progresiva**: emojis aparecen entre misiones (🌱→🌸→🦋→🌳→👨‍👩‍👧)
- **ShadePlanter drag & drop**: arrastrar árboles en vez de tap

## Capítulo 1 — La Calle Caliente

11 escenas, 5 misiones. Tema: calor urbano, limpieza, sombra, fugas, espacio público.

| # | Escena | Componente | Mecánica |
|---|--------|------------|----------|
| 0 | Cinemática | — | — |
| 1 | Bienvenida + choices | — | — |
| 2 | Exploración (scroll) | — | tap (5+2 spots falsos) |
| 3 | Limpiar banqueta | `SidewalkCleanup` | drag (10→4 bins, 90s) |
| 4 | Detectar calor | `HeatDetector` | tap-detect (3 hot de 6) |
| 5 | Plantar sombra | `ShadePlanter` | drag (6 árboles→7 zonas) |
| 6 | Reparar fuga (sorpresa) | `LeakFixer` | pipe-fit SVG (5 huecos, 45s) |
| 7 | Recuperar espacio | `SpaceRestorer` | placement (5+2 distractores, urbanismo táctico) |
| 8-10 | Transformación → Resumen → Hook | — | — |

Recompensa: 50 pts, "Guardián de la Calle Caliente".

## Capítulo 2 — El Parque Dormido

13 escenas, 6 misiones. Narrado por **Bolillo**.

| # | Misión | Componente | Mecánica |
|---|--------|------------|----------|
| 1 | Despejar senderos | `PathClear` | drag (6→zona limpieza, 90s) |
| 2 | Cuidar el suelo | `SoilMemory` | memorama (4 parejas) |
| 3 | Regar con estrategia | `WaterDragDrop` | drag (6 gotas→plantas, 90s) |
| 4 | Vida en el parque | `WildlifeMemory` | memorama (4 parejas, incluye Bolillo) |
| 5 | Reactivar parque | `ParkDragRestore` | drag (5→zonas) |
| 6 | **Ruta de Bolillo** | `BolilloRoute` | placement (5 necesidades + 2 distractores: chocolate, perseguir) |

Recompensa: 60 pts, "Guardián del Parque Dormido".

### Bolillo como narrador
- Escenas 0-1: no habla (Xani interpreta)
- A partir de misión 2: habla directamente
- Ruta de Bolillo: agua → sombra → comida → cama → compañía. Enseña respeto animal: no chocolate (tóxico), no perseguir, dejar que se acerque.

## Capítulo 3 — La Fuga Infinita

8 escenas, 3 misiones (capítulo corto). Tema: agua, humedales.

| # | Misión | Componente | Mecánica |
|---|--------|------------|----------|
| 1 | Controlar desperdicio | `FloodDragClear` | drag (5→zona segura, 90s) |
| 2 | Proteger humedal | `WetlandMemory` | memorama (4 parejas) |
| 3 | Reparar tubería | `PipeDragFit` | drag (4+2 trampa→slots, 90s) |

Recompensa: 50 pts, "Guardián de la Fuga Infinita".

## Capítulo 4 — La Ruta de la Basura

11 escenas, 5 misiones. Tema: separación de residuos, reciclaje, composta. Protagonistas: Vale + Timo.

| # | Misión | Componente | Mecánica |
|---|--------|------------|----------|
| 1 | Recolectar basura | `TrashCollector` | tap (8 items) |
| 2 | Separar residuos | `WasteSeparator` | drag (8→4 bins, 90s, datos de degradación) |
| 3 | Detectar contaminación | `PollutionDetector` | tap-detect (4 de 7) |
| 4 | **Hacer composta** | `CompostBuilder` | placement (5 capas + 3 distractores: plástico, carne, metal) |
| 5 | Centro de reciclaje | `RecycleMemory` | memorama (5 parejas: material→producto) |

WasteSeparator se diferencia de SidewalkCleanup (Cap.1): muestra datos de degradación ("Botella PET: 450 años") y datos de reciclaje ("El aluminio se recicla infinitas veces").

Recompensa: 60 pts, "Guardián de la Ruta de la Basura".

## Capítulo 5 — Azoteas con Vida

11 escenas, 5 misiones. Tema: techos verdes, huertos urbanos, biodiversidad. Ref. CIIEMAD/IPN. Protagonistas: Xani + Timo.

| # | Misión | Componente | Mecánica |
|---|--------|------------|----------|
| 0 | **Construir techo verde** | `GreenRoofBuilder` | placement (5 capas + 3 distractores, CIIEMAD, 70°C vs 35°C) |
| 1 | Evaluar la azotea | `RoofEvaluator` | tap-detect (4 de 6) |
| 2 | Diseñar el espacio | `RoofDesigner` | placement (6+2 distractores) |
| 3 | Elegir plantas | `PlantMatcher` | memorama (4 parejas: condición→planta) |
| 4 | Instalar riego | `IrrigationBuilder` | drag (5+2 trampa, 90s) |

Recompensa: 60 pts, "Guardián de las Azoteas".

## Capítulo 6 — El Gran Festival Verde

9 escenas, 4 misiones. Tema: comunidad, celebración, cierre. TODOS los personajes.

| # | Misión | Componente | Mecánica |
|---|--------|------------|----------|
| 1 | Preparar el espacio | `FestivalSetup` | placement (5+2 distractores) |
| 2 | Invitar al barrio | `NeighborInviter` | tap (6 vecinos) |
| 3 | Resolver imprevistos | `FestivalProblems` | memorama (4 parejas) |
| 4 | Inaugurar el festival | `FestivalInauguration` | drag (5 elementos) |

Final emocional: cada personaje agradece a {nombre}. Nube Gris: "El barrio ya no me necesita... pero tal vez eso está bien." Bolillo: *mueve la cola feliz*.

Recompensa: 80 pts, "Guardián del Festival Verde".

## Distribución de temas educativos

| Tema | Capítulo | Profundidad |
|------|----------|-------------|
| Calor urbano / isla de calor | Cap. 1 | Completo (detect + shade + restore) |
| Espacio público / urbanismo | Cap. 1 | Misión dedicada (SpaceRestorer) |
| Biodiversidad / animales callejeros | Cap. 2 | Completo (Bolillo narra + BolilloRoute) |
| Agua / humedales | Cap. 3 | Capítulo completo |
| Separación de residuos | Cap. 1 (limpieza general) + Cap. 4 (reciclaje con datos) | Diferenciados |
| **Composta** | Cap. 4 | Misión dedicada (CompostBuilder, proceso completo) |
| **Techos verdes** | Cap. 5 | Capítulo completo (5 misiones, ref. CIIEMAD/IPN) |
| Comunidad / activación | Cap. 6 | Capítulo completo (festival + cierre) |

## Personajes

| Personaje | Rol | Color | Protagoniza |
|-----------|-----|-------|-------------|
| Lila | Líder | #2d9d5e | Todos los capítulos |
| Timo | Inventor | #f97316 | Cap. 1 (fuga), 4 (reciclaje), 5 (riego) |
| Xani | Naturaleza | #8b5cf6 | Cap. 2 (parque), 3 (humedal), 5 (plantas) |
| Don Toño | Vecino | #8b6f47 | Cap. 1, 2 (memoria del barrio) |
| Nube Gris | Antagonista | #6b7280 | Todos (comentarios sarcásticos) |
| Nico | Deportista | #3b82f6 | Cap. 1, 2 (espacio público) |
| Vale | Comerciante | #fbbf24 | Cap. 4 (residuos), 6 (festival) |
| Bolillo | Perrito mestizo | #c89850 | Cap. 2 (narrador + ruta), 6 (cierre) |

## Reglas de diseño

- **Alto contraste**: texto `#111827` sobre fondos claros
- **Glassmorphism**: `backdrop-filter: blur()` + border de vidrio
- **Español mexicano**, optimista, nunca moralista. `{nombre}` del jugador.
- **Touch-first** (mobile). Mínimo 44x44px áreas tocables.
- **Feedback GSAP**: confetti éxito, shake error, heartbeat timer bajo
- **Catálogo dev** (`/dev`): personajes + capítulos + "▶ Jugar" cada minijuego + **🤖 Testing/Autobots**

## Catálogo dev (`/dev`)

Solo visible en localhost. Secciones colapsables:

- **Personajes**: preview de cada personaje con emociones y animación de hablar
- **Capítulos**: datos de cada capítulo con botón "▶ Jugar este capítulo"
- **Misiones**: lista de 28 minijuegos con botón "▶ Jugar" (overlay Teleport fullscreen)
- **🤖 Testing / Autobots**: herramientas para verificar que todo funciona sin jugar manualmente

### Testing / Autobots

| Botón | Función |
|-------|---------|
| **🤖 Auto-test TODOS** | Verifica los 28 minijuegos: componente existe + 3 diálogos (intro/success/failure). Muestra "X PASS, Y FAIL" |
| **⚡ Marcar TODO completado** | Completa 6 capítulos con puntos, seeds, badges. Crea perfil TestBot si no hay registro |
| **🔄 Reset progreso** | Limpia localStorage y progreso completo |
| **⚡ Completar** (por capítulo) | Marca todas las misiones del capítulo + otorga recompensa |
| **🤖 Test** (por capítulo) | Verifica componentes y diálogos de todas las misiones |
| **🤖 Test** (por misión) | Verifica componente + intro + success + failure dialogue IDs existen |
| **⚡ OK** (por misión) | Marca misión completada + otorga puntos/seeds/badge |

Log de resultados en terminal oscuro (verde = PASS, rojo = FAIL) con scroll.

El auto-test verifica:
1. Componente Vue existe en `missionComponentMap`
2. `introDialogueId` existe en el dialogues del capítulo correcto
3. `successDialogueId` existe
4. `failureDialogueId` existe

## Estado actual

- **6 capítulos completos y jugables** con 28 minijuegos
- **Registro** con nombre + edad + avatar personalizable
- **GameHud** con avatar, barra de progreso 🟢⚪, score, semillas, badges
- **Exploración** con scroll horizontal, spots sin label, spots falsos
- **Preview de recompensa** antes de cada misión
- **Celebración visual progresiva** entre misiones
- Integración Phaser.js preparada (`USE_PHASER = false`, componentes Vue activos)
- **Catálogo dev** con 28 minijuegos jugables individualmente + **🤖 Autobots** para testing automatizado
- Deploy en guardianes.cercu.com.mx
