import type { DialoguePool } from '~/shared/types/character'

export const chapter2Dialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — Parque abandonado, Bolillo aparece =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática — parque abandonado, Bolillo escondido entre arbustos',
    lines: [
      { id: 'ci-1', speaker: 'xani', emotion: 'sad', text: 'Este parque está dormido.' },
      { id: 'ci-2', speaker: 'timo', emotion: 'worried', text: 'Y no de esos sueños ricos con almohada. Más bien dormido por abandono.', optional: true },
      { id: 'ci-3', speaker: 'xani', emotion: 'surprised', text: 'Esperen… miren entre los arbustos. Hay un perrito escondido.' },
      { id: 'ci-4', speaker: 'xani', emotion: 'thinking', text: 'Tiene la cola entre las patas y las orejas hacia atrás. Está asustado.' },
      { id: 'ci-5', speaker: 'lila', emotion: 'sad', text: 'Antes aquí venían familias y vecinos. Ahora hasta los animales se esconden.' },
      { id: 'ci-6', speaker: 'nube-gris', emotion: 'mischievous', text: 'Ahora es mi lugar favorito para bostezar.' },
    ],
  },

  // ===== ESCENA 1 — Llegada, presentan a Bolillo =====
  'welcome': {
    id: 'welcome',
    context: 'El equipo llega, descubren a Bolillo, él aún no habla',
    lines: [
      { id: 'w-1', speaker: 'xani', emotion: 'neutral', text: 'Ese perrito es un mestizo del barrio. Como tantos que viven en la calle.' },
      { id: 'w-2', speaker: 'nico', emotion: 'excited', text: '¡Vamos a acariciarlo!' },
      { id: 'w-3', speaker: 'xani', emotion: 'thinking', text: 'No, Nico. Mira su cuerpo: cola baja, orejas atrás. Nos está diciendo que tiene miedo.' },
      { id: 'w-4', speaker: 'lila', emotion: 'thinking', text: 'Entonces hay que ganarnos su confianza. Sin forzarlo.' },
      { id: 'w-5', speaker: 'xani', emotion: 'happy', text: 'Lo vamos a llamar Bolillo. Mira su color… parece pan bolillo recién hecho.' },
      { id: 'w-6', speaker: 'xani', emotion: 'neutral', text: 'Los animales callejeros necesitan sombra, agua limpia y un lugar seguro. Si cuidamos este parque, Bolillo también se beneficia.', optional: true },
      {
        id: 'w-7',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, ¿nos ayudas a despertar este parque y a ganarnos la confianza de Bolillo?',
        choices: [
          { id: 'help-1', text: '¡Vamos a despertarlo!' },
          { id: 'help-2', text: '¡Por el parque y por Bolillo!' },
          { id: 'help-3', text: '¡Claro que sí!' },
        ],
      },
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
      { id: 't-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, vamos a despertar este parque paso a paso.' },
      { id: 't-2', speaker: 'xani', emotion: 'neutral', text: 'Primero hay que despejar los senderos. Están llenos de ramas, piedras y cosas que no dejan pasar.', optional: true },
      { id: 't-3', speaker: 'timo', emotion: 'happy', text: '¡Después de eso, Bolillo tal vez se anime a acercarse!' },
      { id: 't-4', speaker: 'lila', emotion: 'excited', text: '¡Manos a la obra, {nombre}!' },
    ],
  },

  // ===== MISIÓN 1 — Despejar senderos (antes de que Bolillo hable) =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro misión 1 — despejar senderos, Bolillo aún no habla',
    lines: [
      { id: 'm1i-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, los senderos están bloqueados. ¡Arrastra cada obstáculo fuera del camino!' },
      { id: 'm1i-2', speaker: 'timo', emotion: 'happy', text: 'Ramas, piedras, arbustos secos… hay que despejar para que la gente pueda caminar.' },
      { id: 'm1i-3', speaker: 'xani', emotion: 'thinking', text: 'Bolillo se asomó un poco más. Quiere ver qué hacemos.', optional: true },
      { id: 'm1i-4', speaker: 'nube-gris', emotion: 'mischievous', text: '¿De verdad van a limpiar todo eso? ¡Qué obsesión con el orden!' },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito misión 1 — senderos despejados, Bolillo se anima',
    lines: [
      { id: 'm1s-1', speaker: 'nico', emotion: 'excited', text: '¡Ya se puede caminar por aquí!' },
      { id: 'm1s-2', speaker: 'xani', emotion: 'happy', text: '{nombre}, mira… Bolillo se acercó. Ya no está escondido.' },
      { id: 'm1s-3', speaker: 'lila', emotion: 'happy', text: 'Creo que quiere decirnos algo…' },
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
      { id: 'm2i-1', speaker: 'bolillo', emotion: 'neutral', text: 'Oigan… ¿me escuchan? Yo soy Bolillo. Llevo mucho tiempo aquí, en este parque.' },
      { id: 'm2i-2', speaker: 'nico', emotion: 'surprised', text: '¡¿El perro habla?!' },
      { id: 'm2i-3', speaker: 'bolillo', emotion: 'sad', text: 'Yo conozco cada rincón de este lugar. Y esta tierra… antes era suave y olía bonito. Ahora está dura como piedra.' },
      { id: 'm2i-4', speaker: 'bolillo', emotion: 'thinking', text: 'Yo duermo aquí, {nombre}. Cuando la tierra está seca, todo se siente muerto. Ni las plantas crecen, ni los insectos vienen.', optional: true },
      { id: 'm2i-5', speaker: 'bolillo', emotion: 'happy', text: '¡Ayúdame a entender cómo cuidar el suelo! Encuentra las parejas.' },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito misión 2 — Bolillo contento, se echa cerca',
    lines: [
      { id: 'm2s-1', speaker: 'bolillo', emotion: 'excited', text: '¡{nombre}, mira! La tierra ya se siente diferente. Hasta da ganas de echarse aquí.' },
      { id: 'm2s-2', speaker: 'bolillo', emotion: 'happy', text: 'Yo siempre busco un lugar suave para dormir. Cuando la tierra es buena, todo mejora.' },
      { id: 'm2s-3', speaker: 'don-tono', emotion: 'surprised', text: 'Yo ni me fijaba en la tierra… pero sí se nota el cambio.', optional: true },
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
      { id: 'm3i-1', speaker: 'bolillo', emotion: 'sad', text: '{nombre}, yo sé lo que es tener sed y no encontrar agua. En la calle no siempre hay.' },
      { id: 'm3i-2', speaker: 'bolillo', emotion: 'thinking', text: 'Las plantas también tienen sed. Pero el agua no alcanza para todos si se desperdicia.' },
      { id: 'm3i-3', speaker: 'bolillo', emotion: 'happy', text: '¡Arrastra las gotas a las plantas que más las necesitan! Y si sobra una… para mi platito, ¿no?', optional: true },
      { id: 'm3i-4', speaker: 'timo', emotion: 'happy', text: '¡Claro, Bolillo! Hay que regar con cabeza.' },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito misión 3 — Bolillo bebe agua',
    lines: [
      { id: 'm3s-1', speaker: 'bolillo', emotion: 'excited', text: '¡Agua fresca! {nombre}, no sabes lo que esto significa para un perro de la calle.' },
      { id: 'm3s-2', speaker: 'bolillo', emotion: 'happy', text: 'Un plato de agua a la sombra. Algo tan sencillo puede cambiarle el día a alguien como yo.' },
      { id: 'm3s-3', speaker: 'bolillo', emotion: 'proud', text: 'Y las plantas ya se ven mejor. Cuando todo tiene agua, todo tiene vida.', optional: true },
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
      { id: 'm4i-1', speaker: 'bolillo', emotion: 'excited', text: '¡{nombre}, escuché algo! ¿Un pájaro? Hace mucho que no escuchaba uno aquí.' },
      { id: 'm4i-2', speaker: 'bolillo', emotion: 'thinking', text: 'Antes este parque tenía mariposas, abejas, pajaritos… todos se fueron cuando el parque se quedó solo.' },
      { id: 'm4i-3', speaker: 'bolillo', emotion: 'neutral', text: 'Yo me quedé porque no tenía a dónde ir. Pero ellos sí podían irse… y se fueron.' },
      { id: 'm4i-4', speaker: 'bolillo', emotion: 'happy', text: 'Si aprendemos qué necesita cada animal, tal vez vuelvan. ¡Encuentra las parejas!', optional: true },
      { id: 'm4i-5', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Mariposas en este parque? No me hagan reír.' },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Éxito misión 4 — fauna regresa, Bolillo emocionado',
    lines: [
      { id: 'm4s-1', speaker: 'bolillo', emotion: 'excited', text: '¡{nombre}, mira! ¡Una mariposa! ¡Y ahí va una abeja! ¡Están volviendo!' },
      { id: 'm4s-2', speaker: 'bolillo', emotion: 'proud', text: 'Yo también soy parte de este parque. Los perros callejeros somos vecinos del barrio, igual que las mariposas y los pájaros.' },
      { id: 'm4s-3', speaker: 'bolillo', emotion: 'happy', text: 'Cuando un lugar es bueno para los animales, es bueno para todos.', optional: true },
      { id: 'm4s-4', speaker: 'nube-gris', emotion: 'angry', text: 'Uf… ya hasta se escucha demasiado alegre aquí.' },
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
      { id: 'm5i-1', speaker: 'bolillo', emotion: 'happy', text: '{nombre}, ya casi. El parque ya huele diferente. Ya huele a vida.' },
      { id: 'm5i-2', speaker: 'bolillo', emotion: 'thinking', text: 'Pero todavía falta algo: que la gente quiera volver. Un parque sin personas que lo cuiden se vuelve a dormir.' },
      { id: 'm5i-3', speaker: 'don-tono', emotion: 'happy', text: 'Yo traje pintura. No pregunten desde cuándo la tenía guardada.', optional: true },
      { id: 'm5i-4', speaker: 'bolillo', emotion: 'excited', text: '¡Arrastra cada cosa a su lugar, {nombre}! Bancas, juegos, letreros… ¡que este parque despierte de verdad!' },
    ],
  },
  'mission-5-success': {
    id: 'mission-5-success',
    context: 'Éxito misión 5 — Bolillo feliz, parque completo',
    lines: [
      { id: 'm5s-1', speaker: 'bolillo', emotion: 'proud', text: '{nombre}… mira lo que hicimos. Este parque ya no está dormido.' },
      { id: 'm5s-2', speaker: 'bolillo', emotion: 'happy', text: 'Yo empecé escondido y con miedo. Pero ustedes no me corrieron. Me dieron espacio, agua y un lugar seguro.' },
      { id: 'm5s-3', speaker: 'bolillo', emotion: 'excited', text: '¡Y ahora puedo echarme aquí a la sombra, tranquilo, con la cola suelta!' },
      { id: 'm5s-4', speaker: 'nico', emotion: 'excited', text: '¡Ahora sí quiero venir todos los días!', optional: true },
      { id: 'm5s-5', speaker: 'vale', emotion: 'happy', text: 'Un parque bonito mejora todo alrededor.' },
      { id: 'm5s-6', speaker: 'nube-gris', emotion: 'angry', text: 'Ya no me gusta nada este lugar…' },
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
      { id: 'e-1', speaker: 'bolillo', emotion: 'proud', text: '{nombre}, lo logramos. El parque despertó.' },
      { id: 'e-2', speaker: 'bolillo', emotion: 'happy', text: 'Yo viví aquí cuando nadie venía. Cuando todo estaba seco, sucio y olvidado. Y me quedé porque no tenía a dónde ir.' },
      { id: 'e-3', speaker: 'bolillo', emotion: 'thinking', text: 'Pero ahora entiendo algo: no me quedé solo porque no podía irme. Me quedé porque este lugar todavía tenía algo bueno.', optional: true },
      { id: 'e-4', speaker: 'bolillo', emotion: 'excited', text: 'Y tú lo encontraste, {nombre}. Tú y la brigada lo despertaron.' },
      { id: 'e-5', speaker: 'bolillo', emotion: 'neutral', text: 'Hay muchos como yo en el barrio. Perros, gatos, pajaritos… todos buscamos un lugar seguro. No pedimos mucho: agua, sombra y que no nos hagan daño.' },
      { id: 'e-6', speaker: 'lila', emotion: 'proud', text: 'Un barrio verde cuida a todos sus habitantes.' },
      { id: 'e-7', speaker: 'don-tono', emotion: 'happy', text: 'Esto sí parece corazón de barrio.', optional: true },
      { id: 'e-8', speaker: 'nube-gris', emotion: 'angry', text: 'Muy bonito todo… pero todavía me quedan calles, tuberías y azoteas.' },
      { id: 'e-9', speaker: 'bolillo', emotion: 'excited', text: '¡Seguiremos, {nombre}! Yo voy con ustedes. Ahora sí tengo brigada. 🐕' },
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
