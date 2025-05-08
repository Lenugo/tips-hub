<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTipsStore } from '../stores/tips'
import { useUserStore } from '../stores/user'
import TipForm from '../components/TipForm.vue'

const route = useRoute()
const router = useRouter()
const tipsStore = useTipsStore()
const userStore = useUserStore()

const tipId = computed(() => route.params.id as string)
const tip = computed(() => tipsStore.getTipById(tipId.value))
const isLoading = ref(true)

const handleSubmit = (formData: { title: string; content: string; category: string[] }) => {
  if (!tip.value) return
  
  tipsStore.updateTip(tipId.value, {
    title: formData.title,
    content: formData.content,
    category: formData.category
  })
  
  router.push(`/tip/${tipId.value}`)
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/')
    return
  }
  
  // Check if tip exists and user is the author
  if (tip.value) {
    isLoading.value = false
    
    if (!tip.value.author || tip.value.author._id !== userStore.currentUser?._id) {
      // User is not the author, redirect to home
      router.push('/')
    }
  } else {
    // Tip not found
    router.push('/')
  }
})
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-slate-900 mb-6">Editar consejo</h1>
      
      <div v-if="!isLoading && tip" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <TipForm 
          :initialData="tip"
          :categories="tipsStore.categories"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
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
