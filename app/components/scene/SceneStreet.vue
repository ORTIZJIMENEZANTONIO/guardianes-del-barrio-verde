<template>
  <div class="street" :class="`street--${variant}`">
    <!-- Buildings SVG -->
    <svg class="buildings-svg" viewBox="0 0 400 200" :preserveAspectRatio="isMobile ? 'xMidYMax slice' : 'none'" xmlns="http://www.w3.org/2000/svg">
      <!-- Texture patterns -->
      <defs>
        <!-- Brick pattern (for walls) -->
        <pattern id="brick" width="12" height="6" patternUnits="userSpaceOnUse">
          <rect width="12" height="6" fill="transparent" />
          <line x1="0" y1="3" x2="12" y2="3" stroke="rgba(0,0,0,0.06)" stroke-width="0.4" />
          <line x1="6" y1="0" x2="6" y2="3" stroke="rgba(0,0,0,0.06)" stroke-width="0.4" />
          <line x1="0" y1="0" x2="0" y2="3" stroke="rgba(0,0,0,0.04)" stroke-width="0.3" />
          <line x1="3" y1="3" x2="3" y2="6" stroke="rgba(0,0,0,0.06)" stroke-width="0.4" />
          <line x1="9" y1="3" x2="9" y2="6" stroke="rgba(0,0,0,0.06)" stroke-width="0.4" />
        </pattern>
        <!-- Concrete / stucco (for modern buildings) -->
        <pattern id="stucco" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="transparent" />
          <circle cx="2" cy="3" r="0.4" fill="rgba(0,0,0,0.03)" />
          <circle cx="6" cy="1" r="0.3" fill="rgba(0,0,0,0.04)" />
          <circle cx="4" cy="6" r="0.5" fill="rgba(0,0,0,0.03)" />
          <circle cx="7" cy="5" r="0.3" fill="rgba(0,0,0,0.02)" />
          <circle cx="1" cy="7" r="0.4" fill="rgba(0,0,0,0.03)" />
        </pattern>
        <!-- Tile / teja pattern (for roofs) -->
        <pattern id="teja" width="10" height="5" patternUnits="userSpaceOnUse">
          <rect width="10" height="5" fill="transparent" />
          <path d="M0 5 Q5 2 10 5" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5" />
          <path d="M5 0 Q10 -3 15 0" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="0.4" />
        </pattern>
        <!-- Sidewalk tiles -->
        <pattern id="baldosa" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="transparent" />
          <rect x="0" y="0" width="10" height="10" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="0.3" />
          <line x1="5" y1="0" x2="5" y2="10" stroke="rgba(0,0,0,0.03)" stroke-width="0.2" />
        </pattern>
      </defs>

      <!-- Far buildings: siluetas de monumentos mexicanos por región -->
      <g class="far-buildings" opacity="0.35">

        <!-- === CENTRO (CDMX): default, cap 1, cap 6 === -->
        <template v-if="landmarks === 'default' || landmarks === 'centro'">
          <!-- Monumento a la Revolución — arco con cúpula y pilares -->
          <rect x="8" y="70" width="14" height="130" rx="2" fill="#6b7280" />
          <rect x="46" y="70" width="14" height="130" rx="2" fill="#6b7280" />
          <path d="M8 70 Q34 30 60 70" fill="none" stroke="#6b7280" stroke-width="4" />
          <ellipse cx="34" cy="40" rx="14" ry="10" fill="#9ca3af" />
          <rect x="30" y="30" width="8" height="12" rx="1" fill="#6b7280" />
          <!-- Palacio de Bellas Artes — cuerpo ornamental + cúpula dorada -->
          <rect x="80" y="80" width="55" height="120" rx="3" fill="#9ca3af" />
          <rect x="85" y="82" width="10" height="14" rx="1" fill="#f8fafc" opacity="0.15" />
          <rect x="100" y="82" width="10" height="14" rx="1" fill="#f8fafc" opacity="0.15" />
          <rect x="115" y="82" width="10" height="14" rx="1" fill="#f8fafc" opacity="0.15" />
          <rect x="82" y="78" width="51" height="4" rx="1" fill="#78716c" />
          <ellipse cx="107" cy="78" rx="18" ry="14" fill="#6b7280" />
          <ellipse cx="107" cy="68" rx="10" ry="8" fill="#fbbf24" opacity="0.2" />
          <rect x="104" y="60" width="6" height="10" rx="1" fill="#9ca3af" />
          <!-- Torre Latinoamericana — escalonada con antena -->
          <rect x="158" y="55" width="18" height="145" rx="1" fill="#6b7280" />
          <rect x="161" y="40" width="12" height="18" rx="1" fill="#9ca3af" />
          <rect x="164" y="30" width="6" height="12" rx="1" fill="#6b7280" />
          <rect x="166" y="18" width="2" height="14" fill="#9ca3af" />
          <rect x="160" y="100" width="14" height="2" fill="#9ca3af" opacity="0.3" />
          <rect x="160" y="120" width="14" height="2" fill="#9ca3af" opacity="0.3" />
          <rect x="160" y="140" width="14" height="2" fill="#9ca3af" opacity="0.3" />
          <!-- Ángel de la Independencia — pedestal escalonado + columna + victoria dorada -->
          <rect x="368" y="170" width="22" height="30" rx="2" fill="#6b7280" />
          <rect x="372" y="155" width="14" height="18" rx="1" fill="#9ca3af" />
          <rect x="375" y="50" width="8" height="108" rx="1" fill="#78716c" />
          <rect x="373" y="48" width="12" height="5" rx="1" fill="#9ca3af" />
          <!-- Victoria alada (ángel) -->
          <circle cx="379" cy="34" r="3" fill="#fbbf24" opacity="0.35" />
          <!-- Cuerpo -->
          <rect x="377" y="37" width="4" height="10" rx="1" fill="#fbbf24" opacity="0.3" />
          <!-- Ala izquierda -->
          <path d="M377 38 Q370 30 368 36 Q370 40 377 42" fill="#fbbf24" opacity="0.25" />
          <!-- Ala derecha -->
          <path d="M381 38 Q388 30 390 36 Q388 40 381 42" fill="#fbbf24" opacity="0.25" />
          <!-- Laurel en mano derecha -->
          <line x1="382" y1="40" x2="386" y2="34" stroke="#fbbf24" stroke-width="0.8" opacity="0.3" />
          <circle cx="386" cy="33" r="2" fill="#22c55e" opacity="0.2" />
        </template>

        <!-- === SUR (Oaxaca, Chiapas, Yucatán): cap 2 === -->
        <template v-else-if="landmarks === 'sur'">
          <!-- Pirámide de Kukulcán — 9 niveles escalonados + templo -->
          <rect x="18" y="180" width="54" height="20" rx="1" fill="#9ca3af" />
          <rect x="22" y="165" width="46" height="17" rx="1" fill="#8a8a8a" />
          <rect x="26" y="150" width="38" height="17" rx="1" fill="#9ca3af" />
          <rect x="29" y="137" width="32" height="15" rx="1" fill="#8a8a8a" />
          <rect x="32" y="124" width="26" height="15" rx="1" fill="#9ca3af" />
          <rect x="35" y="112" width="20" height="14" rx="1" fill="#8a8a8a" />
          <rect x="38" y="100" width="14" height="14" rx="1" fill="#9ca3af" />
          <rect x="40" y="90" width="10" height="12" rx="1" fill="#6b7280" />
          <rect x="42" y="84" width="6" height="8" rx="1" fill="#78716c" />
          <!-- Escalera central -->
          <line x1="45" y1="84" x2="45" y2="200" stroke="#6b7280" stroke-width="1.5" />
          <!-- Monte Albán — plataformas escalonadas anchas -->
          <rect x="100" y="140" width="80" height="60" rx="2" fill="#6b7280" />
          <rect x="105" y="128" width="70" height="14" rx="1" fill="#9ca3af" />
          <rect x="112" y="118" width="56" height="12" rx="1" fill="#8a8a8a" />
          <rect x="120" y="108" width="40" height="12" rx="1" fill="#6b7280" />
          <rect x="130" y="100" width="20" height="10" rx="1" fill="#9ca3af" />
          <!-- Santo Domingo (Oaxaca) — fachada barroca detallada -->
          <rect x="210" y="65" width="42" height="135" rx="2" fill="#d4a860" opacity="0.6" />
          <rect x="213" y="38" width="11" height="30" rx="1" fill="#b8963c" opacity="0.5" />
          <rect x="238" y="38" width="11" height="30" rx="1" fill="#b8963c" opacity="0.5" />
          <path d="M215 38 L218 28 L221 38" fill="#9ca3af" />
          <path d="M240 38 L243 28 L246 38" fill="#9ca3af" />
          <path d="M216 65 L231 52 L246 65" fill="#b8963c" opacity="0.4" />
          <rect x="221" y="68" width="5" height="6" rx="1" fill="#f8fafc" opacity="0.15" />
          <rect x="231" y="68" width="5" height="6" rx="1" fill="#f8fafc" opacity="0.15" />
          <!-- Palenque — templo maya con crestería -->
          <polygon points="308,200 332,115 356,200" fill="#6b7280" />
          <rect x="322" y="105" width="20" height="18" rx="1" fill="#9ca3af" />
          <rect x="326" y="88" width="12" height="20" rx="1" fill="#6b7280" />
          <rect x="329" y="78" width="6" height="12" rx="1" fill="#9ca3af" />
          <rect x="324" y="107" width="4" height="10" fill="#f8fafc" opacity="0.1" />
          <rect x="336" y="107" width="4" height="10" fill="#f8fafc" opacity="0.1" />
        </template>

        <!-- === OCCIDENTE (Jalisco, Michoacán, Colima): cap 3 === -->
        <template v-else-if="landmarks === 'occidente'">
          <!-- Hospicio Cabañas — edificio neoclásico con cúpula y columnata -->
          <rect x="8" y="78" width="68" height="122" rx="2" fill="#6b7280" />
          <rect x="12" y="80" width="4" height="40" rx="1" fill="#9ca3af" />
          <rect x="22" y="80" width="4" height="40" rx="1" fill="#9ca3af" />
          <rect x="32" y="80" width="4" height="40" rx="1" fill="#9ca3af" />
          <rect x="42" y="80" width="4" height="40" rx="1" fill="#9ca3af" />
          <ellipse cx="42" cy="74" rx="14" ry="16" fill="#9ca3af" />
          <rect x="38" y="56" width="8" height="18" rx="1" fill="#6b7280" />
          <circle cx="42" cy="54" r="3" fill="#9ca3af" />
          <!-- Catedral de Guadalajara — torres neogóticas amarillas -->
          <rect x="100" y="72" width="52" height="128" rx="2" fill="#d4a860" opacity="0.5" />
          <rect x="102" y="30" width="12" height="44" rx="1" fill="#b8963c" opacity="0.5" />
          <rect x="138" y="30" width="12" height="44" rx="1" fill="#b8963c" opacity="0.5" />
          <path d="M105 30 L108 15 L111 30" fill="#9ca3af" />
          <path d="M141 30 L144 15 L147 30" fill="#9ca3af" />
          <circle cx="108" cy="18" r="2" fill="#fbbf24" opacity="0.2" />
          <circle cx="144" cy="18" r="2" fill="#fbbf24" opacity="0.2" />
          <path d="M112 72 L126 55 L140 72" fill="#b8963c" opacity="0.4" />
          <rect x="118" y="100" width="16" height="22" rx="2" fill="#6b7280" opacity="0.4" />
          <!-- Catedral de Morelia — cantera rosa, torres altas -->
          <rect x="188" y="68" width="48" height="132" rx="2" fill="#c9706b" opacity="0.4" />
          <rect x="190" y="32" width="12" height="38" rx="1" fill="#b06060" opacity="0.4" />
          <rect x="222" y="32" width="12" height="38" rx="1" fill="#b06060" opacity="0.4" />
          <path d="M193 32 L196 18 L199 32" fill="#9ca3af" />
          <path d="M225 32 L228 18 L231 32" fill="#9ca3af" />
          <path d="M198 68 L212 52 L226 68" fill="#b06060" opacity="0.3" />
          <!-- Volcán de Colima — cono con nieve y humo -->
          <polygon points="290,200 335,50 380,200" fill="#6b7280" />
          <polygon points="315,100 335,50 355,100" fill="#e5e7eb" opacity="0.25" />
          <ellipse cx="335" cy="48" rx="12" ry="6" fill="#d1d5db" opacity="0.3" />
          <ellipse cx="338" cy="38" rx="8" ry="4" fill="#e5e7eb" opacity="0.2" />
        </template>

        <!-- === NORTE (Nuevo León, Chihuahua): cap 4 === -->
        <template v-else-if="landmarks === 'norte'">
          <!-- Cerro de la Silla — silueta montañosa icónica -->
          <polygon points="0,200 20,140 35,155 55,95 75,120 90,80 110,105 130,200" fill="#6b7280" />
          <polygon points="5,200 25,150 40,162 58,105 78,128 92,90 112,112 128,200" fill="#78716c" />
          <!-- Faro del Comercio (Monterrey) — torre con rayo láser verde -->
          <rect x="148" y="35" width="10" height="165" rx="1" fill="#ef4444" opacity="0.35" />
          <rect x="145" y="160" width="16" height="40" rx="2" fill="#6b7280" />
          <rect x="150" y="32" width="6" height="6" rx="1" fill="#9ca3af" />
          <line x1="153" y1="35" x2="153" y2="0" stroke="#22c55e" stroke-width="0.8" opacity="0.3" />
          <!-- Macroplaza con Palacio de Gobierno — edificio colonial largo -->
          <rect x="185" y="85" width="65" height="115" rx="2" fill="#9ca3af" />
          <rect x="188" y="82" width="59" height="5" rx="1" fill="#78716c" />
          <rect x="190" y="90" width="8" height="12" rx="1" fill="#f8fafc" opacity="0.12" />
          <rect x="202" y="90" width="8" height="12" rx="1" fill="#f8fafc" opacity="0.12" />
          <rect x="214" y="90" width="8" height="12" rx="1" fill="#f8fafc" opacity="0.12" />
          <rect x="226" y="90" width="8" height="12" rx="1" fill="#f8fafc" opacity="0.12" />
          <rect x="238" y="90" width="8" height="12" rx="1" fill="#f8fafc" opacity="0.12" />
          <rect x="210" y="140" width="16" height="28" rx="2" fill="#6b7280" />
          <!-- Catedral de Chihuahua — barroca ornamentada -->
          <rect x="280" y="68" width="44" height="132" rx="2" fill="#d4a860" opacity="0.5" />
          <rect x="282" y="35" width="12" height="35" rx="1" fill="#b8963c" opacity="0.5" />
          <rect x="310" y="35" width="12" height="35" rx="1" fill="#b8963c" opacity="0.5" />
          <path d="M285 35 L288 22 L291 35" fill="#9ca3af" />
          <path d="M313 35 L316 22 L319 35" fill="#9ca3af" />
          <path d="M290 68 L302 52 L314 68" fill="#b8963c" opacity="0.4" />
          <circle cx="302" cy="58" r="4" fill="#f8fafc" opacity="0.08" />
          <!-- Sierra Madre — montañas al fondo -->
          <polygon points="340,200 360,140 375,160 390,120 400,200" fill="#78716c" opacity="0.5" />
        </template>

        <!-- === ORIENTE (Veracruz, Puebla, Querétaro): cap 5 === -->
        <template v-else-if="landmarks === 'oriente'">
          <!-- Acueducto de Querétaro — 5 arcos con pilares -->
          <g>
            <rect x="5" y="78" width="8" height="122" rx="1" fill="#9ca3af" />
            <rect x="22" y="78" width="8" height="122" rx="1" fill="#9ca3af" />
            <rect x="39" y="78" width="8" height="122" rx="1" fill="#9ca3af" />
            <rect x="56" y="78" width="8" height="122" rx="1" fill="#9ca3af" />
            <rect x="73" y="78" width="8" height="122" rx="1" fill="#9ca3af" />
            <rect x="5" y="76" width="76" height="5" rx="1" fill="#78716c" />
            <ellipse cx="18" cy="130" rx="7" ry="14" fill="#f8fafc" opacity="0.2" />
            <ellipse cx="35" cy="130" rx="7" ry="14" fill="#f8fafc" opacity="0.2" />
            <ellipse cx="52" cy="130" rx="7" ry="14" fill="#f8fafc" opacity="0.2" />
            <ellipse cx="69" cy="130" rx="7" ry="14" fill="#f8fafc" opacity="0.2" />
          </g>
          <!-- Catedral de Puebla — torres con azulejo y cúpula -->
          <rect x="100" y="62" width="52" height="138" rx="2" fill="#6b7280" />
          <rect x="102" y="28" width="13" height="36" rx="1" fill="#9ca3af" />
          <rect x="137" y="28" width="13" height="36" rx="1" fill="#9ca3af" />
          <path d="M105 28 L108 14 L112 28" fill="#78716c" />
          <path d="M140 28 L143 14 L146 28" fill="#78716c" />
          <circle cx="109" cy="18" r="2" fill="#fbbf24" opacity="0.15" />
          <circle cx="143" cy="18" r="2" fill="#fbbf24" opacity="0.15" />
          <ellipse cx="126" cy="62" rx="12" ry="10" fill="#9ca3af" />
          <path d="M108 62 L126 48 L144 62" fill="#78716c" />
          <rect x="116" y="120" width="20" height="30" rx="2" fill="#78716c" opacity="0.4" />
          <!-- Pirámide de Cholula — base enorme + Iglesia de los Remedios arriba -->
          <rect x="178" y="105" width="72" height="95" rx="2" fill="#9ca3af" />
          <rect x="183" y="95" width="62" height="12" rx="1" fill="#8a8a8a" />
          <rect x="200" y="72" width="28" height="25" rx="1" fill="#6b7280" />
          <ellipse cx="214" cy="72" rx="8" ry="6" fill="#fbbf24" opacity="0.15" />
          <rect x="210" y="60" width="8" height="14" rx="1" fill="#9ca3af" />
          <path d="M207 60 L214 50 L221 60" fill="#6b7280" />
          <!-- Pico de Orizaba — volcán con nieve y nubes -->
          <polygon points="285,200 328,30 370,200" fill="#6b7280" />
          <polygon points="305,95 328,30 350,95" fill="#e5e7eb" opacity="0.3" />
          <polygon points="312,75 328,30 344,75" fill="#f8fafc" opacity="0.2" />
          <ellipse cx="340" cy="60" rx="12" ry="4" fill="#e5e7eb" opacity="0.15" />
        </template>

      </g>

      <!-- Near buildings with detail -->
      <!-- Building 1: Casa rosa con techo (hidden on mobile to reduce clutter) -->
      <g v-if="!isMobile">
        <rect x="5" y="100" width="65" height="100" :fill="variant === 'clean' ? '#fda4af' : '#e8a0a0'" />
        <rect x="5" y="100" width="65" height="100" fill="url(#brick)" />
        <polygon x="5" points="5,100 37,75 70,100" :fill="variant === 'clean' ? '#fb7185' : '#d07070'" />
        <polygon points="5,100 37,75 70,100" fill="url(#teja)" />
        <rect x="5" y="195" width="65" height="5" fill="#a8a29e" />
        <!-- Windows -->
        <rect x="14" y="112" width="11" height="13" rx="1" :fill="windowFill(1)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="32" y="112" width="11" height="13" rx="1" :fill="windowFill(2)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="50" y="112" width="11" height="13" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="14" y="140" width="11" height="13" rx="1" :fill="windowFill(3)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="50" y="140" width="11" height="13" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Door -->
        <rect x="30" y="162" width="16" height="28" rx="2" fill="#8B6914" />
        <circle cx="43" cy="178" r="1.2" fill="#D4A843" />
        <!-- Window shine -->
        <rect x="15" y="113" width="3" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
        <rect x="51" y="113" width="3" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
      </g>

      <!-- Building 2: Edificio amarillo -->
      <g>
        <rect x="75" y="85" width="55" height="115" :fill="variant === 'clean' ? '#fde047' : '#e8d07a'" />
        <rect x="75" y="85" width="55" height="115" fill="url(#stucco)" />
        <rect x="75" y="85" width="55" height="6" :fill="variant === 'clean' ? '#eab308' : '#c4a850'" />
        <rect x="75" y="195" width="55" height="5" fill="#a8a29e" />
        <!-- Windows (grid) -->
        <rect v-for="(w, i) in yellowWindows" :key="'yw'+i" :x="w.x" :y="w.y" width="10" height="11" rx="1" :fill="windowFill(i)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Shop front -->
        <rect x="82" y="165" width="40" height="25" rx="2" fill="#92400e" opacity="0.8" />
        <rect x="84" y="167" width="36" height="16" rx="1" :fill="variant === 'clean' ? '#fef08a' : '#d4c88a'" />
        <!-- Awning -->
        <path d="M80 163 L132 163" stroke="#dc2626" stroke-width="3" />
        <path d="M82 163 L82 167 M92 163 L92 167 M102 163 L102 167 M112 163 L112 167 M122 163 L122 167" stroke="#dc2626" stroke-width="1.5" />
      </g>

      <!-- Building 3: Edificio azul alto -->
      <g>
        <rect x="135" y="55" width="60" height="145" :fill="variant === 'clean' ? '#93c5fd' : '#8da8c4'" />
        <rect x="135" y="55" width="60" height="145" fill="url(#stucco)" />
        <rect x="135" y="55" width="60" height="5" :fill="variant === 'clean' ? '#3b82f6' : '#6080a0'" />
        <rect x="135" y="195" width="60" height="5" fill="#a8a29e" />
        <!-- Windows grid -->
        <rect v-for="(w, i) in blueWindows" :key="'bw'+i" :x="w.x" :y="w.y" width="9" height="10" rx="1" :fill="windowFill(i+5)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Entrance -->
        <rect x="155" y="170" width="20" height="25" rx="1" fill="#1e40af" opacity="0.6" />
        <rect x="157" y="172" width="7" height="20" rx="0.5" fill="#60a5fa" opacity="0.4" />
        <rect x="166" y="172" width="7" height="20" rx="0.5" fill="#60a5fa" opacity="0.4" />
      </g>

      <!-- Building 4: Casa verde baja -->
      <g>
        <rect x="200" y="120" width="55" height="80" :fill="variant === 'clean' ? '#86efac' : '#8ec0a0'" />
        <rect x="200" y="120" width="55" height="80" fill="url(#brick)" />
        <polygon points="200,120 227,95 255,120" :fill="variant === 'clean' ? '#22c55e' : '#5a9070'" />
        <polygon points="200,120 227,95 255,120" fill="url(#teja)" />
        <rect x="200" y="195" width="55" height="5" fill="#a8a29e" />
        <!-- Windows -->
        <rect x="210" y="132" width="12" height="14" rx="1.5" :fill="windowFill(4)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="233" y="132" width="12" height="14" rx="1.5" :fill="windowFill(7)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Door -->
        <rect x="219" y="162" width="15" height="28" rx="2" fill="#713f12" />
        <circle cx="231" cy="178" r="1.2" fill="#D4A843" />
        <!-- Planter box -->
        <rect v-if="variant === 'clean'" x="208" y="148" width="16" height="3" rx="1" fill="#92400e" />
        <rect v-if="variant === 'clean'" x="210" y="145" width="4" height="4" rx="1" fill="#22c55e" />
        <rect v-if="variant === 'clean'" x="216" y="144" width="4" height="5" rx="1" fill="#16a34a" />
      </g>

      <!-- Building 5: Edificio naranja -->
      <g>
        <rect x="260" y="90" width="50" height="110" :fill="variant === 'clean' ? '#fdba74' : '#d0a878'" />
        <rect x="260" y="90" width="50" height="110" fill="url(#brick)" />
        <rect x="260" y="90" width="50" height="5" :fill="variant === 'clean' ? '#f97316' : '#b08050'" />
        <rect x="260" y="195" width="50" height="5" fill="#a8a29e" />
        <!-- Windows -->
        <rect x="268" y="102" width="10" height="11" rx="1" :fill="windowFill(6)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="292" y="102" width="10" height="11" rx="1" :fill="windowFill(2)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="268" y="125" width="10" height="11" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="292" y="125" width="10" height="11" rx="1" :fill="windowFill(8)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="268" y="150" width="10" height="11" rx="1" :fill="windowFill(3)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="292" y="150" width="10" height="11" rx="1" :fill="windowFill(0)" :stroke="windowStroke" stroke-width="0.8" />
        <!-- Shop -->
        <rect x="270" y="170" width="30" height="22" rx="1" fill="#7c2d12" opacity="0.7" />
        <rect x="272" y="172" width="26" height="14" rx="1" :fill="variant === 'clean' ? '#fed7aa' : '#c0a878'" />
      </g>

      <!-- Building 6: Casa pequeña morada (hidden on mobile) -->
      <g v-if="!isMobile">
        <rect x="315" y="115" width="45" height="85" :fill="variant === 'clean' ? '#d8b4fe' : '#b8a0c8'" />
        <rect x="315" y="115" width="45" height="85" fill="url(#stucco)" />
        <polygon points="315,115 337,90 360,115" :fill="variant === 'clean' ? '#a855f7' : '#8868a8'" />
        <polygon points="315,115 337,90 360,115" fill="url(#teja)" />
        <rect x="315" y="195" width="45" height="5" fill="#a8a29e" />
        <rect x="325" y="130" width="10" height="12" rx="1" :fill="windowFill(5)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="345" y="130" width="10" height="12" rx="1" :fill="windowFill(1)" :stroke="windowStroke" stroke-width="0.8" />
        <rect x="330" y="160" width="14" height="30" rx="2" fill="#581c87" opacity="0.6" />
        <circle cx="341" cy="177" r="1" fill="#D4A843" />
      </g>

      <!-- Sidewalk line -->
      <rect x="0" y="195" width="400" height="5" :fill="variant === 'dirty' ? '#b8b5b0' : variant === 'clean' ? '#e7e5e4' : '#d6d3d1'" />
      <rect x="0" y="195" width="400" height="5" fill="url(#baldosa)" />

      <!-- Sidewalk details -->
      <line v-for="i in 15" :key="'sw'+i" :x1="i*28" y1="195" :x2="i*28" y2="200" stroke="rgba(0,0,0,0.06)" stroke-width="0.5" />

      <!-- Trees (clean) -->
      <g v-if="variant === 'clean'">
        <rect x="73" y="170" width="4" height="25" fill="#92400e" rx="1" />
        <ellipse cx="75" cy="162" rx="16" ry="14" fill="#22c55e" />
        <ellipse cx="72" cy="158" rx="10" ry="10" fill="#4ade80" />

        <rect x="197" y="172" width="4" height="23" fill="#92400e" rx="1" />
        <ellipse cx="199" cy="164" rx="14" ry="12" fill="#16a34a" />
        <ellipse cx="196" cy="160" rx="9" ry="9" fill="#22c55e" />

        <rect x="313" y="175" width="3" height="20" fill="#92400e" rx="1" />
        <ellipse cx="314" cy="168" rx="12" ry="10" fill="#15803d" />
        <ellipse cx="312" cy="165" rx="7" ry="8" fill="#22c55e" />
      </g>

      <!-- Trash / dirt (dirty) -->
      <g v-if="variant === 'dirty'" opacity="0.6">
        <text x="30" y="192" font-size="8">🛍️</text>
        <text x="160" y="194" font-size="6">📄</text>
        <text x="250" y="190" font-size="7">🥤</text>
        <text x="330" y="193" font-size="5">📦</text>
      </g>

      <!-- Lamp posts -->
      <g>
        <rect x="68" y="160" width="2" height="35" fill="#6b7280" rx="0.5" />
        <rect x="64" y="157" width="10" height="4" rx="2" fill="#9ca3af" />
        <ellipse v-if="variant !== 'dirty'" cx="69" cy="157" rx="8" ry="6" fill="rgba(254,240,138,0.15)" />

        <rect x="258" y="165" width="2" height="30" fill="#6b7280" rx="0.5" />
        <rect x="254" y="162" width="10" height="4" rx="2" fill="#9ca3af" />
        <ellipse v-if="variant !== 'dirty'" cx="259" cy="162" rx="8" ry="6" fill="rgba(254,240,138,0.15)" />
      </g>
    </svg>

    <!-- Road -->
    <div class="road">
      <div class="road__surface" />
      <div class="road__line" />
      <div v-if="variant === 'dirty'" class="road__cracks">
        <span v-for="i in 3" :key="i" class="road__crack" :style="{ left: (20 + i * 25) + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'dirty' | 'normal' | 'clean'
  landmarks?: 'centro' | 'sur' | 'norte' | 'occidente' | 'oriente' | 'default'
}>(), {
  variant: 'normal',
  landmarks: 'default',
})

