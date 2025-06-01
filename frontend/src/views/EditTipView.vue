<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTipsStore } from '../stores/tips'
import { useUserStore } from '../stores/user'
import { TipForm } from '../components'
import type { Tip } from '../types'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const tipsStore = useTipsStore()
const userStore = useUserStore()

const tipId = computed(() => route.params.id as string)
const isLoading = computed(() => tipsStore.isLoading) 
const error = ref('')
const tip = ref<Tip | null>(null)
const isSubmitting = ref(false) 
const { t } = useI18n()

const loadTip = async () => {
  error.value = ''
  
  try {
    const result = await tipsStore.getTipById(tipId.value)
    tip.value = result
    
    if (tip.value && userStore.currentUser) {
      const isAuthor = tip.value.data.author?._id === userStore.currentUser.id

      if (!isAuthor) {
        error.value = 'No tienes permiso para editar este consejo'
        router.push('/')
      }
    }
  } catch (err) {
    error.value = 'Error al cargar el consejo. Inténtalo de nuevo.'
  }
}

const handleSubmit = async (formData: { title: string; content: string; categories: string[] }) => {
  if (!tip.value) return
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    const result = await tipsStore.updateTip(tipId.value, {
      title: formData.title,
      content: formData.content,
      categories: formData.categories
    })
    
    if (result) {
      router.push(`/tip/${tipId.value}`)
    } else {
      error.value = 'Error al actualizar el consejo. Inténtalo de nuevo.'
    }
  } catch (err) {
    console.error('Error al actualizar el tip:', err)
    error.value = 'Error al actualizar el consejo. Inténtalo de nuevo.'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }
  
  await loadTip()
})
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-slate-900 mb-6">{{ t('tip.edit') }}</h1>
      
      <!-- Error message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
        {{ error }}
      </div>
      
      <div v-if="!isLoading && tip" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <TipForm 
          :initialData="tip.data"
          :categories="tipsStore.categories"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
        
        <!-- Loading overlay during submission -->
        <div v-if="isSubmitting" class="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-xl">
            <div class="animate-pulse flex space-x-2">
              <div class="w-3 h-3 rounded-full bg-teal-400"></div>
              <div class="w-3 h-3 rounded-full bg-teal-500"></div>
              <div class="w-3 h-3 rounded-full bg-teal-600"></div>
            </div>
            <p class="text-slate-700 mt-2">{{ t('common.loading') }}</p>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-else-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-pulse flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-teal-400"></div>
          <div class="w-3 h-3 rounded-full bg-teal-500"></div>
          <div class="w-3 h-3 rounded-full bg-teal-600"></div>
        </div>
      </div>
    </div>
  </div>
</template>
