<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const { t } = useI18n()

const navItems = [
  { name: `${t('mobileNav.home')}`, path: '/', icon: '🏠' },
  { name: `'${t('mobileNav.create')}`, path: '/create', icon: '✨', requiresAuth: true },
  { name: `${t('mobileNav.profile')}`, path: '/profile', icon: '👤', requiresAuth: true }
]

const isActive = (path: string) => {
  return route.path === path
}

const navigate = (path: string, requiresAuth: boolean = false) => {
  if (requiresAuth && !isLoggedIn.value) {
    router.push('/')
  } else {
    router.push(path)
  }
}
</script>

<template>
  <div>
    <nav class="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-30">
      <div class="grid grid-cols-3 h-16 justify-items-center">
        <div v-for="item in navItems" :key="item.name">
          <button 
            v-if="!item.requiresAuth || isLoggedIn"
            @click="navigate(item.path, item.requiresAuth)"
            class="flex flex-col items-center justify-center"
            :class="{ 'text-teal-600 font-medium': isActive(item.path), 'text-slate-500': !isActive(item.path) }"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span class="text-xs mt-1">{{ item.name }}</span>
          </button>
        </div>
      </div>
    </nav>
    <!-- Add padding to ensure content isn't hidden behind the navbar on mobile -->
    <div class="h-16 md:h-0 w-full"></div>
  </div>
</template>