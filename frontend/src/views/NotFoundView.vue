<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="container mx-auto py-12 px-4 text-center">
    <div class="mb-6 text-6xl">🔍</div>
    <h1 class="text-3xl font-bold text-slate-900 mb-4">{{ t('notFound.title') }}</h1>
    <p class="text-slate-600 max-w-md mx-auto mb-8">
      {{ t('notFound.description') }}
    </p>
    <button 
      @click="goToHome"
      class="btn btn-primary"
    >
    {{ t('notFound.goHome')}}
    </button>
  </div>
</template>
