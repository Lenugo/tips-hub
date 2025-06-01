import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

const messages = { en, es }

const i18n = createI18n({
  legacy: false,
  locale: import.meta.env.VITE_DEFAULT_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_DEFAULT_FALLBACK_LOCALE || 'en',
  messages,
  globalInjection: true
})

export default i18n
