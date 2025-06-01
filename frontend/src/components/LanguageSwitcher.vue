<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()

const switchLanguage = (event: Event) => {
  const lang = (event.target as HTMLSelectElement).value
  locale.value = lang
  localStorage.setItem('preferred-language', lang)
}

const savedLanguage = localStorage.getItem('preferred-language')
if (savedLanguage && availableLocales.includes(savedLanguage)) {
  locale.value = savedLanguage
}
</script>

<template>
  <select
    class="p-1 rounded-lg border border-slate-300 bg-white text-teal-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-200"
    :value="locale"
    @change="switchLanguage"
  >
    <option v-for="lang in availableLocales" :key="lang" :value="lang">
      {{ lang.toUpperCase() }}
    </option>
  </select>
</template>