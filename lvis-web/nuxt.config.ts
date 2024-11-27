// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
      public: {
          apiUrl: process.env.API_URL,
          systemApiUrl: process.env.SYSTEM_API_URL,
          warehouseApiUrl: process.env.WAREHOUSE_API_URL,
          graphqlApiUrl: process.env.GRAPHQL_API_URL,
      }
  },

  devtools: { enabled: true },

  app: {
      baseURL: '/lvis/',
      head: {
          title: "Leyeco V Integrated System",
          meta: [
              { charset: 'utf-8' },
              { name: 'author', content: 'William Jay Inclino' },
              { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          ],
          link: [
              { rel: 'author', href: 'https://www.facebook.com/jewell.inclino' },
          ],
        //   script: [
        //   ],
      }
  },

  plugins: [
      { src: '~/plugins/fontawesome.ts', mode: 'client' },
      { src: '~/plugins/bootstrap.client.ts', mode: 'client' },
      { src: '~/plugins/vue-toastification.ts', mode: 'client' },
      { src: '~/plugins/vue-select.ts', mode: 'client' },
      { src: '~/plugins/vuedraggable.ts', mode: 'client' },
  ],

  css: [
      'bootstrap/dist/css/bootstrap.min.css',
      '~/assets/css/main.css'
  ],

  // pages: true,
  build: {
      transpile: ['vue-toastification'],
  },

  vite: {
    esbuild: {
        drop: ['debugger'],
        pure: ['console.log', 'console.debug', 'console.trace'],
    }
  }

})