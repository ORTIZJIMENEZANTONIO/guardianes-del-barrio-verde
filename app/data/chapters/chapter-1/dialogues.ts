import type { DialoguePool } from '~/shared/types/character'

export const chapter1Dialogues: Record<string, DialoguePool> = {
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática breve — máximo 3 líneas',
    lines: [
      { id: 'ci-1', speaker: 'nube-gris', emotion: 'mischievous', text: 'Calor pegajoso, basura y calles vacías. Nadie va a cambiar esto.' },
      { id: 'ci-2', speaker: 'lila', emotion: 'excited', text: 'Eso crees tú.' },
    ],
  },

  'welcome': {
    id: 'welcome',
    context: 'Bienvenida + choices con opciones negativas + EcoKit',
    lines: [
      { id: 'w-1', speaker: 'lila', emotion: 'happy', text: '¡{nombre}! Somos los Guardianes del Barrio Verde. Esta calle necesita ayuda urgente.' },
      {
        id: 'w-2',
        speaker: 'lila',
        emotion: 'excited',
        text: '¿Te unes a la brigada?',
        choices: [
          { id: 'join-yes', text: '¡Sí, vamos!' },
          { id: 'join-maybe', text: 'Mmm, no sé...' },
          { id: 'join-no', text: '¿Y si mejor no?' },
        ],
      },
      { id: 'w-3', speaker: 'timo', emotion: 'happy', text: '¿Sabías que una sola calle con sombra puede bajar la temperatura 5 grados? Con tu ayuda podemos lograrlo.' },
      { id: 'w-4', speaker: 'lila', emotion: 'excited', text: '¡Entonces vamos, {nombre}! Toma tu EcoKit y a explorar la calle.' },
    ],
  },

  'observation': {
    id: 'observation',
    context: 'Observación inicial — solo hint breve',
    lines: [
      { id: 'obs-1', speaker: 'lila', emotion: 'thinking', text: 'Explora la calle, {nombre}. Toca lo que te parezca un problema.' },
    ],
  },

  'observation-ok-1': {
    id: 'observation-ok-1',
    context: 'Spot falso — poste de luz',
    lines: [
      { id: 'ok1-1', speaker: 'timo', emotion: 'neutral', text: 'Ese poste se ve bien. No todo es un problema.' },
    ],
  },

  'observation-ok-2': {
    id: 'observation-ok-2',
    context: 'Spot falso — puerta',
    lines: [
      { id: 'ok2-1', speaker: 'xani', emotion: 'neutral', text: 'Esa puerta está en buen estado. ¡Sigue buscando!' },
    ],
  },

  'observation-trash': {
    id: 'observation-trash',
    context: 'Al tocar basura',
    lines: [
      { id: 'ot-1', speaker: 'lila', emotion: 'sad', text: 'Sí. La basura hace que el lugar se vea y se sienta descuidado.' },
    ],
  },

  'observation-notrees': {
    id: 'observation-notrees',
    context: 'Al notar falta de árboles',
    lines: [
      { id: 'on-1', speaker: 'xani', emotion: 'sad', text: 'Sin sombra, el calor se queda más tiempo.' },
    ],
  },

  'observation-bench': {
    id: 'observation-bench',
    context: 'Al tocar la banca',
    lines: [
      { id: 'ob-1', speaker: 'timo', emotion: 'worried', text: '¡Ni sentarse aquí se antoja! ¡Está hirviendo!' },
    ],
  },

  'observation-leak': {
    id: 'observation-leak',
    context: 'Al tocar fuga',
    lines: [
      { id: 'ol-1', speaker: 'timo', emotion: 'thinking', text: 'Eso también cuenta. Una pequeña fuga puede empeorar el problema.' },
    ],
  },

  'observation-pavement': {
    id: 'observation-pavement',
    context: 'Al tocar pavimento',
    lines: [
      { id: 'op-1', speaker: 'xani', emotion: 'thinking', text: 'El concreto sin sombra guarda mucho calor.' },
    ],
  },

  'observation-complete': {
    id: 'observation-complete',
    context: 'Al detectar suficientes elementos',
    lines: [
      { id: 'oc-1', speaker: 'lila', emotion: 'excited', text: '¡Muy bien, {nombre}! Aquí no hay un solo problema. Hay varios conectados.' },
    ],
  },

  'tutorial': {
    id: 'tutorial',
    context: 'Tutorial base',
    lines: [
      { id: 't-1', speaker: 'timo', emotion: 'happy', text: '{nombre}, cada misión que completes mejorará esta calle.' },
      { id: 't-2', speaker: 'xani', emotion: 'neutral', text: 'A veces limpiarás. A veces repararás. A veces plantarás.', optional: true },
      { id: 't-3', speaker: 'lila', emotion: 'excited', text: '¡Todo lo que hagas contará!' },
      { id: 't-4', speaker: 'timo', emotion: 'excited', text: 'Te doy tu EcoKit básico, {nombre}. No hace sándwiches, pero sí resuelve problemas.' },
    ],
  },

  // Mission 1
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro misión 1',
    lines: [
      { id: 'm1i-1', speaker: 'lila', emotion: 'excited', text: '{nombre}, vamos a despejar esta banqueta. ¡Arrastra cada residuo al bote correcto!' },
      { id: 'm1i-2', speaker: 'nube-gris', emotion: 'mischievous', text: '¿De verdad van a recoger todo eso?', optional: true },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito misión 1',
    lines: [
      { id: 'm1s-1', speaker: 'don-tono', emotion: 'surprised', text: '¡Ya hasta se ve la banqueta, {nombre}!' },
      { id: 'm1s-2', speaker: 'lila', emotion: 'happy', text: 'Un espacio limpio invita a quedarse.' },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo misión 1',
    lines: [
      { id: 'm1f-1', speaker: 'lila', emotion: 'neutral', text: 'No pasa nada, {nombre}. ¡Lo intentamos de nuevo!' },
    ],
  },

  // Mission 2
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro misión 2',
    lines: [
      { id: 'm2i-1', speaker: 'nico', emotion: 'sad', text: 'Yo antes jugaba aquí, pero ahora está insoportable.' },
      { id: 'm2i-2', speaker: 'lila', emotion: 'thinking', text: '{nombre}, vamos a descubrir por qué.' },
      { id: 'm2i-3', speaker: 'xani', emotion: 'neutral', text: 'El calor no se siente igual en todos los lugares.', optional: true },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito misión 2',
    lines: [
      { id: 'm2s-1', speaker: 'xani', emotion: 'happy', text: 'La sombra y las plantas enfrían los espacios. ¡Ya sabemos dónde actuar!' },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo misión 2',
    lines: [
      { id: 'm2f-1', speaker: 'xani', emotion: 'neutral', text: '{nombre}, observar otra vez puede ayudarnos.' },
    ],
  },

  // Mission 3
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro misión 3',
    lines: [
      { id: 'm3i-1', speaker: 'xani', emotion: 'excited', text: '{nombre}, si queremos una calle más fresca, necesitamos sombra.' },
      { id: 'm3i-2', speaker: 'timo', emotion: 'happy', text: 'Y no, dibujarla en el piso no cuenta.', optional: true },
      { id: 'm3i-3', speaker: 'lila', emotion: 'excited', text: '¡Vamos a plantar donde más hace falta!' },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito misión 3',
    lines: [
      { id: 'm3s-1', speaker: 'xani', emotion: 'happy', text: 'Tomará tiempo crecer, pero ya cambió la calle, {nombre}. 🦋' },
      { id: 'm3s-2', speaker: 'nube-gris', emotion: 'angry', text: 'Pff… unas plantitas no me preocupan.', optional: true },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo misión 3',
    lines: [
      { id: 'm3f-1', speaker: 'xani', emotion: 'neutral', text: 'Busca un buen lugar, {nombre}.' },
    ],
  },

  // Mission 4 — evento sorpresa (la fuga aparece inesperadamente)
  'mission-4-intro': {
    id: 'mission-4-intro',
    context: 'Intro misión 4 — sorpresa narrativa',
    lines: [
      { id: 'm4i-1', speaker: 'timo', emotion: 'surprised', text: '¡¡{nombre}, ESPERA!! ¿Oyes eso? 💧💧💧 ¡Una fuga!' },
      { id: 'm4i-2', speaker: 'timo', emotion: 'excited', text: '¡Hay que repararla ya! Coloca las piezas en los huecos.' },
      { id: 'm4i-3', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Creyeron que iba a ser fácil?', optional: true },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Éxito misión 4',
    lines: [
      { id: 'm4s-1', speaker: 'timo', emotion: 'happy', text: '¡Agua salvada, {nombre}! 💧' },
      { id: 'm4s-2', speaker: 'lila', emotion: 'excited', text: 'Cuidar el agua es cuidar el barrio.', optional: true },
    ],
  },
  'mission-4-failure': {
    id: 'mission-4-failure',
    context: 'Fallo misión 4',
    lines: [
      { id: 'm4f-1', speaker: 'timo', emotion: 'thinking', text: 'Mmm… esa pieza no va ahí, {nombre}. ¡Inténtalo otra vez!' },
    ],
  },

  // Mission 5 — Recuperar el espacio (urbanismo táctico)
  'mission-5-intro': {
    id: 'mission-5-intro',
    context: 'Intro misión 5',
    lines: [
      { id: 'm5i-1', speaker: 'lila', emotion: 'happy', text: '{nombre}, cada punto tiene un problema. Elige la solución correcta para cada uno.' },
      { id: 'm5i-2', speaker: 'timo', emotion: 'excited', text: '¡Ojo con las que no sirven!' },
      { id: 'm5i-3', speaker: 'nube-gris', emotion: 'mischievous', text: 'Eso no cambia nada.', optional: true },
    ],
  },
  'mission-5-success': {
    id: 'mission-5-success',
    context: 'Éxito misión 5',
    lines: [
      { id: 'm5s-1', speaker: 'vale', emotion: 'happy', text: '¡Hasta dan ganas de caminar por aquí, {nombre}!' },
      { id: 'm5s-2', speaker: 'nube-gris', emotion: 'angry', text: 'Esto ya no se siente cómodo para mí.', optional: true },
    ],
  },
  'mission-5-failure': {
    id: 'mission-5-failure',
    context: 'Fallo misión 5',
    lines: [
      { id: 'm5f-1', speaker: 'timo', emotion: 'thinking', text: 'Piensa en el problema de cada lugar, {nombre}. ¡La solución correcta existe!' },
    ],
  },

  // Mission 6 — Techo verde (referencia CIIEMAD/IPN)
  'mission-6-intro': {
    id: 'mission-6-intro',
    context: 'Intro misión 6 — techo verde',
    lines: [
      { id: 'm6i-1', speaker: 'timo', emotion: 'thinking', text: '{nombre}, ya mejoramos la calle… pero mira los techos. ¡Siguen hirviendo!' },
      { id: 'm6i-2', speaker: 'xani', emotion: 'excited', text: 'Voy a enseñarte algo. En el Instituto Politécnico Nacional hay un centro llamado CIIEMAD donde estudian techos verdes.' },
      { id: 'm6i-3', speaker: 'xani', emotion: 'thinking', text: 'Mira la diferencia: un techo gris de concreto llega a 70°C al sol. ¡Podrías freír un huevo ahí!' },
      { id: 'm6i-4', speaker: 'xani', emotion: 'happy', text: 'Pero un techo verde con plantas solo llega a 35°C. ¡La mitad! Y además absorbe el 40% del agua de lluvia.' },
      { id: 'm6i-5', speaker: 'don-tono', emotion: 'surprised', text: '¿Plantas en el techo? ¿Y no se cae todo?', optional: true },
      { id: 'm6i-6', speaker: 'timo', emotion: 'excited', text: '¡No! Es como un sándwich de capas. Cada una tiene su función. Te enseño, {nombre}.' },
      { id: 'm6i-7', speaker: 'lila', emotion: 'excited', text: '¡Vamos a armar un techo verde! Pon cada capa en su lugar.' },
      { id: 'm6i-8', speaker: 'nube-gris', emotion: 'mischievous', text: '¿Plantas en un techo? Eso no va a funcionar.', optional: true },
    ],
  },
  'mission-6-success': {
    id: 'mission-6-success',
    context: 'Éxito misión 6 — techo verde',
    lines: [
      { id: 'm6s-1', speaker: 'timo', emotion: 'proud', text: '¡{nombre}, lo armaste perfecto! Cada capa en su lugar.' },
      { id: 'm6s-2', speaker: 'xani', emotion: 'happy', text: 'Las plantas del techo van a dar sombra, limpiar el aire y darle casa a mariposas y abejas.' },
      { id: 'm6s-3', speaker: 'don-tono', emotion: 'surprised', text: 'Si me hubieran dicho que un techo podía tener jardín… no lo creo.', optional: true },
      { id: 'm6s-4', speaker: 'nico', emotion: 'excited', text: '¡Hasta se siente más fresco aquí abajo!' },
      { id: 'm6s-5', speaker: 'lila', emotion: 'proud', text: 'En el CIIEMAD del Instituto Politécnico Nacional ya lo hacen. Imagina si todo el barrio tuviera techos verdes, {nombre}.' },
      { id: 'm6s-6', speaker: 'nube-gris', emotion: 'angry', text: '¿Plantas arriba Y abajo? Esto ya no me gusta nada.' },
    ],
  },
  'mission-6-failure': {
    id: 'mission-6-failure',
    context: 'Fallo misión 6',
    lines: [
      { id: 'm6f-1', speaker: 'timo', emotion: 'thinking', text: 'El orden de las capas importa, {nombre}. ¡Inténtalo otra vez!' },
    ],
  },

  // Ending
  'chapter-1-ending': {
    id: 'chapter-1-ending',
    context: 'Cierre del capítulo 1',
    lines: [
      { id: 'e-1', speaker: 'lila', emotion: 'proud', text: '¡Lo logramos, {nombre}! La calle volvió a respirar.' },
      { id: 'e-2', speaker: 'nube-gris', emotion: 'angry', text: 'Ganaron esta parte… pero el barrio tiene más zonas descuidadas.' },
      { id: 'e-3', speaker: 'lila', emotion: 'excited', text: '¡Entonces iremos una por una!' },
    ],
  },

  // Hook
  'chapter-2-hook': {
    id: 'chapter-2-hook',
    context: 'Gancho al capítulo 2',
    lines: [
      { id: 'h-1', speaker: 'xani', emotion: 'sad', text: 'El parque nos necesita, {nombre}.' },
      { id: 'h-2', speaker: 'lila', emotion: 'excited', text: '¡Vamos para allá!' },
      { id: 'h-3', speaker: 'timo', emotion: 'happy', text: 'Traigo ideas. Y esta vez quizá también una regadera que no explote.', optional: true },
    ],
  },
}
