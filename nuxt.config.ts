// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/image"],

  // 暂时禁用 SSR 以避免 reka-ui ConfigProvider 错误
  // 这是一个已知的 @nuxt/ui 4.2.1 与 reka-ui 的 SSR 兼容性问题
  ssr: false,

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://127.0.0.1:8203",
    },
  },

  routeRules: {
    // 暂时禁用预渲染以避免 SSR 错误
    // "/": { prerender: true },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
        quotes: "single",
        semi: false,
      },
    },
  },

  // 禁用 Google Fonts 提供程序以避免网络连接问题
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },

  image: {
    domains: ["minio-api.carolin-violet.cn"],
    providers: {
      ipx: {},
    },
  },
});
