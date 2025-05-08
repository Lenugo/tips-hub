<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  mode: 'login' | 'register'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'login'): void
  (e: 'register'): void
}>()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  // In a real app, this would validate and send login/register request
  if (props.mode === 'login') {
    emit('login')
  } else {
    emit('register')
  }
}

const handleClose = () => {
  emit('close')
}

const title = computed(() => {
  return props.mode === 'login' ? 'Iniciar sesión' : 'Registrarse'
})

const buttonText = computed(() => {
  return props.mode === 'login' ? 'Ingresar' : 'Registrarse'
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30" @click.self="handleClose">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-auto animate-fadeIn" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          ✕
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="props.mode === 'register'">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="usuario123"
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="usuario@ejemplo.com"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="••••••••"
          />
        </div>
        
        <div v-if="props.mode === 'register'">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="••••••••"
          />
        </div>
        
        <!-- <p class="text-sm text-gray-500">
          {{ props.mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?' }}
          <button 
            type="button"
            class="text-teal-500 hover:text-teal-600 font-medium ml-1"
            @click="emit(props.mode === 'login' ? 'register' : 'login')"
          >
            {{ props.mode === 'login' ? 'Regístrate' : 'Inicia sesión' }}
          </button>
        </p> -->
        
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
          >
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
