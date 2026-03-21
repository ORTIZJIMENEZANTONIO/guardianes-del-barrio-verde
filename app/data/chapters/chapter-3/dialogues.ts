import type { DialoguePool } from '~/shared/types/character'

export const chapter3Dialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — El agua fuera de lugar =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática — calle con fuga enorme, charco, basura flotando, zona húmeda cercana',
    lines: [
      { id: 'ci-1', speaker: 'timo', emotion: 'worried', text: 'Eso ya no es una fuga pequeña…' },
      { id: 'ci-2', speaker: 'lila', emotion: 'sad', text: 'Se está desperdiciando muchísima agua.' },
      { id: 'ci-3', speaker: 'xani', emotion: 'thinking', text: 'Y además está llegando mal a esta zona.', optional: true },
      { id: 'ci-4', speaker: 'don-tono', emotion: 'sad', text: 'Antes aquí siempre había un rincón húmedo con plantas raritas y pajaritos.' },
      { id: 'ci-5', speaker: 'nube-gris', emotion: 'mischievous', text: 'Agua tirándose, lodo, basura… qué bonito desastre.' },
    ],
  },

  // ===== ESCENA 1 — Descubriendo el rincón húmedo =====
  'discovery': {
    id: 'discovery',
    context: 'El equipo descubre el humedal urbano, Xani explica',
    lines: [
      { id: 'd-1', speaker: 'nico', emotion: 'surprised', text: '¿Qué es este lugar? Parece un charco con plantas.' },
      { id: 'd-2', speaker: 'xani', emotion: 'neutral', text: 'No es solo un charco. Es una zona húmeda que ayuda al agua y a la vida.' },
      { id: 'd-3', speaker: 'timo', emotion: 'thinking', text: 'Como una esponja natural.' },
      { id: 'd-4', speaker: 'xani', emotion: 'happy', text: 'Sí. Lugares así pueden retener agua, ayudar a filtrarla y servir de hogar para plantas y animales.' },
      { id: 'd-5', speaker: 'lila', emotion: 'thinking', text: 'Entonces si la fuga y la basura lo dañan, perdemos más que solo agua.', optional: true },
      { id: 'd-6', speaker: 'xani', emotion: 'neutral', text: 'Exacto. Un humedal es donde el agua y la tierra se encuentran. Puede guardar agua, filtrarla y dar hogar a muchas formas de vida.' },
      {
        id: 'd-7',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, ¿nos ayudas a cuidar el agua y este rincón húmedo?',
        choices: [
          { id: 'help-1', text: '¡Vamos a reparar todo!' },
          { id: 'help-2', text: '¡Por el agua y el humedal!' },
          { id: 'help-3', text: '¡Claro que sí!' },
        ],
      },
    ],
  },

  // ===== MISIÓN 1 — Controlar el desperdicio =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro misión 1 — detener el desorden urgente',
    lines: [
      { id: 'm1i-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, primero vamos a detener el desorden.' },
      { id: 'm1i-2', speaker: 'timo', emotion: 'worried', text: 'Si el agua sigue corriendo así, todo empeora.' },
      { id: 'm1i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¡Déjenla correr! ¡Así estaba divertidísimo!', optional: true },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito misión 1 — charco baja, paso despejado',
    lines: [
      { id: 'm1s-1', speaker: 'lila', emotion: 'happy', text: 'Bien, {nombre}. Ahora ya podemos arreglar lo importante.' },
      { id: 'm1s-2', speaker: 'xani', emotion: 'happy', text: 'Y el rincón húmedo ya no está recibiendo tanta suciedad.' },
      { id: 'm1s-3', speaker: 'timo', emotion: 'excited', text: '¡Se ve mucho mejor por aquí!', optional: true },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo misión 1',
    lines: [
      { id: 'm1f-1', speaker: 'lila', emotion: 'neutral', text: 'Todavía hay desorden, {nombre}. ¡Inténtalo otra vez!' },
    ],
  },

  // ===== MISIÓN 2 — Proteger el humedal del barrio =====
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro misión 2 — cuidar el humedal',
    lines: [
      { id: 'm2i-1', speaker: 'xani', emotion: 'excited', text: '{nombre}, ahora vamos a cuidar esta parte.' },
      { id: 'm2i-2', speaker: 'nico', emotion: 'surprised', text: '¿De verdad un lugar así ayuda?', optional: true },
      { id: 'm2i-3', speaker: 'xani', emotion: 'neutral', text: 'Sí. Aunque sea pequeño, puede guardar humedad, ayudar a limpiar el agua y dar vida al barrio.' },
      { id: 'm2i-4', speaker: 'timo', emotion: 'happy', text: 'En resumen: no es un lodito inútil.', optional: true },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito misión 2 — humedal sano, aves e insectos aparecen',
    lines: [
      { id: 'm2s-1', speaker: 'xani', emotion: 'proud', text: 'Mucho mejor, {nombre}. Un humedal sano ayuda al agua y a la vida.' },
      { id: 'm2s-2', speaker: 'lila', emotion: 'happy', text: 'Entonces no solo cuidamos una fuga. También protegimos un espacio importante.' },
      { id: 'm2s-3', speaker: 'nico', emotion: 'excited', text: '¡Mira, ya se ve mejor!', optional: true },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo misión 2',
    lines: [
      { id: 'm2f-1', speaker: 'xani', emotion: 'neutral', text: 'Esa planta no va ahí, {nombre}. Piensa en qué necesita el humedal.' },
    ],
  },

  // ===== MISIÓN 3 — Reparar y redirigir el agua =====
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro misión 3 — reparación final de la tubería',
    lines: [
      { id: 'm3i-1', speaker: 'timo', emotion: 'excited', text: '{nombre}, ahora sí: la reparación final.' },
      { id: 'm3i-2', speaker: 'lila', emotion: 'neutral', text: 'Si lo hacemos bien, dejamos de desperdiciar agua.' },
      { id: 'm3i-3', speaker: 'xani', emotion: 'thinking', text: 'Y también evitamos que llegue con demasiada fuerza a la zona húmeda.', optional: true },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito misión 3 — fuga reparada, agua controlada',
    lines: [
      { id: 'm3s-1', speaker: 'timo', emotion: 'proud', text: '¡Listo, {nombre}! Agua bajo control. 💧' },
      { id: 'm3s-2', speaker: 'xani', emotion: 'happy', text: 'Ahora el agua está donde debe estar.' },
      { id: 'm3s-3', speaker: 'don-tono', emotion: 'happy', text: 'Y ese rinconcito volvió a verse vivo.', optional: true },
      { id: 'm3s-4', speaker: 'nube-gris', emotion: 'angry', text: 'Cada vez me dejan menos caos…' },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo misión 3',
    lines: [
      { id: 'm3f-1', speaker: 'timo', emotion: 'thinking', text: 'Esa pieza no va ahí, {nombre}. Piensa en el camino del agua.' },
    ],
  },

  // ===== ESCENA FINAL — El agua vuelve a su equilibrio =====
  'chapter-3-ending': {
    id: 'chapter-3-ending',
    context: 'Cierre del capítulo 3 — antes y después',
    lines: [
      { id: 'e-1', speaker: 'lila', emotion: 'proud', text: '¡Lo logramos, {nombre}!' },
      { id: 'e-2', speaker: 'timo', emotion: 'happy', text: 'Arreglamos la fuga y salvamos agua.' },
      { id: 'e-3', speaker: 'xani', emotion: 'happy', text: 'Y también cuidamos un pequeño humedal.' },
      { id: 'e-4', speaker: 'nico', emotion: 'surprised', text: 'Yo pensé que era un charco raro…', optional: true },
      { id: 'e-5', speaker: 'xani', emotion: 'proud', text: 'Muchos lugares importantes parecen pequeños. Pero ayudan mucho.' },
      { id: 'e-6', speaker: 'don-tono', emotion: 'happy', text: 'Pues ya aprendimos algo nuevo todos, {nombre}.', optional: true },
      { id: 'e-7', speaker: 'nube-gris', emotion: 'angry', text: 'Todavía me quedan calles y azoteas…' },
    ],
  },

  // ===== Gancho al Capítulo 4 =====
  'chapter-4-hook': {
    id: 'chapter-4-hook',
    context: 'Gancho al capítulo 4 — La Ruta de la Basura',
    lines: [
      { id: 'h-1', speaker: 'lila', emotion: 'thinking', text: '{nombre}, ¿alguna vez te has preguntado a dónde va la basura?' },
      { id: 'h-2', speaker: 'timo', emotion: 'worried', text: 'Porque aquí en el barrio… parece que no va a ningún lado bueno.' },
      { id: 'h-3', speaker: 'xani', emotion: 'neutral', text: 'Es hora de seguir la ruta.', optional: true },
    ],
  },
}
