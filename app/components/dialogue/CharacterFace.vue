<template>
  <svg
    :viewBox="viewBox"
    class="character-face"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- LILA -->
    <template v-if="characterId === 'lila'">
      <!-- Hair (braids) -->
      <ellipse cx="50" cy="30" rx="38" ry="32" fill="#3d2314" />
      <rect x="14" y="40" width="10" height="28" rx="5" fill="#3d2314" />
      <rect x="76" y="40" width="10" height="28" rx="5" fill="#3d2314" />
      <circle cx="19" cy="70" r="5" fill="#3d2314" />
      <circle cx="81" cy="70" r="5" fill="#3d2314" />
      <!-- Face -->
      <ellipse cx="50" cy="48" rx="28" ry="26" fill="#c68642" />
      <!-- Eyes -->
      <ellipse
        v-if="!isBlinking"
        cx="39"
        cy="44"
        rx="4.5"
        ry="5"
        fill="white"
      />
      <ellipse
        v-if="!isBlinking"
        cx="61"
        cy="44"
        rx="4.5"
        ry="5"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(39)"
        :cy="eyeY(44)"
        r="2.5"
        fill="#2d1810"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(61)"
        :cy="eyeY(44)"
        r="2.5"
        fill="#2d1810"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(39) + 1"
        :cy="eyeY(44) - 1"
        r="0.8"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(61) + 1"
        :cy="eyeY(44) - 1"
        r="0.8"
        fill="white"
      />
      <line
        v-if="isBlinking"
        x1="34"
        y1="44"
        x2="44"
        y2="44"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        v-if="isBlinking"
        x1="56"
        y1="44"
        x2="66"
        y2="44"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Eyebrows -->
      <line
        x1="34"
        :y1="browY(37)"
        x2="44"
        :y2="browY(35)"
        stroke="#3d2314"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        x1="56"
        :y1="browY(35)"
        x2="66"
        :y2="browY(37)"
        stroke="#3d2314"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Mouth -->
      <path
        :d="mouthPath"
        :fill="mouthFill"
        :stroke="mouthColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Blush -->
      <ellipse cx="33" cy="54" rx="5" ry="3" fill="rgba(255,100,100,0.2)" />
      <ellipse cx="67" cy="54" rx="5" ry="3" fill="rgba(255,100,100,0.2)" />
      <!-- Band / headband -->
      <rect x="22" y="30" width="56" height="5" rx="2" fill="#34d399" />
    </template>

    <!-- TIMO -->
    <template v-else-if="characterId === 'timo'">
      <!-- Hair (messy) -->
      <ellipse cx="50" cy="28" rx="34" ry="26" fill="#4a2c0a" />
      <circle cx="30" cy="16" r="8" fill="#4a2c0a" />
      <circle cx="55" cy="12" r="10" fill="#4a2c0a" />
      <circle cx="72" cy="18" r="7" fill="#4a2c0a" />
      <!-- Face -->
      <ellipse cx="50" cy="48" rx="27" ry="25" fill="#dba77b" />
      <!-- Goggles on forehead -->
      <rect x="28" y="28" width="44" height="8" rx="4" fill="#f59e0b" />
      <circle
        cx="38"
        cy="32"
        r="6"
        fill="#92a3b5"
        stroke="#f59e0b"
        stroke-width="2"
      />
      <circle
        cx="62"
        cy="32"
        r="6"
        fill="#92a3b5"
        stroke="#f59e0b"
        stroke-width="2"
      />
      <!-- Eyes -->
      <ellipse
        v-if="!isBlinking"
        cx="39"
        cy="45"
        rx="4"
        ry="4.5"
        fill="white"
      />
      <ellipse
        v-if="!isBlinking"
        cx="61"
        cy="45"
        rx="4"
        ry="4.5"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(39)"
        :cy="eyeY(45)"
        r="2.5"
        fill="#2d1810"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(61)"
        :cy="eyeY(45)"
        r="2.5"
        fill="#2d1810"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(39) + 1"
        :cy="eyeY(45) - 1"
        r="0.8"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(61) + 1"
        :cy="eyeY(45) - 1"
        r="0.8"
        fill="white"
      />
      <line
        v-if="isBlinking"
        x1="34"
        y1="45"
        x2="44"
        y2="45"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        v-if="isBlinking"
        x1="56"
        y1="45"
        x2="66"
        y2="45"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Eyebrows -->
      <line
        x1="34"
        :y1="browY(38)"
        x2="44"
        :y2="browY(37)"
        stroke="#4a2c0a"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        x1="56"
        :y1="browY(37)"
        x2="66"
        :y2="browY(38)"
        stroke="#4a2c0a"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Mouth -->
      <path
        :d="mouthPath"
        :fill="mouthFill"
        :stroke="mouthColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Freckles -->
      <circle cx="35" cy="52" r="1" fill="rgba(139,94,52,0.4)" />
      <circle cx="38" cy="54" r="1" fill="rgba(139,94,52,0.4)" />
      <circle cx="62" cy="52" r="1" fill="rgba(139,94,52,0.4)" />
      <circle cx="65" cy="54" r="1" fill="rgba(139,94,52,0.4)" />
    </template>

    <!-- XANI -->
    <template v-else-if="characterId === 'xani'">
      <!-- Hair (long, dark) -->
      <ellipse cx="50" cy="32" rx="36" ry="30" fill="#1a1a2e" />
      <ellipse cx="28" cy="55" rx="10" ry="22" fill="#1a1a2e" />
      <ellipse cx="72" cy="55" rx="10" ry="22" fill="#1a1a2e" />
      <!-- Flower in hair -->
      <circle cx="74" cy="26" r="5" fill="#c084fc" />
      <circle cx="74" cy="26" r="2" fill="#fbbf24" />
      <!-- Face -->
      <ellipse cx="50" cy="48" rx="26" ry="24" fill="#b07848" />
      <!-- Eyes (more calm, slightly smaller) -->
      <ellipse v-if="!isBlinking" cx="40" cy="46" rx="4" ry="4" fill="white" />
      <ellipse v-if="!isBlinking" cx="60" cy="46" rx="4" ry="4" fill="white" />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(40)"
        :cy="eyeY(46)"
        r="2.3"
        fill="#1a1a2e"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(60)"
        :cy="eyeY(46)"
        r="2.3"
        fill="#1a1a2e"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(40) + 0.8"
        :cy="eyeY(46) - 0.8"
        r="0.7"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(60) + 0.8"
        :cy="eyeY(46) - 0.8"
        r="0.7"
        fill="white"
      />
      <line
        v-if="isBlinking"
        x1="35"
        y1="46"
        x2="45"
        y2="46"
        stroke="#1a1a2e"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        v-if="isBlinking"
        x1="55"
        y1="46"
        x2="65"
        y2="46"
        stroke="#1a1a2e"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Eyebrows (gentle) -->
      <path
        :d="`M36 ${browY(40)} Q40 ${browY(38)} 44 ${browY(40)}`"
        fill="none"
        stroke="#1a1a2e"
        stroke-width="1.5"
      />
      <path
        :d="`M56 ${browY(40)} Q60 ${browY(38)} 64 ${browY(40)}`"
        fill="none"
        stroke="#1a1a2e"
        stroke-width="1.5"
      />
      <!-- Mouth -->
      <path
        :d="mouthPath"
        :fill="mouthFill"
        :stroke="mouthColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </template>

    <!-- DON TOÑO -->
    <template v-else-if="characterId === 'don-tono'">
      <!-- Hat -->
      <rect x="20" y="14" width="60" height="8" rx="4" fill="#8b6f47" />
      <rect x="30" y="6" width="40" height="14" rx="6" fill="#a0845c" />
      <!-- Face -->
      <ellipse cx="50" cy="50" rx="28" ry="27" fill="#c9a06c" />
      <!-- Wrinkles -->
      <path
        d="M30 42 Q32 40 34 42"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        stroke-width="1"
      />
      <path
        d="M66 42 Q68 40 70 42"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        stroke-width="1"
      />
      <!-- Eyes (smaller, friendly) -->
      <ellipse
        v-if="!isBlinking"
        cx="40"
        cy="46"
        rx="3.5"
        ry="3.5"
        fill="white"
      />
      <ellipse
        v-if="!isBlinking"
        cx="60"
        cy="46"
        rx="3.5"
        ry="3.5"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(40)"
        :cy="eyeY(46)"
        r="2"
        fill="#3d2314"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(60)"
        :cy="eyeY(46)"
        r="2"
        fill="#3d2314"
      />
      <line
        v-if="isBlinking"
        x1="36"
        y1="46"
        x2="44"
        y2="46"
        stroke="#3d2314"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        v-if="isBlinking"
        x1="56"
        y1="46"
        x2="64"
        y2="46"
        stroke="#3d2314"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Bushy eyebrows -->
      <path
        :d="`M34 ${browY(40)} Q39 ${browY(37)} 44 ${browY(40)}`"
        fill="none"
        stroke="#6b5b3e"
        stroke-width="2.5"
      />
      <path
        :d="`M56 ${browY(40)} Q61 ${browY(37)} 66 ${browY(40)}`"
        fill="none"
        stroke="#6b5b3e"
        stroke-width="2.5"
      />
      <!-- Mustache -->
      <path
        d="M38 56 Q44 60 50 56 Q56 60 62 56"
        fill="none"
        stroke="#6b5b3e"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Mouth (under mustache) -->
      <path
        :d="mouthPathDonTono"
        :fill="mouthFillDonTono"
        :stroke="mouthColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </template>

    <!-- NUBE GRIS -->
    <template v-else-if="characterId === 'nube-gris'">
      <!-- Cloud body -->
      <ellipse cx="50" cy="50" rx="38" ry="28" fill="#9ca3af" />
      <circle cx="30" cy="38" r="18" fill="#9ca3af" />
      <circle cx="55" cy="30" r="20" fill="#a8b0bc" />
      <circle cx="72" cy="40" r="15" fill="#9ca3af" />
      <!-- Dark patches -->
      <circle cx="35" cy="55" r="8" fill="rgba(0,0,0,0.08)" />
      <circle cx="65" cy="52" r="6" fill="rgba(0,0,0,0.06)" />
      <!-- Eyes (mischievous, angular) -->
      <ellipse
        v-if="!isBlinking"
        cx="38"
        cy="48"
        rx="5"
        ry="4.5"
        fill="white"
      />
      <ellipse
        v-if="!isBlinking"
        cx="62"
        cy="48"
        rx="5"
        ry="4.5"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(38)"
        :cy="eyeY(48)"
        r="2.8"
        fill="#374151"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(62)"
        :cy="eyeY(48)"
        r="2.8"
        fill="#374151"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(38) + 1"
        :cy="eyeY(48) - 1"
        r="0.9"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(62) + 1"
        :cy="eyeY(48) - 1"
        r="0.9"
        fill="white"
      />
      <line
        v-if="isBlinking"
        x1="33"
        y1="48"
        x2="43"
        y2="48"
        stroke="#374151"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <line
        v-if="isBlinking"
        x1="57"
        y1="48"
        x2="67"
        y2="48"
        stroke="#374151"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Angry/mischievous eyebrows -->
      <line
        x1="33"
        :y1="browY(40)"
        x2="43"
        :y2="browY(43)"
        stroke="#4b5563"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <line
        x1="57"
        :y1="browY(43)"
        x2="67"
        :y2="browY(40)"
        stroke="#4b5563"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Mouth -->
      <path
        :d="mouthPath"
        :fill="mouthFill"
        :stroke="mouthColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </template>

    <!-- NICO -->
    <template v-else-if="characterId === 'nico'">
      <!-- Hair (short, sporty) -->
      <ellipse cx="50" cy="30" rx="30" ry="24" fill="#2d1810" />
      <!-- Headband -->
      <rect x="22" y="28" width="56" height="5" rx="2" fill="#3b82f6" />
      <!-- Face -->
      <ellipse cx="50" cy="48" rx="26" ry="24" fill="#c68642" />
      <!-- Eyes -->
      <ellipse
        v-if="!isBlinking"
        cx="40"
        cy="45"
        rx="4"
        ry="4.5"
        fill="white"
      />
      <ellipse
        v-if="!isBlinking"
        cx="60"
        cy="45"
        rx="4"
        ry="4.5"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(40)"
        :cy="eyeY(45)"
        r="2.5"
        fill="#2d1810"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(60)"
        :cy="eyeY(45)"
        r="2.5"
        fill="#2d1810"
      />
      <line
        v-if="isBlinking"
        x1="35"
        y1="45"
        x2="45"
        y2="45"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        v-if="isBlinking"
        x1="55"
        y1="45"
        x2="65"
        y2="45"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Eyebrows -->
      <line
        x1="35"
        :y1="browY(38)"
        x2="44"
        :y2="browY(37)"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        x1="56"
        :y1="browY(37)"
        x2="65"
        :y2="browY(38)"
        stroke="#2d1810"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Mouth -->
      <path
        :d="mouthPath"
        :fill="mouthFill"
        :stroke="mouthColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </template>

    <!-- VALE -->
    <template v-else-if="characterId === 'vale'">
      <!-- Hair (pulled back, bandana) -->
      <ellipse cx="50" cy="30" rx="32" ry="26" fill="#5c3a1e" />
      <rect x="22" y="24" width="56" height="6" rx="3" fill="#fbbf24" />
      <!-- Face -->
      <ellipse cx="50" cy="48" rx="26" ry="24" fill="#c9a06c" />
      <!-- Eyes -->
      <ellipse
        v-if="!isBlinking"
        cx="40"
        cy="45"
        rx="4"
        ry="4.5"
        fill="white"
      />
      <ellipse
        v-if="!isBlinking"
        cx="60"
        cy="45"
        rx="4"
        ry="4.5"
        fill="white"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(40)"
        :cy="eyeY(45)"
        r="2.3"
        fill="#3d2314"
      />
      <circle
        v-if="!isBlinking"
        :cx="eyeX(60)"
        :cy="eyeY(45)"
        r="2.3"
        fill="#3d2314"
      />
      <line
        v-if="isBlinking"
        x1="35"
        y1="45"
        x2="45"
        y2="45"
        stroke="#3d2314"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        v-if="isBlinking"
        x1="55"
        y1="45"
        x2="65"
        y2="45"
        stroke="#3d2314"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Eyebrows -->
      <path
        :d="`M35 ${browY(39)} Q40 ${browY(37)} 44 ${browY(39)}`"
        fill="none"
        stroke="#5c3a1e"
        stroke-width="1.5"
      />
      <path
        :d="`M56 ${browY(39)} Q60 ${browY(37)} 65 ${browY(39)}`"
        fill="none"
        stroke="#5c3a1e"
        stroke-width="1.5"
      />
      <!-- Mouth -->
      <path
        :d="mouthPath"
        :fill="mouthFill"
        :stroke="mouthColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Earrings -->
      <circle cx="24" cy="52" r="2.5" fill="#fbbf24" />
      <circle cx="76" cy="52" r="2.5" fill="#fbbf24" />
    </template>

    <!-- BOLILLO — PNG portrait con capas posicionadas + easter egg -->
    <template v-else-if="characterId === 'bolillo'">
      <foreignObject x="0" y="0" width="100" height="80">
        <div
          class="bolillo-portrait"
          :class="{ 'bolillo-portrait--petted': bolilloPetted }"
          @pointerdown.prevent="petBolillo"
        >
          <img
            src="~/assets/images/bolillo/bolillo-base.png"
            alt="Bolillo"
            class="bolillo-portrait__base"
          />
          <img :src="bolilloPetted ? bolilloEyesHappyImg : bolilloFaceEyes" alt="" class="bolillo-portrait__eyes" />
          <img :src="bolilloPetted ? bolilloMouthWideImg : bolilloFaceMouth" alt="" class="bolillo-portrait__mouth" />
          <!-- Pet hearts easter egg -->
          <div v-if="bolilloPetted" class="bolillo-portrait__hearts">
            <span class="bolillo-portrait__heart" style="left:10%;animation-delay:0s">❤️</span>
            <span class="bolillo-portrait__heart" style="left:45%;animation-delay:0.2s">💛</span>
            <span class="bolillo-portrait__heart" style="left:75%;animation-delay:0.4s">❤️</span>
          </div>
        </div>
      </foreignObject>
    </template>

    <!-- FALLBACK -->
    <template v-else>
      <circle cx="50" cy="45" r="30" fill="#9ca3af" />
      <circle v-if="!isBlinking" cx="40" cy="42" r="4" fill="white" />
      <circle v-if="!isBlinking" cx="60" cy="42" r="4" fill="white" />
      <circle v-if="!isBlinking" cx="40" cy="42" r="2" fill="#333" />
      <circle v-if="!isBlinking" cx="60" cy="42" r="2" fill="#333" />
      <path
        :d="mouthPath"
        :fill="mouthFill"
        stroke="#333"
        stroke-width="2"
        stroke-linecap="round"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { Emotion } from "~/shared/types/character";

