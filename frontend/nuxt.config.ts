// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['./assets/breakpoints.css', './assets/base.css', './assets/main.css'],
  modules: ['@pinia/nuxt', '@nuxt/test-utils/module'],
  experimental: { asyncContext: true },
})