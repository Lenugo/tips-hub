<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { TheNavbar, MobileNavbar, ToastNotification } from './components'
import { useTipsStore } from './stores/tips'
import { useUserStore } from './stores/user'

const tipsStore = useTipsStore()
const userStore = useUserStore()
const isLoading = ref(true)

enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}

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

watch(() => tipsStore.error, (newTipsError) => {
  if (newTipsError) {
    showNotification(newTipsError, NotificationType.Error)
  }
})

watch(() => userStore.error, (newUserError) => {
  if (newUserError) {
    showNotification(newUserError, NotificationType.Error)
  }
})

onMounted(async () => {
  try {
    const [tipsResult, authResult] = await Promise.allSettled([
      tipsStore.getAllTips(),
      userStore.checkAuth()
    ])

    if (tipsResult.status === 'rejected') {
      showNotification('Failed to fetch tips. Please try again or later', NotificationType.Error)
    }

    if (authResult.status === 'rejected') {
      showNotification('Failed to authenticate. Please try again or later', NotificationType.Error)
    }

  } catch (error) {
    showNotification('An unexpected error occurred. Please try again or later', NotificationType.Error)
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Global loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
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
