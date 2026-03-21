/**
 * Phaser client-only plugin.
 * Phaser is lazy-imported by usePhaserGame — this plugin just ensures
 * no SSR issues if Phaser modules are accidentally resolved server-side.
 */
export default defineNuxtPlugin(() => {
  // Phaser is loaded on-demand via dynamic import in usePhaserGame.
  // This plugin exists as a safety net for the client-only constraint.
})
