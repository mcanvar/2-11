import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],

  // @ts-expect-error: i18n is a module option
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'tr', name: 'Turkish', file: 'tr.json' }
    ]
  },

  app: {
    head: {
      title: '2048 Game',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern 2048 game built with Nuxt 3 and Tailwind CSS' }
      ]
    }
  },

  compatibilityDate: '2025-04-14'
})