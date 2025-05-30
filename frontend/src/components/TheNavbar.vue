<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import AuthModal from './modals/AuthModal.vue'

const userStore = useUserStore()
const router = useRouter()
const isModalOpen = ref(false)
const modalMode = ref<'login' | 'register'>('login')

const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.currentUser)

const openLoginModal = () => {
  modalMode.value = 'login'
  isModalOpen.value = true
}

const openRegisterModal = () => {
  modalMode.value = 'register'
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const goToCreateTip = () => {
  if (isLoggedIn.value) {
    router.push('/create')
  } else {
    openLoginModal()
  }
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div>
    <header class="bg-neutral-50 shadow-sm sticky top-0 z-30">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold text-teal-600 flex items-center">
          <span class="mr-2">✨</span>
          <span>Tips Hub</span>
        </router-link>
        
        <nav class="hidden md:flex items-center space-x-6">
          <button v-if="isLoggedIn" @click="goToCreateTip" class="px-4 py-2 rounded-full bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors border border-teal-200 flex items-center hover:cursor-pointer">
            <span class="mr-1 text-lg">+</span> Nuevo Consejo
          </button>
          
          <div v-if="isLoggedIn" class="relative">
            <button 
              @click="goToProfile" 
              class="flex items-center text-slate-700 hover:text-teal-600"
            >
              <div class="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium hover:cursor-pointer">
                {{ user?.userName?.charAt(0) }}
              </div>
            </button>          
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <button 
              @click="openLoginModal" 
              class="text-slate-700 hover:text-teal-600 transition-colors hover:cursor-pointer"
            >
              Iniciar sesión
            </button>
            <button 
              @click="openRegisterModal" 
              class="px-4 py-1.5 rounded-full border border-teal-200 text-teal-600 hover:bg-teal-50 transition-colors hover:cursor-pointer"
            >
              Registrarse
            </button>
          </div>
        </nav>
      </div>
    </header>
    
    <AuthModal 
      v-if="isModalOpen" 
      :mode="modalMode"
      @close="closeModal" 
    />
  </div>
</template>
