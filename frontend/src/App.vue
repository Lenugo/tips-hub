<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TheNavbar from './components/TheNavbar.vue';
import MobileNavbar from './components/MobileNavbar.vue';
import { useTipsStore } from './stores/tips';
import { useUserStore } from './stores/user';

const tipsStore = useTipsStore();
const userStore = useUserStore();
const route = useRoute();
const isLoading = ref(true);

onMounted(async () => {
  try {
    await Promise.all([
      tipsStore.getAllTips(), // Cambiado de initializeTips a getAllTips
      userStore.checkAuth() // Use checkAuth to verify authentication
    ]);
  } catch (error) {
    console.error('Failed to initialize app:', error);
  } finally {
    // Hide loading indicator when initialization is complete
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Global loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <p class="text-teal-600 font-medium">Cargando...</p>
      </div>
    </div>

    <TheNavbar />
    
    <main class="flex-grow px-4 md:px-36">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <MobileNavbar />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
