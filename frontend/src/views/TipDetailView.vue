<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTipsStore, type ITipResponse } from '../stores/tips'
import { useUserStore } from '../stores/user'
import AuthModal from '../components/modals/AuthModal.vue'
import TipCard from '../components/TipCard.vue'
import DeleteButton from '../components/DeleteButton.vue'

const route = useRoute()
const router = useRouter()
const tipsStore = useTipsStore()
const userStore = useUserStore()

const tipId = computed(() => route.params.id as string)
const isLoading = computed(() => tipsStore.isLoading)
const isLoginModalOpen = ref(false)

const fetchTip = async () => {
  const result = await tipsStore.getTipById(tipId.value)
  return result
}

const tip = computed(() => tipsStore.currentTip) 

const isUserAuthor = computed(() => {
  if (!userStore.isLoggedIn || !tip.value) return false
  return tip.value.data.author._id === userStore.currentUser?.id
})

const handleLike = (id: string) => {
  if (!userStore.isLoggedIn) {
    isLoginModalOpen.value = true
    return
  }
  tipsStore.likeTip(id)
}

const goToEdit = () => {
  router.push(`/edit/${tipId.value}`)
}

const goHome = () => {
  router.push('/')
}

const closeLoginModal = () => {
  isLoginModalOpen.value = false
}

onMounted(async () => {
  const result = await fetchTip()
  if (!result) {
    goHome()
  }
})
watch(tipId, fetchTip)
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <!-- Back button -->
    <button 
      @click="goHome" 
      class="flex items-center text-slate-600 hover:text-slate-900 mb-4 hover:cursor-pointer"
    >
      <span class="mr-1">←</span>
      <span>Volver</span>
    </button>
    
    <div v-if="tip && !isLoading">
      <div class="max-w-3xl mx-auto">

        <!-- Categories -->
        <div v-if="tip.data.categories" class="mb-4 flex flex-wrap gap-2">
          <span
            v-for="cat in tip.data.categories" 
            :key="cat" 
            class="px-3 py-1.5 rounded-full text-sm bg-teal-100 text-teal-700 font-medium"
          >
            {{ cat }}
          </span>
        </div>
        
        <TipCard :tip="tip.data" :detailed="true" @like="handleLike" />
        
        <div v-if="isUserAuthor" class="mt-4 flex justify-end space-x-4">
          <DeleteButton :tipId="tipId" />
          <button 
            @click="goToEdit"
            class="btn btn-secondary"
          >
            Editar consejo
          </button>
        </div>
        
      </div>
    </div>
    
    <!-- Load state -->
    <div v-else class="flex justify-center items-center h-64">
      <div class="animate-pulse flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-teal-400"></div>
        <div class="w-3 h-3 rounded-full bg-teal-500"></div>
        <div class="w-3 h-3 rounded-full bg-teal-600"></div>
      </div>
    </div>
    
    <!-- Auth Modal -->
    <AuthModal
      v-if="isLoginModalOpen" 
      mode="login"
      @close="closeLoginModal" 
    />
  </div>
</template>