// Mobile: slice (fills width, crops top) vs Desktop: none (stretches)
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => { isMobile.value = window.innerWidth < 768 })
})

const windowStroke = 'rgba(0,0,0,0.12)'

const yellowWindows = [
  { x: 83, y: 98 }, { x: 100, y: 98 }, { x: 117, y: 98 },
  { x: 83, y: 118 }, { x: 100, y: 118 }, { x: 117, y: 118 },
  { x: 83, y: 140 }, { x: 100, y: 140 }, { x: 117, y: 140 },
]

const blueWindows = [
  { x: 142, y: 66 }, { x: 158, y: 66 }, { x: 175, y: 66 },
  { x: 142, y: 86 }, { x: 158, y: 86 }, { x: 175, y: 86 },
  { x: 142, y: 106 }, { x: 158, y: 106 }, { x: 175, y: 106 },
  { x: 142, y: 126 }, { x: 158, y: 126 }, { x: 175, y: 126 },
  { x: 142, y: 148 }, { x: 158, y: 148 }, { x: 175, y: 148 },
]

// Some windows are lit (warm glow), others are dark or reflective
function windowFill(index: number): string {
  const litWindows = [1, 3, 5, 7, 8]
  if (litWindows.includes(index % 10)) {
    return '#fef9c3' // warm lit yellow
  }
  if (props.variant === 'clean') return '#bfdbfe' // nice sky reflection
  return '#dbeafe' // default glass
}
</script>

<style scoped>
.street {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  z-index: 1;
}

.buildings-svg {
  position: absolute;
  bottom: 8%;
  left: 0;
  width: 100%;
  height: 92%;
}

.road {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8%;
  z-index: 2;
}

.road__surface {
  position: absolute;
  inset: 0;
  background: #57534e;
}

.street--clean .road__surface { background: #78716c; }
.street--dirty .road__surface { background: #44403c; }

.road__line {
  position: absolute;
  top: 45%;
  left: 5%;
  right: 5%;
  height: 2px;
  background: repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 20px, transparent 20px, transparent 35px);
  opacity: 0.5;
}

.road__cracks {
  position: absolute;
  inset: 0;
}

.road__crack {
  position: absolute;
  top: 30%;
  width: 15px;
  height: 2px;
  background: #292524;
  border-radius: 1px;
  transform: rotate(-20deg);
}
</style>
