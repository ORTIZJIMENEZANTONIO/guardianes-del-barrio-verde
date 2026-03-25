export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxt/icon'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Guardianes del Barrio Verde',
      meta: [
        { name: 'description', content: 'Transforma tu colonia. Cuida el agua. Planta vida. Cambia tu barrio.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#1b5e3b' },
        { property: 'og:title', content: 'Guardianes del Barrio Verde' },
        { property: 'og:description', content: 'Transforma tu colonia. Cuida el agua. Planta vida. Cambia tu barrio.' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap' },
      ],
    },
  },

  // SPA mode
  ssr: false,

  // Proxy /cercu-backend to local Express backend in dev
  nitro: {
    devProxy: {
      '/cercu-backend/': {
        target: 'http://localhost:3003/',
        changeOrigin: true,
      },
    },
  },
})
