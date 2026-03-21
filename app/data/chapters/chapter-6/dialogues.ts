import type { DialoguePool } from '~/shared/types/character'

export const chapter6Dialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — El barrio ha cambiado =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinematica — el barrio transformado, todos los personajes reunidos, ambiente festivo',
    lines: [
      { id: 'ci-1', speaker: 'lila', emotion: 'proud', text: 'Miren nuestro barrio. Ya no es el mismo.' },
      { id: 'ci-2', speaker: 'don-tono', emotion: 'happy', text: 'La calle ya no quema, el parque tiene vida, el agua corre por donde debe.' },
      { id: 'ci-3', speaker: 'xani', emotion: 'happy', text: 'Las plantas crecieron, los animales volvieron. Hasta Bolillo se ve tranquilo.' },
      { id: 'ci-4', speaker: 'bolillo', emotion: 'happy', text: '*mueve la cola contento*' },
      { id: 'ci-5', speaker: 'timo', emotion: 'excited', text: 'Oigan, y si hacemos algo para celebrar. Algo grande.' },
      { id: 'ci-6', speaker: 'vale', emotion: 'excited', text: 'Un festival. Uno donde todo el barrio participe.' },
      { id: 'ci-7', speaker: 'lila', emotion: 'excited', text: 'El Gran Festival Verde. Para celebrar lo que logramos y seguir aprendiendo juntos.' },
      { id: 'ci-8', speaker: 'nube-gris', emotion: 'worried', text: 'Un festival... asi nada mas. Seguro sale mal.', optional: true },
      { id: 'ci-9', speaker: 'nico', emotion: 'excited', text: 'No si lo organizamos bien.' },
    ],
  },

  // ===== ESCENA 1 — Bienvenida, todos participan =====
  'welcome': {
    id: 'welcome',
    context: 'Todos los personajes se presentan con su aportacion al festival',
    lines: [
      { id: 'w-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, hoy es el dia. Vamos a organizar el primer festival verde del barrio.' },
      { id: 'w-2', speaker: 'timo', emotion: 'happy', text: 'Yo traje paneles solares portatiles para la energia del evento. Nada de generadores ruidosos.' },
      { id: 'w-3', speaker: 'xani', emotion: 'proud', text: 'Yo prepare plantas del vivero comunitario. Cada visitante puede llevarse una.' },
      { id: 'w-4', speaker: 'don-tono', emotion: 'happy', text: 'Yo voy a contar la historia del barrio. Como era antes, como es ahora, gracias a ustedes.' },
      { id: 'w-5', speaker: 'vale', emotion: 'excited', text: 'Mi puesto tendra agua de frutas en vasos reutilizables. Nada de plastico.' },
      { id: 'w-6', speaker: 'nico', emotion: 'excited', text: 'Y yo organice juegos al aire libre para los ninos. Futbol, saltar la cuerda, carreras de costales.' },
      { id: 'w-7', speaker: 'bolillo', emotion: 'happy', text: '*ladra emocionado y da vueltas*', optional: true },
      { id: 'w-8', speaker: 'xani', emotion: 'happy', text: 'Bolillo tambien esta listo. Ya no se esconde. Este barrio tambien es su hogar.', optional: true },
      {
        id: 'w-9',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, necesitamos tu ayuda para que todo salga perfecto. Eres quien hizo posible todo esto.',
        choices: [
          { id: 'help-1', text: 'Vamos a hacer el mejor festival!' },
          { id: 'help-2', text: 'Por nuestro barrio verde!' },
          { id: 'help-3', text: 'Estoy listo!' },
        ],
      },
    ],
  },

  // ===== MISION 1 — Preparar el espacio =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro mision 1 — preparar las estaciones del festival',
    lines: [
      { id: 'm1i-1', speaker: 'lila', emotion: 'thinking', text: '{nombre}, primero hay que preparar el espacio. Necesitamos 5 estaciones educativas.' },
      { id: 'm1i-2', speaker: 'timo', emotion: 'excited', text: 'Cada estacion ensena algo sobre sustentabilidad. Elige bien: no todas las opciones sirven.' },
      { id: 'm1i-3', speaker: 'nube-gris', emotion: 'mischievous', text: 'Pongan un puesto de comida chatarra. Eso si atrae gente.', optional: true },
      { id: 'm1i-4', speaker: 'xani', emotion: 'neutral', text: 'Ni hablar. Este festival es para aprender y celebrar, no para contaminar mas.' },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Exito mision 1 — estaciones listas',
    lines: [
      { id: 'm1s-1', speaker: 'lila', emotion: 'happy', text: 'Perfecto, {nombre}. Las estaciones estan listas.' },
      { id: 'm1s-2', speaker: 'timo', emotion: 'proud', text: 'Cada una ensena algo importante. El barrio va a aprender mucho hoy.' },
      { id: 'm1s-3', speaker: 'vale', emotion: 'excited', text: 'Ya se ve como un festival de verdad!', optional: true },
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
      { id: 'm2s-2', speaker: 'don-tono', emotion: 'happy', text: 'Hace mucho que no veia tanta gente emocionada por algo en el barrio.' },
      { id: 'm2s-3', speaker: 'bolillo', emotion: 'happy', text: '*mueve la cola al ver tanta gente*', optional: true },
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
      { id: 'm3i-1', speaker: 'timo', emotion: 'worried', text: 'Ay no, {nombre}. Surgieron algunos problemas de ultimo momento.' },
      { id: 'm3i-2', speaker: 'xani', emotion: 'thinking', text: 'Nada que no se pueda resolver con ingenio verde. Cada problema tiene una solucion sustentable.' },
      { id: 'm3i-3', speaker: 'nube-gris', emotion: 'mischievous', text: 'Ja! Yo sabia que algo iba a salir mal.', optional: true },
      { id: 'm3i-4', speaker: 'lila', emotion: 'neutral', text: 'No es salir mal. Es resolver con creatividad. Encuentra las parejas, {nombre}.' },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Exito mision 3 — problemas resueltos',
    lines: [
      { id: 'm3s-1', speaker: 'timo', emotion: 'proud', text: 'Todos los problemas resueltos, {nombre}. Y con soluciones sustentables!' },
      { id: 'm3s-2', speaker: 'xani', emotion: 'happy', text: 'Eso es lo que hace un verdadero guardian: no se rinde ante los problemas.' },
      { id: 'm3s-3', speaker: 'nube-gris', emotion: 'worried', text: 'Hmm... resolvieron todo. Eso no me lo esperaba.', optional: true },
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
      { id: 'm4i-2', speaker: 'vale', emotion: 'happy', text: 'Todo esta casi listo. Solo faltan los toques finales en la entrada.' },
      { id: 'm4i-3', speaker: 'don-tono', emotion: 'proud', text: 'Que bonito dia. Nunca pense que veria algo asi en nuestro barrio.', optional: true },
      { id: 'm4i-4', speaker: 'nico', emotion: 'excited', text: 'Arrastra cada elemento a su lugar, {nombre}. Ya casi es hora!' },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Exito mision 4 — festival inaugurado',
    lines: [
      { id: 'm4s-1', speaker: 'lila', emotion: 'proud', text: 'El Gran Festival Verde esta oficialmente inaugurado!' },
      { id: 'm4s-2', speaker: 'vale', emotion: 'excited', text: 'Miren cuanta gente vino. El barrio entero esta aqui.' },
      { id: 'm4s-3', speaker: 'timo', emotion: 'happy', text: 'Los paneles solares estan funcionando perfecto. Energia limpia para todo el evento.' },
      { id: 'm4s-4', speaker: 'bolillo', emotion: 'happy', text: '*ladra feliz y corre entre la gente*' },
      { id: 'm4s-5', speaker: 'nube-gris', emotion: 'sad', text: 'Bueno... admito que se ve... bonito.', optional: true },
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
      { id: 'e-1', speaker: 'lila', emotion: 'proud', text: '{nombre}... mira lo que logramos.' },
      { id: 'e-2', speaker: 'don-tono', emotion: 'happy', text: 'Yo vi este barrio nacer. Vi como se fue apagando. Y hoy lo vi renacer gracias a ustedes.' },
      { id: 'e-3', speaker: 'timo', emotion: 'proud', text: '{nombre}, gracias a ti aprendi que la tecnologia sirve cuando la usas para ayudar a los demas.' },
      { id: 'e-4', speaker: 'xani', emotion: 'happy', text: 'Tu me ayudaste a cuidar el humedal, las plantas y a Bolillo. La naturaleza te lo agradece, {nombre}.' },
      { id: 'e-5', speaker: 'bolillo', emotion: 'happy', text: '*mueve la cola feliz*' },
      { id: 'e-6', speaker: 'nico', emotion: 'excited', text: '{nombre}, contigo aprendi que cuidar el barrio tambien es un deporte de equipo.' },
      { id: 'e-7', speaker: 'vale', emotion: 'happy', text: 'Mi puesto ahora es cien por ciento sustentable. Eso fue gracias a lo que aprendi contigo, {nombre}.' },
      { id: 'e-8', speaker: 'nube-gris', emotion: 'sad', text: 'El barrio ya no me necesita... pero tal vez eso esta bien.' },
      { id: 'e-9', speaker: 'lila', emotion: 'thinking', text: 'Nube Gris, siempre habra problemas. Pero ahora sabemos como enfrentarlos.', optional: true },
      { id: 'e-10', speaker: 'nube-gris', emotion: 'neutral', text: 'Supongo que... me toca buscar otro barrio. Uno sin guardianes.', optional: true },
      { id: 'e-11', speaker: 'lila', emotion: 'proud', text: '{nombre}, tu demostraste que una persona puede cambiar todo un barrio.' },
      { id: 'e-12', speaker: 'don-tono', emotion: 'proud', text: 'No solo lo cambiaste. Lo despertaste. Le devolviste la vida.' },
      { id: 'e-13', speaker: 'xani', emotion: 'proud', text: 'Y lo mas importante: le ensenaste a la gente que vale la pena cuidar donde vivimos.' },
      { id: 'e-14', speaker: 'bolillo', emotion: 'happy', text: '*se echa a los pies de {nombre}, tranquilo y feliz*' },
      { id: 'e-15', speaker: 'lila', emotion: 'excited', text: 'Guardianes del Barrio Verde... para siempre.' },
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
