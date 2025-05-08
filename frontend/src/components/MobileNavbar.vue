<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

const navItems = [
  { name: 'Inicio', path: '/', icon: '🏠' },
  { name: 'Crear', path: '/create', icon: '✨', requiresAuth: true },
  { name: 'Perfil', path: '/profile', icon: '👤', requiresAuth: true }
];

const isActive = (path: string) => {
  return route.path === path;
};

const navigate = (path: string, requiresAuth: boolean = false) => {
  if (requiresAuth && !isLoggedIn.value) {
    // If authentication is required but user is not logged in
    // Here you might want to show a login prompt/modal
    router.push('/');
  } else {
    router.push(path);
  }
};
</script>

<template>
  <div>
    <nav class="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-30">
      <div class="grid grid-cols-3 h-16">
        <template v-for="item in navItems" :key="item.name">
          <button 
            v-if="!item.requiresAuth || isLoggedIn"
            @click="navigate(item.path, item.requiresAuth)"
            class="flex flex-col items-center justify-center"
            :class="{ 'text-teal-600 font-medium': isActive(item.path), 'text-slate-500': !isActive(item.path) }"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span class="text-xs mt-1">{{ item.name }}</span>
          </button>
          <button 
            v-else-if="item.path === '/create'"
            @click="navigate('/')"
            class="flex flex-col items-center justify-center text-slate-500"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span class="text-xs mt-1">{{ item.name }}</span>
          </button>
        </template>
      </div>
    </nav>
    
    <!-- Add padding to ensure content isn't hidden behind the navbar on mobile -->
    <div class="h-16 md:h-0 w-full"></div>
  </div>
</template>