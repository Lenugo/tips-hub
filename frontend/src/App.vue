<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { TheNavbar, MobileNavbar, ToastNotification } from './components'
import { useTipsStore } from './store/tips'
import { useUserStore } from './store/user'
import { NotificationType } from './types'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLoadGuard } from './composables/useLoadGuard'

const tipsStore = useTipsStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const showBootOverlay = computed(() =>
  route.name === 'home' &&
  !tipsStore.hasLoadedOnce &&
  tipsStore.tips.length === 0 &&
  (tipsStore.isLoading || !!tipsStore.loadError)
)

const scrollMemory: Record<string, number> = {}
const mainScroll = () => document.querySelector('main')

router.beforeEach((to, from) => {
  const main = mainScroll()
  if (main) scrollMemory[from.path] = main.scrollTop
})

const restoreScroll = () => {
  const main = mainScroll()
  if (main) main.scrollTop = scrollMemory[route.path] ?? 0
}

const { phase } = useLoadGuard(
  () => showBootOverlay.value && tipsStore.isLoading,
  () => (showBootOverlay.value ? tipsStore.loadError : null)
)

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
  <div class="h-dvh flex flex-col overflow-hidden">
    <!-- Global loading overlay -->
    <div
      v-if="showBootOverlay"
      class="fixed inset-0 bg-white z-50 flex items-center justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div class="flex flex-col items-center text-center max-w-sm">
        <template v-if="phase !== 'failed'">
          <div class="animate-pulse flex space-x-2 mb-4">
            <div class="w-3 h-3 rounded-full bg-teal-400"></div>
            <div class="w-3 h-3 rounded-full bg-teal-500"></div>
            <div class="w-3 h-3 rounded-full bg-teal-600"></div>
          </div>
          <p class="text-teal-600 font-medium">
            {{ phase === 'slow' ? t('common.stillLoading') : t('common.loading') }}
          </p>
        </template>
        <template v-else>
          <h2 class="text-xl font-semibold text-slate-800 mb-2">{{ t('common.loadFailedTitle') }}</h2>
          <p class="text-slate-600 mb-6">{{ t('common.loadFailedDescription') }}</p>
          <button
            type="button"
            class="btn btn-teal hover:cursor-pointer bg-teal-500 text-white px-4 py-2"
            @click="tipsStore.retryList"
          >
            {{ t('common.retry') }}
          </button>
        </template>
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

    <main class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-36">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in" @after-enter="restoreScroll">
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
