import type { DialoguePool } from '~/shared/types/character'

export const chapter6Dialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — El barrio ha cambiado =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinematica — el barrio transformado, todos los personajes reunidos, ambiente festivo',
    lines: [
      { id: 'ci-1', speaker: 'nube-gris', emotion: 'worried', text: 'Un festival... asi nada mas. Seguro sale mal.' },
      { id: 'ci-2', speaker: 'lila', emotion: 'excited', text: 'El barrio ya no es el mismo. Es hora del Gran Festival Verde.' },
    ],
  },

  // ===== ESCENA 1 — Bienvenida, todos participan =====
  'welcome': {
    id: 'welcome',
    context: 'Todos los personajes se presentan con su aportacion al festival',
    lines: [
      { id: 'w-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, hoy es el dia. Vamos a organizar el primer festival verde del barrio.' },
      {
        id: 'w-2',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, necesitamos tu ayuda para que todo salga perfecto. Eres quien hizo posible todo esto.',
        choices: [
          { id: 'help-1', text: 'Vamos a hacer el mejor festival!' },
          { id: 'help-2', text: 'Por nuestro barrio verde!' },
          { id: 'help-3', text: 'Estoy listo!' },
        ],
      },
      { id: 'w-3', speaker: 'timo', emotion: 'happy', text: 'Paneles solares, plantas, vasos reutilizables, juegos al aire libre... todo el equipo esta listo.' },
    ],
  },

  // ===== MISION 1 — Preparar el espacio =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro mision 1 — preparar las estaciones del festival',
    lines: [
      { id: 'm1i-1', speaker: 'lila', emotion: 'thinking', text: '{nombre}, necesitamos 5 estaciones educativas. Elige bien: no todas las opciones sirven.' },
      { id: 'm1i-2', speaker: 'timo', emotion: 'excited', text: 'Cada estacion ensena algo sobre sustentabilidad.' },
      { id: 'm1i-3', speaker: 'nube-gris', emotion: 'mischievous', text: 'Pongan un puesto de comida chatarra. Eso si atrae gente.', optional: true },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Exito mision 1 — estaciones listas',
    lines: [
      { id: 'm1s-1', speaker: 'lila', emotion: 'happy', text: 'Perfecto, {nombre}. Las estaciones estan listas.' },
      { id: 'm1s-2', speaker: 'timo', emotion: 'proud', text: 'El barrio va a aprender mucho hoy.', optional: true },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo mision 1',
    lines: [
      { id: 'm1f-1', speaker: 'lila', emotion: 'neutral', text: 'Esa estacion no va ahi, {nombre}. Piensa en que necesita cada zona.' },
    ],
  },

  // ===== MISION 2 — Invitar al barrio =====
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro mision 2 — encontrar vecinos para invitarlos',
    lines: [
      { id: 'm2i-1', speaker: 'lila', emotion: 'excited', text: 'Ahora necesitamos invitar a los vecinos. Un festival sin gente no es festival.' },
      { id: 'm2i-2', speaker: 'don-tono', emotion: 'happy', text: 'Los vecinos estan por todo el barrio. Algunos en sus casas, otros en la calle.', optional: true },
      { id: 'm2i-3', speaker: 'nico', emotion: 'excited', text: '{nombre}, ve a buscarlos y diles que vengan. Cada uno tiene algo que aportar.' },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Exito mision 2 — vecinos invitados',
    lines: [
      { id: 'm2s-1', speaker: 'lila', emotion: 'proud', text: 'Todos confirmaron, {nombre}. El barrio entero va a estar aqui.' },
      { id: 'm2s-2', speaker: 'don-tono', emotion: 'happy', text: 'Hace mucho que no veia tanta gente emocionada por algo en el barrio.', optional: true },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo mision 2',
    lines: [
      { id: 'm2f-1', speaker: 'nico', emotion: 'neutral', text: 'Todavia faltan vecinos, {nombre}. Sigue buscando por el barrio.' },
    ],
  },

  // ===== MISION 3 — Resolver imprevistos =====
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro mision 3 — problemas inesperados en el festival',
    lines: [
      { id: 'm3i-1', speaker: 'timo', emotion: 'worried', text: '{nombre}, surgieron problemas de ultimo momento.' },
      { id: 'm3i-2', speaker: 'lila', emotion: 'neutral', text: 'Cada problema tiene una solucion sustentable. Encuentra las parejas, {nombre}.' },
      { id: 'm3i-3', speaker: 'nube-gris', emotion: 'mischievous', text: 'Ja! Yo sabia que algo iba a salir mal.', optional: true },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Exito mision 3 — problemas resueltos',
    lines: [
      { id: 'm3s-1', speaker: 'timo', emotion: 'proud', text: 'Todos los problemas resueltos, {nombre}. Y con soluciones sustentables!' },
      { id: 'm3s-2', speaker: 'xani', emotion: 'happy', text: 'Eso es lo que hace un verdadero guardian: no se rinde ante los problemas.', optional: true },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo mision 3',
    lines: [
      { id: 'm3f-1', speaker: 'timo', emotion: 'thinking', text: 'Esa no es la solucion correcta, {nombre}. Piensa: que resuelve este problema de forma sustentable?' },
    ],
  },

  // ===== MISION 4 — Inaugurar el festival =====
  'mission-4-intro': {
    id: 'mission-4-intro',
    context: 'Intro mision 4 — colocar los elementos de inauguracion',
    lines: [
      { id: 'm4i-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, es el momento. Vamos a inaugurar el Gran Festival Verde.' },
      { id: 'm4i-2', speaker: 'nico', emotion: 'excited', text: 'Arrastra cada elemento a su lugar. Ya casi es hora!' },
      { id: 'm4i-3', speaker: 'don-tono', emotion: 'proud', text: 'Que bonito dia. Nunca pense que veria algo asi en nuestro barrio.', optional: true },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Exito mision 4 — festival inaugurado',
    lines: [
      { id: 'm4s-1', speaker: 'lila', emotion: 'proud', text: 'El Gran Festival Verde esta oficialmente inaugurado!' },
      { id: 'm4s-2', speaker: 'nube-gris', emotion: 'sad', text: 'Bueno... admito que se ve... bonito.', optional: true },
    ],
  },
  'mission-4-failure': {
    id: 'mission-4-failure',
    context: 'Fallo mision 4',
    lines: [
      { id: 'm4f-1', speaker: 'lila', emotion: 'neutral', text: 'Ese elemento no va ahi, {nombre}. Piensa donde quedaria mejor.' },
    ],
  },

  // ===== ESCENA FINAL — El Gran Cierre (FINAL DEL JUEGO) =====
  'chapter-6-ending': {
    id: 'chapter-6-ending',
    context: 'Cierre emocional del capitulo 6 y del juego completo — todos agradecen al jugador',
    lines: [
      { id: 'e-1', speaker: 'don-tono', emotion: 'proud', text: 'Yo vi este barrio nacer y apagarse. Hoy lo vi renacer gracias a ti, {nombre}.' },
      { id: 'e-2', speaker: 'nube-gris', emotion: 'sad', text: 'El barrio ya no me necesita... me toca buscar otro. Uno sin guardianes.' },
      { id: 'e-3', speaker: 'bolillo', emotion: 'happy', text: '*se echa a los pies de {nombre}, tranquilo y feliz*' },
      { id: 'e-4', speaker: 'lila', emotion: 'excited', text: '{nombre}, tu demostraste que una persona puede cambiar todo un barrio. Guardianes del Barrio Verde... para siempre.' },
    ],
  },

  // ===== GANCHO FINAL — Celebracion de juego completo =====
  'game-complete': {
    id: 'game-complete',
    context: 'Mensaje final del juego — no hay siguiente capitulo, es la conclusion',
    lines: [
      { id: 'gc-1', speaker: 'lila', emotion: 'proud', text: '{nombre}, completaste todos los capitulos. Eres un verdadero Guardian del Barrio Verde.' },
      { id: 'gc-2', speaker: 'timo', emotion: 'happy', text: 'El barrio cambio porque tu decidiste actuar.' },
      { id: 'gc-3', speaker: 'xani', emotion: 'happy', text: 'Cada arbol plantado, cada fuga reparada, cada vecino invitado... todo empezo contigo.' },
      { id: 'gc-4', speaker: 'don-tono', emotion: 'proud', text: 'Ahora lleva lo que aprendiste a tu barrio real. El mundo necesita mas guardianes como tu.' },
      { id: 'gc-5', speaker: 'bolillo', emotion: 'happy', text: '*mueve la cola una ultima vez y se despide con un ladrido suave*' },
    ],
  },
}
