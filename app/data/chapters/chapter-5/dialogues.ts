import type { DialoguePool } from '~/shared/types/character'

export const chapter5Dialogues: Record<string, DialoguePool> = {
  // ===== ESCENA 0 — La azotea vacía =====
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática — azoteas grises bajo el sol, calor radiante, techos vacíos',
    lines: [
      { id: 'ci-1', speaker: 'xani', emotion: 'thinking', text: 'Miren todas esas azoteas… vacías y ardiendo bajo el sol.' },
      { id: 'ci-2', speaker: 'timo', emotion: 'worried', text: 'Son como sartenes gigantes. Todo ese calor baja a las casas.' },
      { id: 'ci-3', speaker: 'xani', emotion: 'sad', text: 'Una azotea gris puede alcanzar 70°C al mediodía. Y adentro se siente como horno.', optional: true },
      { id: 'ci-4', speaker: 'timo', emotion: 'excited', text: '¡Espera! ¿Y si convertimos un techo en jardín? He visto que se puede hacer.' },
      { id: 'ci-5', speaker: 'nube-gris', emotion: 'mischievous', text: 'Jaja, ¿plantas en un techo? Eso se va a morir solito.' },
    ],
  },

  // ===== ESCENA 1 — Bienvenida =====
  'welcome': {
    id: 'welcome',
    context: 'El equipo sube a la azotea, Xani y Timo lideran, referencia al IPN',
    lines: [
      { id: 'w-1', speaker: 'xani', emotion: 'excited', text: 'Las azoteas verdes no son ciencia ficción. En el Instituto Politécnico Nacional ya lo hacen.' },
      { id: 'w-2', speaker: 'timo', emotion: 'happy', text: 'El CIIEMAD del IPN investiga cómo poner jardines en techos para bajar la temperatura de los edificios.' },
      { id: 'w-3', speaker: 'xani', emotion: 'neutral', text: 'Una azotea verde reduce hasta 5°C la temperatura interior. Y además captura agua de lluvia.' },
      { id: 'w-4', speaker: 'lila', emotion: 'thinking', text: 'O sea que un techo con plantas enfría la casa, ahorra agua y da vida.', optional: true },
      { id: 'w-5', speaker: 'timo', emotion: 'excited', text: 'Y yo ya tengo ideas para el sistema de riego.' },
      {
        id: 'w-6',
        speaker: 'lila',
        emotion: 'excited',
        text: '{nombre}, ¿nos ayudas a convertir esta azotea en un jardín vivo?',
        choices: [
          { id: 'help-1', text: '¡Vamos a reverdecer el techo!' },
          { id: 'help-2', text: '¡Por las azoteas del barrio!' },
          { id: 'help-3', text: '¡Claro que sí!' },
        ],
      },
    ],
  },

  // ===== ESCENA 2 — Exploración de la azotea =====
  'observation': {
    id: 'observation',
    context: 'Exploración de la azotea, inspección de condiciones',
    lines: [
      { id: 'obs-1', speaker: 'timo', emotion: 'thinking', text: '{nombre}, antes de plantar hay que revisar todo. Toca cada zona para inspeccionarla.' },
    ],
  },

  'observation-structure': {
    id: 'observation-structure',
    context: 'Al tocar la estructura del techo',
    lines: [
      { id: 'os-1', speaker: 'timo', emotion: 'thinking', text: 'La estructura se ve firme. Pero hay que asegurarse de que aguante el peso extra.' },
      { id: 'os-2', speaker: 'xani', emotion: 'neutral', text: 'Una azotea verde pesa entre 60 y 150 kilos por metro cuadrado. No es poca cosa.', optional: true },
    ],
  },

  'observation-drain': {
    id: 'observation-drain',
    context: 'Al tocar el desagüe',
    lines: [
      { id: 'od-1', speaker: 'timo', emotion: 'worried', text: 'El desagüe está tapado con hojas. Hay que mantenerlo limpio para que el agua fluya.' },
    ],
  },

  'observation-sun': {
    id: 'observation-sun',
    context: 'Al tocar zona soleada',
    lines: [
      { id: 'osu-1', speaker: 'xani', emotion: 'excited', text: '¡Mucho sol! Perfecto para ciertas plantas, pero necesitaremos sombra para otras.' },
    ],
  },

  'observation-wateraccess': {
    id: 'observation-wateraccess',
    context: 'Al tocar la toma de agua',
    lines: [
      { id: 'ow-1', speaker: 'timo', emotion: 'happy', text: 'Hay una toma de agua cerca. Podemos conectar un sistema de captación de lluvia.' },
    ],
  },

  'observation-wall': {
    id: 'observation-wall',
    context: 'Al tocar el muro perimetral — está bien',
    lines: [
      { id: 'owa-1', speaker: 'timo', emotion: 'happy', text: 'El muro perimetral está en buenas condiciones. Nos protege del viento.' },
    ],
  },

  'observation-antenna': {
    id: 'observation-antenna',
    context: 'Al tocar la antena — no necesita revisión',
    lines: [
      { id: 'oa-1', speaker: 'timo', emotion: 'neutral', text: 'La antena no estorba. Podemos diseñar alrededor de ella.' },
    ],
  },

  'observation-complete': {
    id: 'observation-complete',
    context: 'Al detectar todos los spots',
    lines: [
      { id: 'occ-1', speaker: 'timo', emotion: 'excited', text: '¡Revisión completa, {nombre}! Esta azotea tiene potencial.' },
      { id: 'occ-2', speaker: 'xani', emotion: 'happy', text: 'Ahora sabemos con qué contamos. ¡Es hora de transformarla!' },
    ],
  },

  // ===== MISIÓN 0 — Construir techo verde (intro al capítulo) =====
  'mission-0-intro': {
    id: 'mission-0-intro',
    context: 'Intro techo verde — CIIEMAD/IPN',
    lines: [
      { id: 'm0i-1', speaker: 'timo', emotion: 'thinking', text: '{nombre}, mira este techo. Es puro concreto gris. ¡Absorbe todo el calor!' },
      { id: 'm0i-2', speaker: 'xani', emotion: 'excited', text: 'En el Instituto Politécnico Nacional hay un centro llamado CIIEMAD donde estudian techos verdes.' },
      { id: 'm0i-3', speaker: 'xani', emotion: 'thinking', text: 'Mira la diferencia: un techo gris llega a 70°C al sol. ¡Podrías freír un huevo!' },
      { id: 'm0i-4', speaker: 'xani', emotion: 'happy', text: 'Pero un techo verde con plantas solo llega a 35°C. ¡La mitad! Y absorbe el 40% del agua de lluvia.' },
      { id: 'm0i-5', speaker: 'timo', emotion: 'excited', text: 'Un techo verde es como un sándwich de capas. Cada una tiene su función. ¡Vamos a armarlo, {nombre}!' },
      { id: 'm0i-6', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Plantas en un techo? Eso no va a funcionar.', optional: true },
    ],
  },
  'mission-0-success': {
    id: 'mission-0-success',
    context: 'Éxito techo verde',
    lines: [
      { id: 'm0s-1', speaker: 'timo', emotion: 'proud', text: '¡{nombre}, lo armaste perfecto! Cada capa en su lugar.' },
      { id: 'm0s-2', speaker: 'xani', emotion: 'happy', text: 'Las plantas van a dar sombra, limpiar el aire y darle casa a mariposas y abejas.' },
      { id: 'm0s-3', speaker: 'lila', emotion: 'proud', text: 'En el CIIEMAD del Instituto Politécnico Nacional ya lo hacen. ¡Y ahora nosotros también!' },
      { id: 'm0s-4', speaker: 'nube-gris', emotion: 'angry', text: '¿Plantas arriba Y abajo? Esto ya no me gusta nada.', optional: true },
    ],
  },
  'mission-0-failure': {
    id: 'mission-0-failure',
    context: 'Fallo techo verde',
    lines: [
      { id: 'm0f-1', speaker: 'timo', emotion: 'thinking', text: 'El orden importa, {nombre}. Base → drenaje → filtro → tierra → plantas. ¡Inténtalo!' },
    ],
  },

  // ===== MISIÓN 1 — Evaluar la azotea =====
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro misión 1 — inspección técnica de la azotea',
    lines: [
      { id: 'm1i-1', speaker: 'timo', emotion: 'excited', text: '{nombre}, antes de poner una sola planta, hay que asegurarnos de que la azotea aguante.' },
      { id: 'm1i-2', speaker: 'xani', emotion: 'thinking', text: 'Hay 6 puntos para revisar, pero solo 4 necesitan atención. Toca cada uno para inspeccionarlo.' },
      { id: 'm1i-3', speaker: 'timo', emotion: 'neutral', text: 'Un buen ingeniero siempre revisa antes de construir.', optional: true },
      { id: 'm1i-4', speaker: 'nube-gris', emotion: 'mischievous', text: '¡Yo apuesto a que el techo se cae!' },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito misión 1 — azotea evaluada correctamente',
    lines: [
      { id: 'm1s-1', speaker: 'timo', emotion: 'proud', text: '¡Perfecto, {nombre}! La azotea está lista para el siguiente paso.' },
      { id: 'm1s-2', speaker: 'xani', emotion: 'happy', text: 'Capacidad de carga, drenaje, sol y acceso al agua: todo verificado.' },
      { id: 'm1s-3', speaker: 'timo', emotion: 'excited', text: '¡Ahora sí podemos diseñar!', optional: true },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo misión 1',
    lines: [
      { id: 'm1f-1', speaker: 'timo', emotion: 'neutral', text: 'Revisa bien, {nombre}. No todos los puntos necesitan atención. ¡Identifica los importantes!' },
    ],
  },

  // ===== MISIÓN 2 — Diseñar el espacio =====
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro misión 2 — diseño del espacio en la azotea',
    lines: [
      { id: 'm2i-1', speaker: 'xani', emotion: 'excited', text: '{nombre}, ahora viene lo divertido: diseñar la azotea verde.' },
      { id: 'm2i-2', speaker: 'timo', emotion: 'thinking', text: 'Hay que pensar bien qué va en cada lugar. No todo cabe en un techo.' },
      { id: 'm2i-3', speaker: 'xani', emotion: 'neutral', text: 'Necesitamos: un huerto, captador de agua, zona de descanso, jardineras, composta y paneles solares.', optional: true },
      { id: 'm2i-4', speaker: 'timo', emotion: 'happy', text: '¡Y cuidado con las ideas que no sirven para una azotea!' },
      { id: 'm2i-5', speaker: 'nube-gris', emotion: 'mischievous', text: '¡Yo pondría una alberca! Con resbaladilla.', optional: true },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito misión 2 — azotea diseñada',
    lines: [
      { id: 'm2s-1', speaker: 'xani', emotion: 'proud', text: '¡Excelente diseño, {nombre}! Cada elemento tiene su función.' },
      { id: 'm2s-2', speaker: 'timo', emotion: 'excited', text: 'Huerto para alimento, captador para agua, paneles para energía… ¡es una azotea inteligente!' },
      { id: 'm2s-3', speaker: 'don-tono', emotion: 'happy', text: 'Si todos los techos del barrio fueran así, otro gallo nos cantaría.', optional: true },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo misión 2',
    lines: [
      { id: 'm2f-1', speaker: 'timo', emotion: 'thinking', text: 'Piensa, {nombre}: ¿eso de verdad funciona en un techo? ¡Intenta con otra solución!' },
    ],
  },

  // ===== MISIÓN 3 — Elegir plantas =====
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro misión 3 — selección de plantas para la azotea',
    lines: [
      { id: 'm3i-1', speaker: 'xani', emotion: 'excited', text: '{nombre}, cada rincón de la azotea tiene condiciones diferentes.' },
      { id: 'm3i-2', speaker: 'xani', emotion: 'thinking', text: 'Las plantas de azotea deben ser resistentes: aguantar sol, viento y poca agua.' },
      { id: 'm3i-3', speaker: 'timo', emotion: 'neutral', text: 'Es como un rompecabezas: la planta correcta en el lugar correcto.', optional: true },
      { id: 'm3i-4', speaker: 'xani', emotion: 'happy', text: '¡Encuentra las parejas entre cada condición y su planta ideal!' },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito misión 3 — plantas bien elegidas',
    lines: [
      { id: 'm3s-1', speaker: 'xani', emotion: 'proud', text: '¡Perfecto, {nombre}! Cada planta en su lugar ideal.' },
      { id: 'm3s-2', speaker: 'xani', emotion: 'happy', text: 'Las suculentas en el sol directo, el helecho en la sombra, la lavanda donde hay viento…' },
      { id: 'm3s-3', speaker: 'timo', emotion: 'excited', text: '¡La azotea ya se ve verde!', optional: true },
      { id: 'm3s-4', speaker: 'bolillo', emotion: 'happy', text: '*olfatea las plantas desde abajo* ¡Huele bonito!' },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo misión 3',
    lines: [
      { id: 'm3f-1', speaker: 'xani', emotion: 'neutral', text: 'Esas no son pareja, {nombre}. Piensa: ¿qué necesita esa planta para sobrevivir?' },
    ],
  },

  // ===== MISIÓN 4 — Instalar riego =====
  'mission-4-intro': {
    id: 'mission-4-intro',
    context: 'Intro misión 4 — sistema de riego con agua de lluvia',
    lines: [
      { id: 'm4i-1', speaker: 'timo', emotion: 'excited', text: '{nombre}, última misión: ¡el sistema de riego!' },
      { id: 'm4i-2', speaker: 'timo', emotion: 'thinking', text: 'Vamos a conectar el captador de lluvia con las jardineras usando tuberías.' },
      { id: 'm4i-3', speaker: 'xani', emotion: 'neutral', text: 'El agua de lluvia es gratis y perfecta para regar. No tiene cloro y las plantas la aman.', optional: true },
      { id: 'm4i-4', speaker: 'timo', emotion: 'happy', text: '¡Arrastra cada pieza al lugar correcto! Pero cuidado, hay piezas que no sirven.' },
      { id: 'm4i-5', speaker: 'nube-gris', emotion: 'mischievous', text: '¡Ojalá les quede chueco!' },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Éxito misión 4 — riego instalado, agua fluye',
    lines: [
      { id: 'm4s-1', speaker: 'timo', emotion: 'proud', text: '¡Listo, {nombre}! El agua de lluvia ahora llega directa a las plantas.' },
      { id: 'm4s-2', speaker: 'xani', emotion: 'excited', text: 'Un captador de lluvia en la azotea puede recolectar cientos de litros al año.' },
      { id: 'm4s-3', speaker: 'timo', emotion: 'happy', text: 'Riego automático, ecológico y gratuito. ¡Así se hace!', optional: true },
      { id: 'm4s-4', speaker: 'nube-gris', emotion: 'angry', text: 'Hasta mi propia lluvia usan en mi contra…' },
    ],
  },
  'mission-4-failure': {
    id: 'mission-4-failure',
    context: 'Fallo misión 4',
    lines: [
      { id: 'm4f-1', speaker: 'timo', emotion: 'thinking', text: 'Esa pieza no encaja ahí, {nombre}. Piensa en el camino que debe seguir el agua.' },
    ],
  },

  // ===== ESCENA FINAL — Azotea transformada =====
  'chapter-5-ending': {
    id: 'chapter-5-ending',
    context: 'Cierre del capítulo 5 — la azotea es un jardín',
    lines: [
      { id: 'e-1', speaker: 'lila', emotion: 'proud', text: '¡Lo logramos, {nombre}!' },
      { id: 'e-2', speaker: 'xani', emotion: 'happy', text: 'Donde antes había concreto gris, ahora hay vida.' },
      { id: 'e-3', speaker: 'timo', emotion: 'excited', text: 'Huerto, captador de lluvia, paneles solares y plantas en un solo techo.' },
      { id: 'e-4', speaker: 'xani', emotion: 'proud', text: 'Si cada edificio del barrio tuviera una azotea verde, la temperatura bajaría varios grados.' },
      { id: 'e-5', speaker: 'don-tono', emotion: 'happy', text: 'Yo quiero una así en mi casa. ¿Quién me ayuda?', optional: true },
      { id: 'e-6', speaker: 'vale', emotion: 'excited', text: '¡Podríamos vender las verduras del huerto en mi tienda!' },
      { id: 'e-7', speaker: 'bolillo', emotion: 'happy', text: 'Y desde abajo ya se siente más fresco. ¡Buena sombra!' },
      { id: 'e-8', speaker: 'nube-gris', emotion: 'angry', text: 'Mis techos calientes… ¡me los están robando uno por uno!' },
      { id: 'e-9', speaker: 'lila', emotion: 'excited', text: 'El barrio sigue cambiando, {nombre}. ¡Y todavía falta lo mejor!' },
    ],
  },

  // ===== Gancho al Capítulo 6 =====
  'chapter-6-hook': {
    id: 'chapter-6-hook',
    context: 'Gancho al capítulo 6 — El Gran Festival Verde',
    lines: [
      { id: 'h-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, ¿te imaginas todo lo que hemos logrado junto?' },
      { id: 'h-2', speaker: 'nico', emotion: 'excited', text: '¡Calles, parques, agua, basura, azoteas… el barrio ya es otro!' },
      { id: 'h-3', speaker: 'vale', emotion: 'thinking', text: 'Pero necesitamos que todos los vecinos se sumen. Solos no alcanza.' },
      { id: 'h-4', speaker: 'lila', emotion: 'proud', text: 'Es hora de un gran festival para celebrar y comprometer a todo el barrio.', optional: true },
    ],
  },
}
