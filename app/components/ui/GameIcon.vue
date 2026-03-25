<template>
  <img
    v-if="iconUrl"
    :src="iconUrl"
    :width="size"
    :height="size"
    :alt="emoji"
    class="game-icon"
    loading="lazy"
    draggable="false"
  />
  <span v-else class="game-icon game-icon--emoji" :style="emojiStyle">{{ emoji }}</span>
</template>

<script setup lang="ts">
/**
 * Renders an Iconify icon for a game item emoji.
 * Falls back to the raw emoji if no mapping exists.
 *
 * Usage: <GameIcon emoji="🍌" :size="24" />
 *
 * Uses noto (Google color emoji) and fluent-emoji-high-contrast collections.
 */

const props = withDefaults(defineProps<{
  emoji: string
  size?: number
}>(), {
  size: 24,
})

// Emoji → Iconify icon name mapping
// Using noto (color), fluent-emoji-high-contrast, and game-icons collections
const ICON_MAP: Record<string, string> = {
  // ===== FOOD / ORGANIC =====
  '🍌': 'noto:banana',
  '🍎': 'noto:red-apple',
  '🥬': 'noto:leafy-green',
  '☕': 'noto:hot-beverage',
  '🍂': 'noto:fallen-leaf',
  '🍃': 'noto:leaf-fluttering-in-wind',

  // ===== CONTAINERS / WASTE =====
  '🧴': 'noto:lotion-bottle',
  '📰': 'noto:newspaper',
  '🛍️': 'noto:shopping-bags',
  '📦': 'noto:package',
  '🥫': 'noto:canned-food',
  '🥤': 'noto:cup-with-straw',
  '🫙': 'noto:jar',
  '🗑️': 'noto:wastebasket',
  '🩲': 'noto:shorts',

  // ===== NATURE / PLANTS =====
  '🌱': 'noto:seedling',
  '🌿': 'noto:herb',
  '🌳': 'noto:deciduous-tree',
  '🪴': 'noto:potted-plant',
  '🌵': 'noto:cactus',
  '🌻': 'noto:sunflower',
  '🌸': 'noto:cherry-blossom',
  '☘️': 'noto:shamrock',
  '🍀': 'noto:four-leaf-clover',
  '🌾': 'noto:sheaf-of-rice',
  '🪷': 'noto:lotus',
  '💜': 'noto:purple-heart',

  // ===== ANIMALS =====
  '🦋': 'noto:butterfly',
  '🐦': 'noto:bird',
  '🐝': 'noto:honeybee',
  '🐕': 'noto:dog',
  '🐸': 'noto:frog',
  '🦆': 'noto:duck',
  '🦎': 'noto:lizard',
  '🐬': 'noto:dolphin',
  '🐆': 'noto:leopard',
  '🐺': 'noto:wolf',
  '🐤': 'noto:baby-chick',
  '🐟': 'noto:fish',
  '🦟': 'noto:mosquito',

  // ===== WATER =====
  '💧': 'noto:droplet',
  '💦': 'noto:sweat-droplets',
  '🫧': 'noto:bubbles',
  '🌧️': 'noto:cloud-with-rain',
  '🌊': 'noto:water-wave',

  // ===== WEATHER / SKY =====
  '☀️': 'noto:sun',
  '🌤️': 'noto:sun-behind-small-cloud',
  '💨': 'noto:dashing-away',
  '🌅': 'noto:sunrise',
  '🌑': 'noto:new-moon',

  // ===== TOOLS / INFRASTRUCTURE =====
  '🔧': 'noto:wrench',
  '🔨': 'noto:hammer',
  '⛏️': 'noto:pick',
  '🔥': 'noto:fire',
  '🚰': 'noto:potable-water',
  '🧹': 'noto:broom',
  '🚿': 'noto:shower',
  '🧽': 'noto:sponge',
  '🪣': 'noto:bucket',
  '📏': 'noto:straight-ruler',
  '🔴': 'noto:red-circle',

  // ===== BUILDINGS / PLACES =====
  '🏠': 'noto:house',
  '🏗️': 'noto:building-construction',
  '🧱': 'noto:brick',
  '📡': 'noto:satellite-antenna',
  '🏭': 'noto:factory',
  '🏕️': 'noto:camping',

  // ===== TRANSPORT =====
  '🚗': 'noto:automobile',
  '🚶': 'noto:person-walking',
  '🏃': 'noto:person-running',
  '🚲': 'noto:bicycle',

  // ===== SYMBOLS / UI =====
  '⚡': 'noto:high-voltage',
  '📍': 'noto:round-pushpin',
  '🪑': 'noto:chair',
  '🎤': 'noto:microphone',
  '⚽': 'noto:soccer-ball',
  '🎠': 'noto:carousel-horse',
  '📋': 'noto:clipboard',
  '🕳️': 'noto:hole',

  // ===== RECYCLING / ECO =====
  '♻️': 'noto:recycling-symbol',
  '🚫': 'noto:prohibited',
  '🪓': 'noto:axe',
  '🪤': 'noto:mouse-trap',

  // ===== STATUS / FEEDBACK =====
  '✅': 'noto:check-mark-button',
  '⚠️': 'noto:warning',
  '❓': 'noto:red-question-mark',
  '💡': 'noto:light-bulb',
  '🌡️': 'noto:thermometer',

  // ===== CELEBRATION =====
  '🎉': 'noto:party-popper',
  '⭐': 'noto:star',
  '✨': 'noto:sparkles',
  '🌟': 'noto:glowing-star',
  '💫': 'noto:dizzy',
  '🎊': 'noto:confetti-ball',
  '💚': 'noto:green-heart',

  // ===== PEOPLE =====
  '👕': 'noto:t-shirt',
  '🙋': 'noto:person-raising-hand',
  '👨‍👩‍👧': 'noto:family-man-woman-girl',
  '🤷': 'noto:person-shrugging',

  // ===== MISC =====
  '🪵': 'noto:wood',
  '🪨': 'noto:rock',
  '🌍': 'noto:globe-showing-europe-africa',
  '🧺': 'noto:basket',
  '📱': 'noto:mobile-phone',
  '🗃️': 'noto:card-file-box',
  '🏺': 'noto:amphora',
  '📄': 'noto:page-facing-up',
  '🍔': 'noto:hamburger',
  '🪹': 'noto:empty-nest',
  '🏜️': 'noto:desert',
  '🪟': 'noto:window',
  '📚': 'noto:books',
}

// Convert "noto:banana" → "https://api.iconify.design/noto/banana.svg"
const iconUrl = computed(() => {
  const name = ICON_MAP[props.emoji]
  if (!name) return null
  const [collection, icon] = name.split(':')
  if (!collection || !icon) return null
  return `https://api.iconify.design/${collection}/${icon}.svg`
})

const emojiStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
  fontSize: props.size + 'px',
  lineHeight: props.size + 'px',
}))
</script>

<style scoped>
.game-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.game-icon--emoji {
  line-height: 1;
}
</style>
