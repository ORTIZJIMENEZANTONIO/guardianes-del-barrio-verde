import type { DialoguePool } from '~/shared/types/character'

export const chapter2Dialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — Parque abandonado, Bolillo aparece =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática — parque abandonado, Bolillo escondido entre arbustos',
    lines: [
      { id: 'ci-1', speaker: 'nube-gris', emotion: 'mischievous', text: 'Parque abandonado, perrito asustado… este lugar es mi obra maestra.' },
      { id: 'ci-2', speaker: 'lila', emotion: 'sad', text: 'Antes aquí venían familias. Vamos a despertarlo.' },
    ],
  },

  // ===== ESCENA 1 — Llegada, presentan a Bolillo =====
  'welcome': {
    id: 'welcome',
    context: 'El equipo llega, descubren a Bolillo, él aún no habla',
    lines: [
      { id: 'w-1', speaker: 'xani', emotion: 'neutral', text: 'Hay un perrito escondido entre los arbustos. Lo vamos a llamar Bolillo.' },
      {
        id: 'w-2',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, ¿nos ayudas a despertar este parque y a ganarnos la confianza de Bolillo?',
        choices: [
          { id: 'help-1', text: '¡Vamos a despertarlo!' },
          { id: 'help-2', text: '¡Por el parque y por Bolillo!' },
          { id: 'help-3', text: '¡Claro que sí!' },
        ],
      },
      { id: 'w-3', speaker: 'xani', emotion: 'thinking', text: 'Los animales callejeros necesitan sombra, agua y un lugar seguro. Si cuidamos el parque, Bolillo también se beneficia.' },
    ],
  },

  // ===== ESCENA 2 — Diagnóstico =====
  'observation': {
    id: 'observation',
    context: 'Exploración del parque, Bolillo observa desde lejos',
    lines: [
      { id: 'obs-1', speaker: 'lila', emotion: 'thinking', text: '{nombre}, veamos qué le hace falta a este parque. Bolillo nos observa desde lejos.' },
    ],
  },

  'observation-trash': {
    id: 'observation-trash',
    context: 'Al tocar basura',
    lines: [
      { id: 'ot-1', speaker: 'lila', emotion: 'sad', text: 'Lo primero que se nota es el desorden.' },
      { id: 'ot-2', speaker: 'xani', emotion: 'thinking', text: 'La basura también es peligrosa para animales como Bolillo. Pueden comer algo que les haga daño.', optional: true },
    ],
  },

  'observation-swing': {
    id: 'observation-swing',
    context: 'Al tocar columpio roto',
    lines: [
      { id: 'os-1', speaker: 'nico', emotion: 'sad', text: 'Así ya ni ganas dan de usarlo.' },
    ],
  },

  'observation-planter': {
    id: 'observation-planter',
    context: 'Al tocar jardinera seca',
    lines: [
      { id: 'op-1', speaker: 'xani', emotion: 'sad', text: 'El suelo seco también necesita cuidado. Sin plantas, no hay sombra para nadie.' },
    ],
  },

  'observation-bolillo': {
    id: 'observation-bolillo',
    context: 'Al tocar a Bolillo escondido',
    lines: [
      { id: 'obo-1', speaker: 'xani', emotion: 'neutral', text: 'Bolillo sigue ahí, observando. No se ha ido. Tiene curiosidad, pero aún no confía.' },
      { id: 'obo-2', speaker: 'xani', emotion: 'thinking', text: 'Un perro callejero que no huye es un perro que quiere quedarse. Solo necesita sentirse seguro.' },
    ],
  },

  'observation-bench': {
    id: 'observation-bench',
    context: 'Al tocar banca dañada',
    lines: [
      { id: 'ob-1', speaker: 'don-tono', emotion: 'sad', text: 'Antes aquí se sentaban vecinos a platicar.' },
    ],
  },

  'observation-complete': {
    id: 'observation-complete',
    context: 'Al detectar todos los elementos',
    lines: [
      { id: 'occ-1', speaker: 'lila', emotion: 'excited', text: 'Ya lo vimos, {nombre}: este parque necesita limpieza, cuidado y vida.' },
      { id: 'occ-2', speaker: 'xani', emotion: 'happy', text: 'Y Bolillo nos dio una pista: donde un animal busca refugio, hay esperanza.' },
    ],
  },

  // ===== Tutorial =====
  'tutorial': {
    id: 'tutorial',
    context: 'Explicación breve antes de las misiones',
    lines: [
      { id: 't-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, vamos a despertar este parque paso a paso.', optional: true },
      { id: 't-2', speaker: 'xani', emotion: 'neutral', text: 'Primero hay que despejar los senderos. Están llenos de ramas, piedras y cosas que no dejan pasar.', optional: true },
      { id: 't-3', speaker: 'timo', emotion: 'happy', text: '¡Después de eso, Bolillo tal vez se anime a acercarse!', optional: true },
      { id: 't-4', speaker: 'lila', emotion: 'excited', text: '¡Manos a la obra, {nombre}!', optional: true },
    ],
  },

  // ===== MISIÓN 1 — Despejar senderos (antes de que Bolillo hable) =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro misión 1 — despejar senderos, Bolillo aún no habla',
    lines: [
      { id: 'm1i-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, los senderos están bloqueados. ¡Arrastra cada obstáculo fuera del camino!' },
      { id: 'm1i-2', speaker: 'timo', emotion: 'happy', text: 'Ramas, piedras, arbustos secos… hay que despejar para que la gente pueda caminar.' },
      { id: 'm1i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¿De verdad van a limpiar todo eso? ¡Qué obsesión con el orden!', optional: true },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito misión 1 — senderos despejados, Bolillo se anima',
    lines: [
      { id: 'm1s-1', speaker: 'nico', emotion: 'excited', text: '¡Ya se puede caminar por aquí!' },
      { id: 'm1s-2', speaker: 'xani', emotion: 'happy', text: '{nombre}, mira… Bolillo se acercó. Creo que quiere decirnos algo.' },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo misión 1',
    lines: [
      { id: 'm1f-1', speaker: 'lila', emotion: 'neutral', text: 'Todavía hay camino por despejar, {nombre}. ¡Otra vez!' },
    ],
  },

  // =========================================================================
  // A PARTIR DE AQUÍ BOLILLO HABLA — es el narrador principal
  // =========================================================================

  // ===== MISIÓN 2 — Memorama del suelo (Bolillo narra) =====
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro misión 2 — Bolillo habla por primera vez',
    lines: [
      { id: 'm2i-1', speaker: 'bolillo', emotion: 'neutral', text: 'Oigan… ¿me escuchan? Yo soy Bolillo. Esta tierra antes era suave. Ahora está dura como piedra.' },
      { id: 'm2i-2', speaker: 'bolillo', emotion: 'happy', text: '¡Ayúdame a entender cómo cuidar el suelo, {nombre}! Encuentra las parejas.' },
      { id: 'm2i-3', speaker: 'nico', emotion: 'surprised', text: '¡¿El perro habla?!', optional: true },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito misión 2 — Bolillo contento, se echa cerca',
    lines: [
      { id: 'm2s-1', speaker: 'bolillo', emotion: 'excited', text: '¡{nombre}, mira! La tierra ya se siente diferente. Hasta da ganas de echarse aquí.' },
      { id: 'm2s-2', speaker: 'bolillo', emotion: 'happy', text: 'Cuando la tierra es buena, todo mejora.', optional: true },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo misión 2',
    lines: [
      { id: 'm2f-1', speaker: 'bolillo', emotion: 'neutral', text: 'Mmm… esas no eran pareja, {nombre}. Piensa bien, ¡tú puedes!' },
    ],
  },

  // ===== MISIÓN 3 — Regar con estrategia (Bolillo narra) =====
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro misión 3 — Bolillo habla sobre la sed y el agua',
    lines: [
      { id: 'm3i-1', speaker: 'bolillo', emotion: 'sad', text: '{nombre}, yo sé lo que es tener sed. Las plantas también la tienen.' },
      { id: 'm3i-2', speaker: 'bolillo', emotion: 'happy', text: '¡Arrastra las gotas a las plantas que más las necesitan! Y si sobra una… para mi platito, ¿no?' },
      { id: 'm3i-3', speaker: 'timo', emotion: 'happy', text: '¡Claro, Bolillo! Hay que regar con cabeza.', optional: true },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito misión 3 — Bolillo bebe agua',
    lines: [
      { id: 'm3s-1', speaker: 'bolillo', emotion: 'excited', text: '¡Agua fresca! {nombre}, no sabes lo que esto significa para un perro de la calle.' },
      { id: 'm3s-2', speaker: 'bolillo', emotion: 'happy', text: 'Un plato de agua a la sombra puede cambiarle el día a alguien como yo.', optional: true },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo misión 3',
    lines: [
      { id: 'm3f-1', speaker: 'bolillo', emotion: 'thinking', text: 'No desperdicies el agua, {nombre}. Ponla donde más falta hace.' },
    ],
  },

  // ===== MISIÓN 4 — Memorama de vida silvestre (Bolillo narra) =====
  'mission-4-intro': {
    id: 'mission-4-intro',
    context: 'Intro misión 4 — Bolillo habla sobre los animales del parque',
    lines: [
      { id: 'm4i-1', speaker: 'bolillo', emotion: 'excited', text: '¡{nombre}, escuché un pájaro! Antes había mariposas y abejas, pero se fueron cuando el parque se quedó solo.' },
      { id: 'm4i-2', speaker: 'bolillo', emotion: 'happy', text: 'Si aprendemos qué necesita cada animal, tal vez vuelvan. ¡Encuentra las parejas!' },
      { id: 'm4i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Mariposas en este parque? No me hagan reír.', optional: true },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Éxito misión 4 — fauna regresa, Bolillo emocionado',
    lines: [
      { id: 'm4s-1', speaker: 'bolillo', emotion: 'excited', text: '¡{nombre}, mira! ¡Una mariposa! ¡Están volviendo!' },
      { id: 'm4s-2', speaker: 'bolillo', emotion: 'proud', text: 'Cuando un lugar es bueno para los animales, es bueno para todos.', optional: true },
    ],
  },
  'mission-4-failure': {
    id: 'mission-4-failure',
    context: 'Fallo misión 4',
    lines: [
      { id: 'm4f-1', speaker: 'bolillo', emotion: 'neutral', text: 'Piensa qué necesita cada animal, {nombre}. Yo te doy una pista: todos necesitamos un lugar seguro.' },
    ],
  },

  // ===== MISIÓN 5 — Reactivar parque (Bolillo narra) =====
  'mission-5-intro': {
    id: 'mission-5-intro',
    context: 'Intro misión 5 — Bolillo habla sobre la comunidad',
    lines: [
      { id: 'm5i-1', speaker: 'bolillo', emotion: 'thinking', text: '{nombre}, falta que la gente quiera volver. Un parque sin personas se vuelve a dormir.' },
      { id: 'm5i-2', speaker: 'bolillo', emotion: 'excited', text: '¡Arrastra cada cosa a su lugar! Bancas, juegos, letreros… ¡que despierte de verdad!' },
      { id: 'm5i-3', speaker: 'don-tono', emotion: 'happy', text: 'Yo traje pintura. No pregunten desde cuándo la tenía guardada.', optional: true },
    ],
  },
  'mission-5-success': {
    id: 'mission-5-success',
    context: 'Éxito misión 5 — Bolillo feliz, parque completo',
    lines: [
      { id: 'm5s-1', speaker: 'bolillo', emotion: 'proud', text: '{nombre}… mira lo que hicimos. ¡Este parque ya no está dormido!' },
      { id: 'm5s-2', speaker: 'bolillo', emotion: 'excited', text: 'Yo empecé escondido, pero ustedes me dieron espacio, agua y un lugar seguro.', optional: true },
    ],
  },
  'mission-5-failure': {
    id: 'mission-5-failure',
    context: 'Fallo misión 5',
    lines: [
      { id: 'm5f-1', speaker: 'bolillo', emotion: 'happy', text: '¡Casi lo logras, {nombre}! Piensa en qué necesita la gente para querer venir aquí.' },
    ],
  },

  // ===== ESCENA FINAL — Bolillo cierra el capítulo =====
  'chapter-2-ending': {
    id: 'chapter-2-ending',
    context: 'Cierre — Bolillo como voz principal del capítulo',
    lines: [
      { id: 'e-1', speaker: 'bolillo', emotion: 'proud', text: '{nombre}, lo logramos. El parque despertó. Y tú lo hiciste posible.' },
      { id: 'e-2', speaker: 'lila', emotion: 'proud', text: 'Un barrio verde cuida a todos sus habitantes.' },
      { id: 'e-3', speaker: 'bolillo', emotion: 'excited', text: '¡Seguiremos, {nombre}! Yo voy con ustedes. Ahora sí tengo brigada. 🐕' },
    ],
  },

  // ===== Misión 6 — La Ruta de Bolillo =====
  'mission-6-intro': {
    id: 'mission-6-intro',
    context: 'Intro misión 6 — Ruta de Bolillo',
    lines: [
      { id: 'm6i-1', speaker: 'xani', emotion: 'thinking', text: 'Bolillo tiene sus paradas favoritas. En cada una necesita algo: agua, sombra, un lugar seguro.' },
      { id: 'm6i-2', speaker: 'lila', emotion: 'happy', text: '{nombre}, sigue a Bolillo y dale lo que necesita en cada punto.' },
      { id: 'm6i-3', speaker: 'xani', emotion: 'neutral', text: 'Recuerda: nunca fuerces contacto. Si gruñe, es miedo, no agresión.', optional: true },
    ],
  },
  'mission-6-success': {
    id: 'mission-6-success',
    context: 'Éxito misión 6',
    lines: [
      { id: 'm6s-1', speaker: 'bolillo', emotion: 'happy', text: '¡Guau guau! *mueve la cola*' },
      { id: 'm6s-2', speaker: 'lila', emotion: 'proud', text: '{nombre}, los animales callejeros también son parte del barrio. Cuidarlos es cuidar a la comunidad.', optional: true },
    ],
  },
  'mission-6-failure': {
    id: 'mission-6-failure',
    context: 'Fallo misión 6',
    lines: [
      { id: 'm6f-1', speaker: 'xani', emotion: 'neutral', text: 'Piensa en lo que Bolillo necesita en cada parada, {nombre}. ¡Tú puedes!' },
    ],
  },

  // ===== Gancho =====
  'chapter-3-hook': {
    id: 'chapter-3-hook',
    context: 'Gancho al capítulo 3',
    lines: [
      { id: 'h-1', speaker: 'bolillo', emotion: 'worried', text: '¡{nombre}, escucho agua! Y no de la buena…' },
      { id: 'h-2', speaker: 'timo', emotion: 'worried', text: 'Uh oh… eso no suena nada bien.' },
      { id: 'h-3', speaker: 'lila', emotion: 'thinking', text: 'Tenemos una fuga grande. ¡Vamos!', optional: true },
    ],
  },
}