const props = withDefaults(
  defineProps<{
    characterId: string;
    emotion?: Emotion;
    isSpeaking?: boolean;
  }>(),
  {
    emotion: "neutral",
    isSpeaking: false,
  }
);

const viewBox = "0 0 100 80";

const isBlinking = ref(false);
const mouthOpen = ref(false);
let blinkInterval: ReturnType<typeof setInterval> | null = null;
let talkInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  blinkInterval = setInterval(() => {
    isBlinking.value = true;
    setTimeout(() => {
      isBlinking.value = false;
    }, 150);
  }, 3000 + Math.random() * 2000);
});

// Mouth open/close while speaking
watch(
  () => props.isSpeaking,
  (speaking) => {
    // Always clear first to prevent accumulation
    if (talkInterval) { clearInterval(talkInterval); talkInterval = null; }
    if (speaking) {
      mouthOpen.value = true;
      talkInterval = setInterval(() => {
        mouthOpen.value = !mouthOpen.value;
      }, 180);
    } else {
      if (talkInterval) {
        clearInterval(talkInterval);
        talkInterval = null;
      }
      mouthOpen.value = false;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (blinkInterval) clearInterval(blinkInterval);
  if (talkInterval) clearInterval(talkInterval);
});

// Eye direction based on emotion
function eyeX(baseX: number) {
  if (props.emotion === "thinking") return baseX - 1.5;
  if (props.emotion === "surprised") return baseX;
  return baseX;
}

function eyeY(baseY: number) {
  if (props.emotion === "sad" || props.emotion === "worried") return baseY + 1;
  if (props.emotion === "excited" || props.emotion === "surprised")
    return baseY - 0.5;
  return baseY;
}

// Eyebrow position based on emotion
function browY(baseY: number) {
  if (props.emotion === "sad" || props.emotion === "worried") return baseY + 2;
  if (props.emotion === "angry") return baseY - 2;
  if (props.emotion === "excited" || props.emotion === "surprised")
    return baseY - 3;
  if (props.emotion === "happy" || props.emotion === "proud") return baseY - 1;
  return baseY;
}

// Mouth shape based on emotion + talking
const mouthPath = computed(() => {
  // Open mouth when talking
  if (mouthOpen.value) return "M40 57 Q50 68 60 57 Q50 62 40 57";
  const e = props.emotion;
  if (e === "happy" || e === "excited" || e === "proud")
    return "M38 58 Q50 68 62 58";
  if (e === "sad") return "M40 62 Q50 56 60 62";
  if (e === "worried") return "M40 61 Q50 57 60 61";
  if (e === "angry") return "M40 60 L60 60";
  if (e === "surprised") return "M44 58 Q50 65 56 58";
  if (e === "mischievous") return "M38 58 Q45 64 55 60 Q58 58 62 60";
  if (e === "thinking") return "M42 60 Q48 58 54 60";
  return "M40 59 Q50 64 60 59";
});

const mouthFill = computed(() => {
  if (mouthOpen.value) return "#8b2020";
  return "none";
});

const mouthPathDonTono = computed(() => {
  if (mouthOpen.value) return "M43 62 Q50 70 57 62 Q50 65 43 62";
  const e = props.emotion;
  if (e === "happy" || e === "proud") return "M42 62 Q50 68 58 62";
  if (e === "sad") return "M42 66 Q50 62 58 66";
  if (e === "surprised") return "M46 63 Q50 68 54 63";
  return "M43 64 Q50 67 57 64";
});

const mouthFillDonTono = computed(() => {
  if (mouthOpen.value) return "#8b2020";
  return "none";
});

const mouthColor = computed(() => {
  const e = props.emotion;
  if (e === "happy" || e === "excited" || e === "proud") return "#d14444";
  if (props.characterId === "nube-gris") return "#4b5563";
  return "#8b4513";
});

// Bolillo mouth — positions adjusted for the prominent muzzle (lower on face)
const mouthPathBolillo = computed(() => {
  if (mouthOpen.value) return "M45 60 Q48 66 50 62 Q52 66 55 60";
  const e = props.emotion;
  if (e === "happy" || e === "excited" || e === "proud")
    return "M44 60 Q47 64 50 62 Q53 64 56 60";
  if (e === "sad" || e === "worried") return "M46 62 Q50 59 54 62";
  if (e === "angry") return "M46 61 L54 61";
  if (e === "surprised") return "M47 60 Q50 64 53 60";
  // Neutral — sonrisa suave, amigable. "Aquí ando, todo bien."
  return "M44 59 Q47 63 50 61 Q53 63 56 59";
});

const mouthFillBolillo = computed(() => {
  if (mouthOpen.value) return "#6b2020";
  return "none";
});

// ===== BOLILLO PNG face layers for portrait =====
import bolilloEyesNeutralImg from "~/assets/images/bolillo/bolillo-eyes-neutral.png";
import bolilloEyesHappyImg from "~/assets/images/bolillo/bolillo-eyes-happy.png";
import bolilloEyesSadImg from "~/assets/images/bolillo/bolillo-eyes-sad.png";
import bolilloMouthClosedImg from "~/assets/images/bolillo/bolillo-mouth-2-closed.png";
import bolilloMouthWideImg from "~/assets/images/bolillo/bolillo-mouth-2-wide.png";

const bolilloFaceEyes = computed(() => {
  const e = props.emotion;
  if (e === "happy" || e === "excited" || e === "proud")
    return bolilloEyesHappyImg;
  if (e === "sad" || e === "worried") return bolilloEyesSadImg;
  return bolilloEyesNeutralImg;
});

const bolilloFaceMouth = computed(() => {
  const e = props.emotion;
  if (e === "happy" || e === "excited" || e === "proud")
    return bolilloMouthWideImg;
  return bolilloMouthClosedImg;
});

// Easter egg: pet Bolillo 5 rapid taps → happy reaction with hearts
const bolilloPetCount = ref(0);
const bolilloPetted = ref(false);
let bolilloPetTimer: ReturnType<typeof setTimeout> | null = null;
let bolilloPetResetTimer: ReturnType<typeof setTimeout> | null = null;
let lastBolilloPetTime = 0;

function petBolillo() {
  if (bolilloPetted.value) return;
  const now = Date.now();
  if (now - lastBolilloPetTime < 100) return;
  lastBolilloPetTime = now;
  bolilloPetCount.value++;
  if (bolilloPetResetTimer) clearTimeout(bolilloPetResetTimer);
  bolilloPetResetTimer = setTimeout(() => { bolilloPetCount.value = 0; }, 3000);
  if (bolilloPetCount.value >= 5) {
    bolilloPetted.value = true;
    bolilloPetCount.value = 0;
    if (bolilloPetTimer) clearTimeout(bolilloPetTimer);
    bolilloPetTimer = setTimeout(() => { bolilloPetted.value = false; }, 3000);
  }
}

onUnmounted(() => {
  if (bolilloPetTimer) clearTimeout(bolilloPetTimer);
  if (bolilloPetResetTimer) clearTimeout(bolilloPetResetTimer);
});
</script>

<style scoped>
.character-face {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15));
}

/* Bolillo portrait — positioned layers */
.bolillo-portrait {
  position: relative;
  width: 100%;
  height: 100%;
}
.bolillo-portrait__base {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center top;
}
.bolillo-portrait__eyes {
  position: absolute;
  width: 31%;
  left: 29%;
  top: 15%;
  pointer-events: none;
  object-fit: contain;
}
.bolillo-portrait__mouth {
  position: absolute;
  width: 28%;
  left: 31%;
  top: 21%;
  pointer-events: none;
  object-fit: contain;
}

/* Easter egg: petted state */
.bolillo-portrait--petted {
  animation: bolilloPetWiggle 0.3s ease 3;
}

.bolillo-portrait__hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}

.bolillo-portrait__heart {
  position: absolute;
  bottom: 60%;
  font-size: 12px;
  animation: heartFloat 1s ease-out forwards;
  pointer-events: none;
}

@keyframes bolilloPetWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-4deg); }
  75% { transform: rotate(4deg); }
}

@keyframes heartFloat {
  0% { opacity: 1; transform: translateY(0) scale(0.5); }
  50% { opacity: 1; transform: translateY(-15px) scale(1); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.8); }
}
</style>
