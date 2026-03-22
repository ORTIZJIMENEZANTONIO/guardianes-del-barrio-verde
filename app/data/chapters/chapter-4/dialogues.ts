import type { DialoguePool } from '~/shared/types/character'

export const chapter4Dialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — La basura invade la calle =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática breve — Vale nota basura por todos lados, Nube Gris se burla',
    lines: [
      { id: 'ci-1', speaker: 'nube-gris', emotion: 'mischievous', text: 'Basura por aquí, basura por allá... mi tipo de decoración.' },
      { id: 'ci-2', speaker: 'vale', emotion: 'worried', text: 'Bolsas rotas, botellas, cartón mojado. Todo revuelto y nadie ha separado nada.' },
    ],
  },

  // ===== ESCENA 1 — Bienvenida =====
  'welcome': {
    id: 'welcome',
    context: 'Lila invita al jugador, Vale explica el problema, choices',
    lines: [
      { id: 'w-1', speaker: 'lila', emotion: 'excited', text: '¡{nombre}! Esta calle tiene un problema serio con la basura.' },
      {
        id: 'w-2',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, ¿nos ayudas a limpiar esta calle y armar la ruta de la basura?',
        choices: [
          { id: 'join-1', text: '¡Vamos a reciclar!' },
          { id: 'join-2', text: '¡Por una calle limpia!' },
          { id: 'join-3', text: '¡Claro que sí!' },
        ],
      },
      { id: 'w-3', speaker: 'timo', emotion: 'excited', text: 'Si aprendemos a separar la basura, ¡podemos darle una segunda vida a muchas cosas!' },
    ],
  },

  // ===== ESCENA 2 — Exploración =====
  'observation': {
    id: 'observation',
    context: 'Exploración de la calle contaminada — hint breve',
    lines: [
      { id: 'obs-1', speaker: 'vale', emotion: 'thinking', text: '{nombre}, recorre la calle y toca lo que te parezca un problema. No todo es obvio.' },
    ],
  },

  // Spot 1 — Montón de basura mezclada
  'observation-trash-pile': {
    id: 'observation-trash-pile',
    context: 'Al tocar el montón de basura',
    lines: [
      { id: 'otp-1', speaker: 'vale', emotion: 'sad', text: 'Todo revuelto: cáscaras, botellas, cartón... así no se puede reciclar nada.' },
      { id: 'otp-2', speaker: 'timo', emotion: 'thinking', text: 'Separar es el primer paso. Sin eso, todo se desperdicia.', optional: true },
    ],
  },

  // Spot 2 — Coladera tapada
  'observation-clogged-drain': {
    id: 'observation-clogged-drain',
    context: 'Al tocar la coladera tapada',
    lines: [
      { id: 'ocd-1', speaker: 'timo', emotion: 'worried', text: 'La coladera está tapada con basura. Si llueve, se va a inundar.' },
    ],
  },

  // Spot 3 — Suelo contaminado
  'observation-contaminated-soil': {
    id: 'observation-contaminated-soil',
    context: 'Al tocar el suelo manchado',
    lines: [
      { id: 'ocs-1', speaker: 'xani', emotion: 'sad', text: 'El suelo tiene manchas oscuras. Eso es lixiviado: el líquido que suelta la basura cuando se pudre.' },
    ],
  },

  // Spot 4 — Tiradero clandestino
  'observation-illegal-dump': {
    id: 'observation-illegal-dump',
    context: 'Al tocar el tiradero clandestino',
    lines: [
      { id: 'oid-1', speaker: 'vale', emotion: 'angry', text: '¡Un tiradero clandestino! Alguien trae su basura de noche y la deja aquí.' },
      { id: 'oid-2', speaker: 'lila', emotion: 'thinking', text: 'Cuando no hay contenedores ni rutas, la gente tira donde puede.', optional: true },
    ],
  },

  // Spot 5 — Arroyo contaminado
  'observation-polluted-creek': {
    id: 'observation-polluted-creek',
    context: 'Al tocar el arroyo con basura',
    lines: [
      { id: 'opc-1', speaker: 'xani', emotion: 'sad', text: 'El agua del arroyo trae bolsas y botellas. La basura de la calle termina en el agua.' },
    ],
  },

  // Spot OK 1 — Jardín limpio
  'observation-ok-1': {
    id: 'observation-ok-1',
    context: 'Spot falso — jardín limpio',
    lines: [
      { id: 'ok1-1', speaker: 'xani', emotion: 'happy', text: 'Este jardín está bien cuidado. Alguien sí se preocupa por mantenerlo limpio.' },
    ],
  },

  // Spot OK 2 — Pared con mural
  'observation-ok-2': {
    id: 'observation-ok-2',
    context: 'Spot falso — pared con mural',
    lines: [
      { id: 'ok2-1', speaker: 'vale', emotion: 'neutral', text: 'Ese mural es bonito, pero no es un problema. ¡Sigue buscando!' },
    ],
  },

  'observation-complete': {
    id: 'observation-complete',
    context: 'Al detectar los 5 problemas',
    lines: [
      { id: 'oc-1', speaker: 'vale', emotion: 'thinking', text: '¡Listo, {nombre}! Ahora sabemos qué tan grave está la situación.' },
      { id: 'oc-2', speaker: 'timo', emotion: 'excited', text: 'Basura mezclada, coladeras tapadas, tiraderos... pero todo tiene solución si trabajamos juntos.' },
    ],
  },

  // ===== MISIÓN 1 — Recolectar basura (tap) =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro misión 1 — recolectar basura de la calle',
    lines: [
      { id: 'm1i-1', speaker: 'vale', emotion: 'excited', text: '{nombre}, antes de separar hay que recoger. ¡Toca cada residuo para recolectarlo!' },
      { id: 'm1i-2', speaker: 'timo', emotion: 'happy', text: 'Botellas, bolsas, cartón, cáscaras... todo lo que veas tirado en la calle.' },
      { id: 'm1i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¿De verdad van a recoger todo eso? ¡Si está perfecto donde está!', optional: true },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito misión 1',
    lines: [
      { id: 'm1s-1', speaker: 'vale', emotion: 'happy', text: '¡Muy bien, {nombre}! La calle ya se ve diferente.' },
      { id: 'm1s-2', speaker: 'timo', emotion: 'excited', text: 'Ahora viene lo importante: separar todo esto.', optional: true },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo misión 1',
    lines: [
      { id: 'm1f-1', speaker: 'vale', emotion: 'neutral', text: 'Todavía hay basura por ahí, {nombre}. ¡Inténtalo otra vez!' },
    ],
  },

  // ===== MISIÓN 2 — Separar residuos (drag-drop) =====
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro misión 2 — separar en 4 contenedores',
    lines: [
      { id: 'm2i-1', speaker: 'vale', emotion: 'thinking', text: '{nombre}, cada residuo tiene su lugar. ¡Nada de mezclar!' },
      { id: 'm2i-2', speaker: 'timo', emotion: 'excited', text: 'Verde para orgánico, azul para reciclable, amarillo para papel y gris para no reciclable. ¡Arrastra cada cosa!' },
      { id: 'm2i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¡Todo a la misma bolsa! ¿Para qué complicarse?', optional: true },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito misión 2',
    lines: [
      { id: 'm2s-1', speaker: 'vale', emotion: 'proud', text: '¡{nombre}, lo lograste! Cada residuo en su lugar.' },
      { id: 'm2s-2', speaker: 'timo', emotion: 'happy', text: 'Cuando separas, le das una oportunidad al planeta.', optional: true },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo misión 2',
    lines: [
      { id: 'm2f-1', speaker: 'vale', emotion: 'neutral', text: 'Piensa en el material, {nombre}. ¿Es orgánico, reciclable, papel o no reciclable?' },
    ],
  },

  // ===== MISIÓN 3 — Detectar contaminación (tap-detect) =====
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro misión 3 — encontrar focos de contaminación',
    lines: [
      { id: 'm3i-1', speaker: 'timo', emotion: 'thinking', text: '{nombre}, la basura no solo se ve fea. También contamina el suelo, el agua y el aire.' },
      { id: 'm3i-2', speaker: 'vale', emotion: 'neutral', text: 'Toca los puntos de la calle para investigar. No todos son contaminación, pero 4 sí lo son.' },
      { id: 'm3i-3', speaker: 'xani', emotion: 'thinking', text: 'Busca señales: manchas en el suelo, humo, basura en el agua, olores fuertes...', optional: true },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito misión 3',
    lines: [
      { id: 'm3s-1', speaker: 'timo', emotion: 'proud', text: '¡Bien, {nombre}! Detectaste los 4 focos de contaminación.' },
      { id: 'm3s-2', speaker: 'vale', emotion: 'thinking', text: 'Si la basura se maneja bien desde el principio, nada de esto pasa.', optional: true },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo misión 3',
    lines: [
      { id: 'm3f-1', speaker: 'timo', emotion: 'thinking', text: 'No todo es contaminación, {nombre}. Observa bien las señales.' },
    ],
  },

  // ===== MISIÓN 4 — Hacer composta (placement) =====
  'mission-4-intro': {
    id: 'mission-4-intro',
    context: 'Intro misión 4 — armar las capas de la composta',
    lines: [
      { id: 'm4i-1', speaker: 'vale', emotion: 'excited', text: '{nombre}, los restos de comida y hojas se convierten en tierra fértil. ¡Eso es la composta!' },
      { id: 'm4i-2', speaker: 'lila', emotion: 'excited', text: '¡Arma la composta capa por capa! Residuos, hojas secas, tierra, agua y tapa.' },
      { id: 'm4i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Tierra de basura? ¡Qué asco!', optional: true },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Éxito misión 4',
    lines: [
      { id: 'm4s-1', speaker: 'vale', emotion: 'proud', text: '¡Excelente, {nombre}! En 2-3 meses esa composta será el mejor alimento para las plantas.' },
      { id: 'm4s-2', speaker: 'timo', emotion: 'happy', text: 'Los residuos orgánicos no van al basurero. ¡Se convierten en nutrientes!', optional: true },
    ],
  },
  'mission-4-failure': {
    id: 'mission-4-failure',
    context: 'Fallo misión 4',
    lines: [
      { id: 'm4f-1', speaker: 'vale', emotion: 'thinking', text: 'Recuerda el orden, {nombre}: residuos → hojas secas → tierra → agua → tapar.' },
    ],
  },

  // ===== MISIÓN 5 — Centro de reciclaje (memorama) =====
  'mission-5-intro': {
    id: 'mission-5-intro',
    context: 'Intro misión 5 — parejas de material y producto reciclado',
    lines: [
      { id: 'm5i-1', speaker: 'timo', emotion: 'excited', text: '¡{nombre}, la basura puede convertirse en algo nuevo! Botellas en playeras, latas en bicis.' },
      { id: 'm5i-2', speaker: 'vale', emotion: 'excited', text: '¡Encuentra las parejas: cada material con lo que se puede hacer con él!' },
      { id: 'm5i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Basura que se transforma? Eso suena a cuento de hadas.', optional: true },
    ],
  },
  'mission-5-success': {
    id: 'mission-5-success',
    context: 'Éxito misión 5',
    lines: [
      { id: 'm5s-1', speaker: 'timo', emotion: 'proud', text: '¡{nombre}, lo hiciste! Cada material tiene una segunda vida.' },
      { id: 'm5s-2', speaker: 'lila', emotion: 'proud', text: 'No era basura, Nube. Eran recursos esperando una segunda oportunidad.', optional: true },
    ],
  },
  'mission-5-failure': {
    id: 'mission-5-failure',
    context: 'Fallo misión 5',
    lines: [
      { id: 'm5f-1', speaker: 'timo', emotion: 'neutral', text: 'Piensa en de qué está hecho cada cosa, {nombre}. ¡Tú puedes!' },
    ],
  },

  // ===== ESCENA FINAL — Celebración y reflexión =====
  'chapter-4-ending': {
    id: 'chapter-4-ending',
    context: 'Cierre del capítulo 4 — calle limpia, reciclaje funcionando',
    lines: [
      { id: 'e-1', speaker: 'lila', emotion: 'proud', text: '¡Lo logramos, {nombre}! La ruta de la basura está funcionando.' },
      { id: 'e-2', speaker: 'vale', emotion: 'proud', text: 'Cada vez que alguien separa su basura, está eligiendo cuidar el barrio.' },
      { id: 'e-3', speaker: 'nube-gris', emotion: 'angry', text: 'Pfff... todavía me quedan azoteas y festivales.' },
    ],
  },

  // ===== Gancho al Capítulo 5 =====
  'chapter-5-hook': {
    id: 'chapter-5-hook',
    context: 'Gancho al capítulo 5 — Azoteas con Vida',
    lines: [
      { id: 'h-1', speaker: 'timo', emotion: 'thinking', text: '{nombre}, ya limpiamos calles, parques y agua. Pero mira hacia arriba...' },
      { id: 'h-2', speaker: 'xani', emotion: 'excited', text: 'Las azoteas. Están vacías, grises y llenas de calor. ¡Pero podrían estar llenas de vida!' },
      { id: 'h-3', speaker: 'lila', emotion: 'excited', text: '¡Siguiente misión: las azoteas! ¿Vienes, {nombre}?', optional: true },
    ],
  },
}
