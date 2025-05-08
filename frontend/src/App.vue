<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TheNavbar from './components/TheNavbar.vue';
import MobileNavbar from './components/MobileNavbar.vue';
import { useTipsStore } from './stores/tips';
import { useUserStore } from './stores/user';

const tipsStore = useTipsStore();
const userStore = useUserStore();
const route = useRoute();

onMounted(() => {
  // Initialize app data
  tipsStore.initializeTips();
  userStore.initUser();
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
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
