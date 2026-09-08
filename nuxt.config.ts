// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-09-04",
  devtools: { enabled: false },
  modules: ["@pinia/nuxt"],
  pages: true,
  future: {
    compatibilityVersion: 4,
  },
  typescript: {
    strict: true,
  },
});
