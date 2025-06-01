<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('preferred-language', lang)
}

const savedLanguage = localStorage.getItem('preferred-language')
if (savedLanguage && availableLocales.includes(savedLanguage)) {
  locale.value = savedLanguage
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <button
      v-for="lang in availableLocales"
      :key="lang"
      @click="switchLanguage(lang)"
      class="px-2 py-1 text-sm rounded transition-colors hover:cursor-pointer"
      :class="{
        'bg-teal-100 text-teal-700 font-medium': locale === lang,
        'text-slate-600 hover:text-teal-600': locale !== lang
      }"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>