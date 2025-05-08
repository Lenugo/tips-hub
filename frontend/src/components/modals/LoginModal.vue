<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'login'): void;
}>();

const form = ref({
  email: '',
  password: ''
});

const handleSubmit = () => {
  // In a real app, this would validate and send login request
  emit('login');
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" @click.self="handleClose">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-auto animate-fadeIn" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Iniciar sesión</h2>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          ✕
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••••••"
          />
        </div>
        
        <p class="text-sm text-gray-500">
          Para fines de demo, puedes iniciar sesión sin credenciales.
        </p>
        
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
            class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none"
          >
            Ingresar
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
