<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  mode: 'login' | 'register'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login', userData: any): void
  (e: 'register', userData: any): void
  (e: 'modeChange', newMode: 'login' | 'register'): void
}>()

const currentMode = ref(props.mode)
const { t } = useI18n()

const userStore = useUserStore()
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = computed(() => userStore.isLoading)
const error = computed(() => userStore.error)

// Toggle between login and register modes
const toggleMode = () => {
  userStore.error = ''
  
  form.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  
  const newMode = currentMode.value === 'login' ? 'register' : 'login'
  currentMode.value = newMode
  
  // Notify parent component
  emit('modeChange', newMode)
}

const handleSubmit = async () => {
  if (currentMode.value === 'login') {
    if (!form.value.email || !form.value.password) {
      userStore.error = 'Por favor completa todos los campos'
      return
    }

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.value.email) === false) {
      userStore.error = 'El email no es válido'
      return
    }

    if (form.value.password.length < 6) {
      userStore.error = 'La contraseña debe tener al menos 6 caracteres'
      return
    }

  } else {
    if (!form.value.username || !form.value.email || !form.value.password || !form.value.confirmPassword) {
      userStore.error = 'Por favor completa todos los campos'
      return
    }

    if (form.value.username.length < 3) {
      userStore.error = 'El nombre de usuario debe tener al menos 3 caracteres'
      return
    }

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.value.email) === false) {
      userStore.error = 'El email no es válido'
      return
    }

    if (form.value.password.length < 6) {
      userStore.error = 'La contraseña debe tener al menos 6 caracteres'
      return
    }

    if (form.value.password !== form.value.confirmPassword) {
      userStore.error = 'Las contraseñas no coinciden'
      return
    }
  }
  
  try {
    let success = false
    
    if (currentMode.value === 'login') {
      success = await userStore.login({
        email: form.value.email,
        password: form.value.password
      })
      
      if (success) {
        await userStore.checkAuth()
        emit('close')
      }
    } else {
      success = await userStore.register({
        email: form.value.email,
        username: form.value.username,
        password: form.value.password
      })
      
      if (success) {
        // await userStore.checkAuth()
        emit('close')
      }
    }
  } catch (err: any) {
    // Error handling is now managed by the store
  }
}

const handleClose = () => {
  userStore.error = ''
  emit('close')
}

const title = computed(() => {
  return currentMode.value === 'login' ? `${t('auth.login')}` : `${t('auth.register')}`
})

const buttonText = computed(() => {
  return currentMode.value === 'login' ? `${t('auth.loginButton')}` : `${t('auth.registerButton')}`
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30" @click.self="handleClose">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-auto animate-fadeIn" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
        <button 
          @click="handleClose"
          class="text-slate-400 hover:text-slate-500 focus:outline-none hover:cursor-pointer "
        >
          ✕
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {{ error }}
        </div>
        
        <div v-if="currentMode === 'register'">
          <label for="username" class="block text-sm font-medium text-slate-700 mb-1">
            {{ t('auth.username') }}
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="usuario123"
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">
            {{ t('auth.email') }}
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="usuario@ejemplo.com"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">
            {{ t('auth.password') }}
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="••••••••"
          />
        </div>
        
        <div v-if="currentMode === 'register'">
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1">
            {{ t('auth.confirmPassword') }}
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="••••••••"
          />
        </div>
        
        <div class="text-sm flex">
          <p class="text-slate-500">
            {{ currentMode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin') }}        
          </p>
          <button 
              type="button"
              class="text-teal-500 hover:text-teal-600 font-medium ml-1 hover:cursor-pointer"
              @click="toggleMode"
            >
              {{ currentMode === 'login' ? t('auth.register') : t('auth.login') }}
            </button>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none hover:cursor-pointer"
            :disabled="loading"
          >
            {{ t('form.cancel') }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none flex items-center hover:cursor-pointer"
            :disabled="loading"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ buttonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
