<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import LoginModal from './modals/LoginModal.vue';

const userStore = useUserStore();
const router = useRouter();
const isLoginModalOpen = ref(false);

const isLoggedIn = computed(() => userStore.isLoggedIn);
const user = computed(() => userStore.currentUser);

const openLoginModal = () => {
  isLoginModalOpen.value = true;
};

const closeLoginModal = () => {
  isLoginModalOpen.value = false;
};

const handleLogin = () => {
  userStore.login();
  closeLoginModal();
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

const goToCreateTip = () => {
  if (isLoggedIn.value) {
    router.push('/create');
  } else {
    openLoginModal();
  }
};

const goToProfile = () => {
  router.push('/profile');
};
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-30">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold text-primary-600 flex items-center">
        <span class="mr-2">✨</span>
        <span>Tips Hub</span>
      </router-link>
      
      <nav class="hidden md:flex items-center space-x-6">
        <router-link to="/" class="text-gray-700 hover:text-primary-600 transition-colors">
          Inicio
        </router-link>
        
        <button @click="goToCreateTip" class="btn btn-primary">
          <span class="mr-1">+</span> Nuevo Consejo
        </button>
        
        <div v-if="isLoggedIn" class="relative">
          <button 
            @click="goToProfile" 
            class="flex items-center text-gray-700 hover:text-primary-600"
          >
            <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
              {{ user?.username.charAt(0) }}
            </div>
            <span class="ml-2">{{ user?.username }}</span>
          </button>
          
          <button 
            @click="handleLogout" 
            class="ml-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
        
        <button 
          v-else 
          @click="openLoginModal" 
          class="text-gray-700 hover:text-primary-600 transition-colors"
        >
          Iniciar sesión
        </button>
      </nav>
    </div>
  </header>
  
  <LoginModal 
    v-if="isLoginModalOpen" 
    @close="closeLoginModal" 
    @login="handleLogin"
  />
</template>
