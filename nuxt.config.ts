// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image'],

  ssr: true,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://wallpaper-backend.carolin-violet.cn:8000'
    }
  },

  routeRules: {},

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
        quotes: 'single',
        semi: false
      }
    }
  },

  fonts: {
    providers: {
      google: false,
      googleicons: false
    }
  },

  image: {
    domains: ['minio-api.carolin-violet.cn'],
    providers: {
      ipx: {}
    }
  }
})
