import type { DialoguePool } from '~/shared/types/character'

export const chapter1Dialogues: Record<string, DialoguePool> = {
  'cinematic-intro': {
    id: 'cinematic-intro',
    context: 'Cinemática de apertura del juego',
    lines: [
      { id: 'ci-1', speaker: 'lila', emotion: 'sad', text: 'Este barrio antes tenía sombra, flores y parques llenos de vida.' },
      { id: 'ci-2', speaker: 'timo', emotion: 'worried', text: 'Pero entre fugas, basura y descuido… todo empezó a cambiar.' },
      { id: 'ci-3', speaker: 'xani', emotion: 'thinking', text: 'Aun así, todavía hay algo aquí… una oportunidad.' },
      { id: 'ci-4', speaker: 'nube-gris', emotion: 'mischievous', text: 'Ahhh… calor pegajoso, aire pesado y calles vacías. Mi combinación favorita.' },
      { id: 'ci-5', speaker: 'lila', emotion: 'excited', text: 'Eso se va a acabar.' },
    ],
  },

  'welcome': {
    id: 'welcome',
    context: 'Bienvenida al jugador',
    lines: [
      { id: 'w-1', speaker: 'lila', emotion: 'happy', text: '¡Llegaste justo a tiempo! Este barrio necesita ayuda.' },
      { id: 'w-2', speaker: 'lila', emotion: 'excited', text: 'Nos llamamos Guardianes del Barrio Verde. Y desde hoy, tú también formas parte.' },
      { id: 'w-3', speaker: 'timo', emotion: 'happy', text: 'Necesitamos ojos atentos, manos rápidas y ganas de cambiar las cosas.' },
      { id: 'w-4', speaker: 'xani', emotion: 'neutral', text: 'El barrio no se va a salvar solo.' },
      {
        id: 'w-5',
        speaker: 'lila',
        emotion: 'excited',
        text: '¿Te unes a los Guardianes del Barrio Verde?',
        choices: [
          { id: 'join-1', text: '¡Sí, vamos!' },
          { id: 'join-2', text: '¡Claro que sí!' },
          { id: 'join-3', text: '¡Quiero ayudar!' },
        ],
      },
      { id: 'w-6', speaker: 'lila', emotion: 'happy', text: '¡Sabía que dirías que sí!' },
    ],
  },

  'observation': {
    id: 'observation',
    context: 'Observación inicial de la calle',
    lines: [
      { id: 'obs-1', speaker: 'lila', emotion: 'thinking', text: 'Mira bien esta calle. ¿Qué notas?' },
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
      { id: 'ob-1', speaker: 'timo', emotion: 'worried', text: 'Ni sentarse aquí se antoja. ¡Está hirviendo!' },
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
      { id: 'oc-1', speaker: 'lila', emotion: 'excited', text: '¡Exacto! Aquí no hay un solo problema. Hay varios conectados.' },
    ],
  },

  'tutorial': {
    id: 'tutorial',
    context: 'Tutorial base',
    lines: [
      { id: 't-1', speaker: 'timo', emotion: 'happy', text: 'Cada misión que completes mejorará esta calle.' },
      { id: 't-2', speaker: 'xani', emotion: 'neutral', text: 'A veces limpiarás. A veces repararás. A veces plantarás.' },
      { id: 't-3', speaker: 'lila', emotion: 'excited', text: 'Todo lo que hagas contará.' },
      { id: 't-4', speaker: 'timo', emotion: 'excited', text: 'Te doy tu EcoKit básico. No hace sándwiches, pero sí resuelve problemas.' },
    ],
  },

  // Mission 1: Limpiar la banqueta
  'mission-1-intro': {
    id: 'mission-1-intro',
    context: 'Intro misión 1: Limpiar la banqueta',
    lines: [
      { id: 'm1i-1', speaker: 'lila', emotion: 'excited', text: 'Primero vamos a despejar esta banqueta.' },
      { id: 'm1i-2', speaker: 'don-tono', emotion: 'sad', text: 'Hace tiempo que nadie le entra a esta parte.' },
      { id: 'm1i-3', speaker: 'timo', emotion: 'excited', text: '¡Pues hoy sí!' },
      { id: 'm1i-4', speaker: 'nube-gris', emotion: 'mischievous', text: '¿De verdad van a recoger todo eso? ¡Qué obsesión con el orden!' },
    ],
  },
  'mission-1-success': {
    id: 'mission-1-success',
    context: 'Éxito misión 1',
    lines: [
      { id: 'm1s-1', speaker: 'don-tono', emotion: 'surprised', text: 'Mira nada más… ¡ya hasta se ve la banqueta!' },
      { id: 'm1s-2', speaker: 'lila', emotion: 'happy', text: 'Un espacio limpio ya invita a quedarse.' },
      { id: 'm1s-3', speaker: 'xani', emotion: 'happy', text: 'Y también se cuida más fácil.' },
    ],
  },
  'mission-1-failure': {
    id: 'mission-1-failure',
    context: 'Fallo misión 1',
    lines: [
      { id: 'm1f-1', speaker: 'lila', emotion: 'neutral', text: 'No pasa nada. Lo intentamos de nuevo.' },
      { id: 'm1f-2', speaker: 'timo', emotion: 'thinking', text: 'Recuerda: cada tipo de basura va en su contenedor.' },
    ],
  },

  // Mission 2: Detectar puntos de calor
  'mission-2-intro': {
    id: 'mission-2-intro',
    context: 'Intro misión 2: Detectar calor',
    lines: [
      { id: 'm2i-1', speaker: 'nico', emotion: 'sad', text: 'Yo antes jugaba aquí, pero ahora está insoportable.' },
      { id: 'm2i-2', speaker: 'lila', emotion: 'thinking', text: 'Vamos a descubrir por qué.' },
      { id: 'm2i-3', speaker: 'xani', emotion: 'neutral', text: 'El calor no se siente igual en todos los lugares.' },
    ],
  },
  'mission-2-success': {
    id: 'mission-2-success',
    context: 'Éxito misión 2',
    lines: [
      { id: 'm2s-1', speaker: 'nico', emotion: 'surprised', text: '¡Con razón nadie quiere estar aquí!' },
      { id: 'm2s-2', speaker: 'xani', emotion: 'happy', text: 'La sombra y las plantas ayudan a enfriar los espacios.' },
      { id: 'm2s-3', speaker: 'lila', emotion: 'excited', text: '¡Entonces ya sabemos qué hacer después!' },
    ],
  },
  'mission-2-failure': {
    id: 'mission-2-failure',
    context: 'Fallo misión 2',
    lines: [
      { id: 'm2f-1', speaker: 'xani', emotion: 'neutral', text: 'Observar otra vez puede ayudarnos.' },
      { id: 'm2f-2', speaker: 'lila', emotion: 'happy', text: 'Busca las zonas que se sienten más calientes.' },
    ],
  },

  // Mission 3: Plantar sombra
  'mission-3-intro': {
    id: 'mission-3-intro',
    context: 'Intro misión 3: Plantar sombra',
    lines: [
      { id: 'm3i-1', speaker: 'xani', emotion: 'excited', text: 'Si queremos una calle más fresca, necesitamos sombra.' },
      { id: 'm3i-2', speaker: 'timo', emotion: 'happy', text: 'Y no, dibujarla en el piso no cuenta.' },
      { id: 'm3i-3', speaker: 'lila', emotion: 'excited', text: '¡Vamos a plantar donde más hace falta!' },
    ],
  },
  'mission-3-success': {
    id: 'mission-3-success',
    context: 'Éxito misión 3',
    lines: [
      { id: 'm3s-1', speaker: 'nico', emotion: 'happy', text: '¡Ahora sí se ve mejor!' },
      { id: 'm3s-2', speaker: 'don-tono', emotion: 'surprised', text: 'Hace años que no veía plantas nuevas por aquí.' },
      { id: 'm3s-3', speaker: 'xani', emotion: 'happy', text: 'Tomará tiempo crecer, pero ya empezaron a cambiar la calle.' },
      { id: 'm3s-4', speaker: 'nube-gris', emotion: 'angry', text: 'Pff… unas plantitas no me preocupan.' },
      { id: 'm3s-5', speaker: 'timo', emotion: 'happy', text: 'Creo que una mariposa opina lo contrario. 🦋' },
    ],
  },
  'mission-3-failure': {
    id: 'mission-3-failure',
    context: 'Fallo misión 3',
    lines: [
      { id: 'm3f-1', speaker: 'xani', emotion: 'neutral', text: 'Busca un punto donde realmente ayude.' },
      { id: 'm3f-2', speaker: 'lila', emotion: 'happy', text: '¡Vamos otra vez!' },
    ],
  },

  // Mission 4: Reparar fuga
  'mission-4-intro': {
    id: 'mission-4-intro',
    context: 'Intro misión 4: Reparar fuga',
    lines: [
      { id: 'm4i-1', speaker: 'timo', emotion: 'surprised', text: 'Esperen… ¿oyen eso?' },
      { id: 'm4i-2', speaker: 'lila', emotion: 'worried', text: '¡Hay una fuga!' },
      { id: 'm4i-3', speaker: 'don-tono', emotion: 'sad', text: 'Lleva días así.' },
      { id: 'm4i-4', speaker: 'timo', emotion: 'excited', text: '¡Pues hoy se termina!' },
    ],
  },
  'mission-4-success': {
    id: 'mission-4-success',
    context: 'Éxito misión 4',
    lines: [
      { id: 'm4s-1', speaker: 'timo', emotion: 'happy', text: '¡Listo! Agua salvada. 💧' },
      { id: 'm4s-2', speaker: 'xani', emotion: 'happy', text: 'Cuidar el agua también ayuda a cuidar el barrio.' },
      { id: 'm4s-3', speaker: 'lila', emotion: 'excited', text: 'Nada está aislado. Todo se conecta.' },
    ],
  },
  'mission-4-failure': {
    id: 'mission-4-failure',
    context: 'Fallo misión 4',
    lines: [
      { id: 'm4f-1', speaker: 'timo', emotion: 'thinking', text: 'Mmm… esa pieza no va ahí. ¡Inténtalo otra vez!' },
    ],
  },

  // Mission 5: Recuperar espacio
  'mission-5-intro': {
    id: 'mission-5-intro',
    context: 'Intro misión 5: Recuperar espacio',
    lines: [
      { id: 'm5i-1', speaker: 'lila', emotion: 'happy', text: 'Ya limpiamos, detectamos el calor, plantamos y arreglamos la fuga.' },
      { id: 'm5i-2', speaker: 'timo', emotion: 'excited', text: 'Ahora falta que esta calle vuelva a sentirse querida.' },
      { id: 'm5i-3', speaker: 'xani', emotion: 'neutral', text: 'Los espacios cuidados invitan a quedarse.' },
      { id: 'm5i-4', speaker: 'don-tono', emotion: 'happy', text: 'Yo traje unas macetas. No me vean así, sí ayudan.' },
    ],
  },
  'mission-5-success': {
    id: 'mission-5-success',
    context: 'Éxito misión 5',
    lines: [
      { id: 'm5s-1', speaker: 'nico', emotion: 'excited', text: '¡Ahora sí me quedo a jugar!' },
      { id: 'm5s-2', speaker: 'vale', emotion: 'happy', text: 'Así hasta dan ganas de caminar más por aquí.' },
      { id: 'm5s-3', speaker: 'don-tono', emotion: 'happy', text: 'Pues sí cambió bastante…' },
      { id: 'm5s-4', speaker: 'nube-gris', emotion: 'angry', text: 'Esto ya no se siente nada cómodo para mí.' },
    ],
  },
  'mission-5-failure': {
    id: 'mission-5-failure',
    context: 'Fallo misión 5',
    lines: [
      { id: 'm5f-1', speaker: 'lila', emotion: 'happy', text: 'Todavía podemos arreglarlo. ¡Vamos otra vez!' },
    ],
  },

  // Escena final / Transformación
  'chapter-1-ending': {
    id: 'chapter-1-ending',
    context: 'Cierre del capítulo 1',
    lines: [
      { id: 'e-1', speaker: 'lila', emotion: 'proud', text: '¡Lo logramos!' },
      { id: 'e-2', speaker: 'timo', emotion: 'happy', text: 'Y eso que empezamos con una banqueta hecha un desastre.' },
      { id: 'e-3', speaker: 'xani', emotion: 'happy', text: 'Todavía puede mejorar más… pero ya volvió a respirar.' },
      { id: 'e-4', speaker: 'don-tono', emotion: 'happy', text: 'Hace mucho que esta calle no se sentía así.' },
      { id: 'e-5', speaker: 'nico', emotion: 'excited', text: '¡Ahora sí se puede estar aquí!' },
      { id: 'e-6', speaker: 'nube-gris', emotion: 'angry', text: 'Está bien… ganaron esta parte. Pero el barrio todavía tiene otras zonas descuidadas.' },
      { id: 'e-7', speaker: 'lila', emotion: 'excited', text: 'Entonces iremos una por una.' },
    ],
  },

  // Gancho al capítulo 2
  'chapter-2-hook': {
    id: 'chapter-2-hook',
    context: 'Gancho al capítulo 2',
    lines: [
      { id: 'h-1', speaker: 'xani', emotion: 'sad', text: 'El parque nos necesita.' },
      { id: 'h-2', speaker: 'lila', emotion: 'excited', text: '¡Vamos para allá!' },
      { id: 'h-3', speaker: 'timo', emotion: 'happy', text: 'Traigo ideas. Y esta vez quizá también una regadera que no explote.' },
    ],
  },
}
