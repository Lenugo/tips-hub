<script setup lang="ts">
import { ref, watch } from 'vue'
import { TheNavbar, MobileNavbar, ToastNotification } from './components'
import { useTipsStore } from './store/tips'
import { useUserStore } from './store/user'
import { NotificationType } from './types'
import { useRoute } from 'vue-router'

const tipsStore = useTipsStore()
const userStore = useUserStore()
const route = useRoute()

const notification = ref({
  show: false,
  message: '',
  type: NotificationType.Info
})

const showNotification = (message: string, type: NotificationType) => {
  notification.value = {
    show: true,
    message,
    type
  }

  setTimeout(() => {
    handleClose()
  }, 5000)
}

const handleClose = () => {
  notification.value = {
    show: false,
    message: '',
    type: notification.value.type
  }
}

watch(() => (userStore.notificationValues), (newNotification) => {
  if (!newNotification.type) return
  showNotification(userStore.notificationValues.message!, userStore.notificationValues.type as NotificationType)
})

watch(() => (tipsStore.notificationValues), (newNotification) => {
  if (!newNotification.type) return
  showNotification(tipsStore.notificationValues.message!, tipsStore.notificationValues.type as NotificationType)
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Global loading overlay -->
    <div v-if="tipsStore.isLoading && route.name === 'home'" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <p class="text-teal-600 font-medium">Loading...</p>
      </div>
    </div>

    <!-- Toast notification -->
    <ToastNotification
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="handleClose"
    />

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
