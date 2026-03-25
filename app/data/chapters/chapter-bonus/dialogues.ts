import type { DialoguePool } from '~/shared/types/character'

export const chapterBonusDialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — Cinemática: los animales desaparecen =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática — siluetas de animales mexicanos desvaneciéndose, bosques talados',
    lines: [
      { id: 'ci-1', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Animales en peligro? Bah, ya aparecerán otros. Así funciona la naturaleza, ¿no?' },
      { id: 'ci-2', speaker: 'xani', emotion: 'worried', text: '¡No! Cada especie es especial. Si desaparece, ya no vuelve. Por eso hay que cuidarlas.' },
    ],
  },

  // ===== ESCENA 1 — Bienvenida =====
  'welcome': {
    id: 'welcome',
    context: 'Xani presenta el tema, Bolillo se preocupa por los animales callejeros',
    lines: [
      { id: 'w-1', speaker: 'xani', emotion: 'worried', text: 'México es uno de los 5 países con más biodiversidad del mundo. Pero más de 2,500 especies están en riesgo.' },
      {
        id: 'w-2',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, ¿nos ayudas a conocer y proteger a los animales en peligro de nuestro país?',
        choices: [
          { id: 'help-1', text: '¡Vamos a protegerlos!' },
          { id: 'help-2', text: '¡Por la fauna de México!' },
          { id: 'help-3', text: '¡Claro que sí!' },
        ],
      },
      { id: 'w-3', speaker: 'xani', emotion: 'neutral', text: 'Hay animales que solo existen en México, como el ajolote. Si desaparecen aquí, desaparecen del planeta.', optional: true },
      { id: 'w-4', speaker: 'bolillo', emotion: 'worried', text: '*ladra preocupado* (Bolillo sabe lo que es estar solo en la calle. Quiere ayudar.)' },
    ],
  },

  // ===== ESCENA 2 — Exploración =====
  'observation': {
    id: 'observation',
    context: 'Exploración del barrio buscando señales de fauna y amenazas',
    lines: [
      { id: 'obs-1', speaker: 'xani', emotion: 'thinking', text: '{nombre}, explora el barrio y toca cada señal. Hay pistas sobre los animales que necesitan nuestra ayuda.' },
    ],
  },

  'observation-axolotl': {
    id: 'observation-axolotl',
    context: 'Spot del ajolote',
    lines: [
      { id: 'oa-1', speaker: 'xani', emotion: 'sad', text: 'El ajolote solo vive en los canales de Xochimilco, Ciudad de México. La contaminación del agua le hace mucho daño.' },
      { id: 'oa-2', speaker: 'xani', emotion: 'neutral', text: 'Quedan menos de 1,000 ajolotes en libertad. Es el anfibio más amenazado del mundo.', optional: true },
    ],
  },

  'observation-vaquita': {
    id: 'observation-vaquita',
    context: 'Spot de la vaquita marina',
    lines: [
      { id: 'ov-1', speaker: 'xani', emotion: 'sad', text: 'La vaquita marina vive solo en el Golfo de California. Quedan menos de 10. Las redes de pesca ilegales son su peor enemigo.' },
    ],
  },

  'observation-jaguar': {
    id: 'observation-jaguar',
    context: 'Spot del jaguar',
    lines: [
      { id: 'oj-1', speaker: 'xani', emotion: 'worried', text: 'El jaguar necesita grandes extensiones de selva para sobrevivir. La deforestación destruye su hogar.' },
    ],
  },

  'observation-monarch': {
    id: 'observation-monarch',
    context: 'Spot de la mariposa monarca',
    lines: [
      { id: 'om-1', speaker: 'xani', emotion: 'thinking', text: 'Las mariposas monarca viajan desde Canadá hasta Michoacán cada invierno. La tala de bosques amenaza sus refugios.' },
    ],
  },

  'observation-wolf': {
    id: 'observation-wolf',
    context: 'Spot del lobo mexicano',
    lines: [
      { id: 'ol-1', speaker: 'xani', emotion: 'sad', text: 'El lobo mexicano casi se extinguió. Gracias a programas de cría, hoy hay unos 200 en libertad en la Sierra Madre.' },
    ],
  },

  'observation-ok-1': {
    id: 'observation-ok-1',
    context: 'Spot falso — paloma',
    lines: [
      { id: 'ok1-1', speaker: 'xani', emotion: 'happy', text: 'Esa es una paloma común. No está en peligro. Busca a los animales que realmente necesitan ayuda.' },
    ],
  },

  'observation-ok-2': {
    id: 'observation-ok-2',
    context: 'Spot falso — gorrión',
    lines: [
      { id: 'ok2-1', speaker: 'xani', emotion: 'neutral', text: 'Los gorriones están bien por ahora. Enfócate en las especies que están desapareciendo.' },
    ],
  },

  'observation-complete': {
    id: 'observation-complete',
    context: 'Completaste la exploración',
    lines: [
      { id: 'oc-1', speaker: 'xani', emotion: 'proud', text: '¡Excelente, {nombre}! Ya conoces a las especies en mayor riesgo. Ahora vamos a aprender cómo protegerlas.' },
      { id: 'oc-2', speaker: 'bolillo', emotion: 'happy', text: '*mueve la cola* (Bolillo está listo para la misión.)' },
    ],
  },

  // ===== MISIÓN 1 — Identificar especies en peligro =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro: encontrar especies en peligro entre varias',
    lines: [
      { id: 'm1i-1', speaker: 'xani', emotion: 'thinking', text: 'Mira con atención. Algunos de estos animales están en peligro de extinción en México y otros no. ¿Puedes identificarlos?' },
      { id: 'm1i-2', speaker: 'lila', emotion: 'neutral', text: 'Toca solo los que estén en peligro. ¡No te confundas con los que están bien!', optional: true },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito: identificaste las especies',
    lines: [
      { id: 'm1s-1', speaker: 'xani', emotion: 'excited', text: '¡Los identificaste todos! Conocer a las especies en peligro es el primer paso para protegerlas.' },
      { id: 'm1s-2', speaker: 'lila', emotion: 'proud', text: 'Ahora veamos por qué están en peligro.' },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo: confundiste especies',
    lines: [
      { id: 'm1f-1', speaker: 'xani', emotion: 'neutral', text: 'Algunas especies se confunden. Fíjate en las que solo existen en México o que son muy pocas.' },
    ],
  },

  // ===== MISIÓN 2 — Memorama: animal + amenaza =====
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro: emparejar animal con su amenaza',
    lines: [
      { id: 'm2i-1', speaker: 'xani', emotion: 'thinking', text: 'Cada especie en peligro enfrenta una amenaza diferente. Encuentra las parejas: animal con lo que más le afecta.' },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito: parejas encontradas',
    lines: [
      { id: 'm2s-1', speaker: 'xani', emotion: 'proud', text: '¡Perfecto! Ahora sabes qué amenaza a cada especie. Ese conocimiento es poder para ayudarlas.' },
      { id: 'm2s-2', speaker: 'bolillo', emotion: 'happy', text: '*ladra contento* (¡Bolillo celebra!)' },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo: parejas incorrectas',
    lines: [
      { id: 'm2f-1', speaker: 'xani', emotion: 'neutral', text: 'Esas cartas no son pareja. Cada animal tiene una amenaza específica. Intenta recordar lo que aprendimos.' },
    ],
  },

  // ===== MISIÓN 3 — Clasificar amenazas (swipe) =====
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro: clasificar amenazas humanas vs naturales',
    lines: [
      { id: 'm3i-1', speaker: 'lila', emotion: 'thinking', text: 'Algunas amenazas las causamos los humanos y otras son naturales. Clasifícalas correctamente.' },
      { id: 'm3i-2', speaker: 'xani', emotion: 'neutral', text: 'Entender el origen de cada amenaza nos ayuda a saber dónde podemos actuar.', optional: true },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito: amenazas clasificadas',
    lines: [
      { id: 'm3s-1', speaker: 'xani', emotion: 'excited', text: '¡Muy bien! La mayoría de las amenazas son causadas por humanos. Eso significa que nosotros podemos cambiar las cosas.' },
      { id: 'm3s-2', speaker: 'lila', emotion: 'proud', text: 'Si el problema lo causamos nosotros, la solución también está en nuestras manos.' },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo: clasificación incorrecta',
    lines: [
      { id: 'm3f-1', speaker: 'xani', emotion: 'neutral', text: 'Fíjate en quién causa cada amenaza. La deforestación y la contaminación son causadas por humanos.' },
    ],
  },

  // ===== MISIÓN 4 — Quiz de conservación =====
  'mission-4-intro': {
    id: 'mission-4-intro',
    context: 'Intro: quiz sobre acciones de conservación',
    lines: [
      { id: 'm4i-1', speaker: 'lila', emotion: 'excited', text: '¡Es hora de actuar! Responde rápido: ¿qué podemos hacer para proteger a la fauna mexicana?' },
      { id: 'm4i-2', speaker: 'xani', emotion: 'neutral', text: 'No todas las acciones funcionan igual. Piensa bien antes de contestar.', optional: true },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Éxito: quiz completado',
    lines: [
      { id: 'm4s-1', speaker: 'xani', emotion: 'proud', text: '¡Excelente, {nombre}! Ya sabes cómo ayudar a la fauna mexicana desde tu barrio.' },
      { id: 'm4s-2', speaker: 'lila', emotion: 'excited', text: 'Pequeñas acciones como no comprar animales exóticos y cuidar los ríos hacen una gran diferencia.' },
    ],
  },
  'mission-4-failure': {
    id: 'mission-4-failure',
    context: 'Fallo: respuestas incorrectas',
    lines: [
      { id: 'm4f-1', speaker: 'xani', emotion: 'neutral', text: 'No te preocupes. Piensa en acciones que protejan el hábitat y no dañen a los animales directamente.' },
    ],
  },

  // ===== MISIÓN 5 — Secuencia: construir refugio =====
  'mission-5-intro': {
    id: 'mission-5-intro',
    context: 'Intro: ordenar pasos para crear refugio',
    lines: [
      { id: 'm5i-1', speaker: 'lila', emotion: 'excited', text: '¡Vamos a crear un refugio para vida silvestre en el barrio! Ordena los pasos correctamente.' },
      { id: 'm5i-2', speaker: 'xani', emotion: 'thinking', text: 'Un refugio necesita planeación. Cada paso tiene un orden lógico.', optional: true },
    ],
  },
  'mission-5-success': {
    id: 'mission-5-success',
    context: 'Éxito: refugio construido',
    lines: [
      { id: 'm5s-1', speaker: 'xani', emotion: 'excited', text: '¡El refugio está listo! Ahora los animales del barrio tienen un espacio seguro.' },
      { id: 'm5s-2', speaker: 'bolillo', emotion: 'excited', text: '*corre en círculos feliz* (¡Bolillo aprueba el refugio!)' },
      { id: 'm5s-3', speaker: 'lila', emotion: 'proud', text: 'Recuerda: cualquier jardín, parque o espacio verde puede ser un mini-refugio para la fauna local.' },
    ],
  },
  'mission-5-failure': {
    id: 'mission-5-failure',
    context: 'Fallo: orden incorrecto',
    lines: [
      { id: 'm5f-1', speaker: 'xani', emotion: 'neutral', text: 'El orden importa. Primero necesitas un lugar seguro, luego plantas nativas, y al final agua y señalización.' },
    ],
  },

  // ===== TRANSFORMACIÓN =====
  'chapter-bonus-ending': {
    id: 'chapter-bonus-ending',
    context: 'Cierre emocional — el barrio ahora protege a la fauna',
    lines: [
      { id: 'end-1', speaker: 'xani', emotion: 'proud', text: 'Mira cómo cambió el barrio. Ahora es un lugar donde la fauna tiene una oportunidad.' },
      { id: 'end-2', speaker: 'nube-gris', emotion: 'worried', text: '¿Mariposas en el barrio? ¿Refugios para animales? Esto se me sale de control...' },
      { id: 'end-3', speaker: 'lila', emotion: 'excited', text: '{nombre}, cada especie que protegemos es una victoria para México y para el planeta.' },
      { id: 'end-4', speaker: 'bolillo', emotion: 'excited', text: '*ladra con orgullo y mueve la cola* (Bolillo sabe que todos merecen un hogar seguro.)' },
    ],
  },

  // ===== HOOK — siguiente capítulo =====
  'chapter-6-hook': {
    id: 'chapter-6-hook',
    context: 'Anticipo del festival final',
    lines: [
      { id: 'h-1', speaker: 'lila', emotion: 'excited', text: 'El barrio ha cambiado mucho. Es hora de celebrarlo con toda la comunidad...' },
      { id: 'h-2', speaker: 'xani', emotion: 'happy', text: '¡El Gran Festival Verde nos espera!' },
    ],
  },

  // ===== OBSERVATION SPOTS (para spots con dialogueId especial) =====
  'observation-weight': {
    id: 'observation-weight',
    context: 'Spot: observación general de la exploración',
    lines: [
      { id: 'ow-1', speaker: 'xani', emotion: 'thinking', text: 'Mira esa zona. Parece que antes había más animales por aquí. La urbanización los ha desplazado.' },
    ],
  },
}
