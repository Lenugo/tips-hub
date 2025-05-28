<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  show: true
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const bgColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-700'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-700'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700'
    default:
      return 'bg-blue-50 border-blue-200 text-blue-700'
  }
})

const iconColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    default:
      return 'text-blue-500'
  }
})

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    default:
      return 'ℹ'
  }
})
</script>

<template>
  <transition name="toast">
    <div v-if="show" class="fixed top-4 right-4 z-[99] max-w-md w-full shadow-lg rounded-lg overflow-hidden">
      <div :class="['p-4 border flex items-center justify-between', bgColor]">
        <div :class="['flex-shrink-0 mr-3 text-md', iconColor]">
          {{ icon }}
        </div>
        <div class="flex-grow">
          <p class="text-sm font-medium">{{ message }}</p>
        </div>
        <button 
          @click="handleClose" 
          class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 focus:outline-none hover:cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>