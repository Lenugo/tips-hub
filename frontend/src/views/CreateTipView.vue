<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTipsStore } from '../stores/tips';
import { useUserStore } from '../stores/user';

const router = useRouter();
const tipsStore = useTipsStore();
const userStore = useUserStore();
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref('');

const tipData = ref({
  title: '',
  content: '',
  categories: [],
})

const categories = computed(() => tipsStore.categories);

onMounted(async () => {
  // Check if user is authenticated
  if (!userStore.isLoggedIn) {
    await userStore.checkAuth();
    if (!userStore.isLoggedIn) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }
});

const handleSubmit = async () => {
  if (!tipData.value.title || !tipData.value.content) {
    error.value = 'El título y el contenido son obligatorios';
    return;
  }
  
  isSubmitting.value = true;
  error.value = '';
  
  try {
    const newTip = {
      title: tipData.value.title,
      content: tipData.value.content,
      categories: tipData.value.categories,
    }
    
    const result = await tipsStore.createTip(newTip);
    if (result) {
      router.push('/profile');
    }
  } catch (err) {
    console.error('Error creating tip:', err);
    error.value = 'Error al crear el consejo. Inténtalo de nuevo.';
  } finally {
    isSubmitting.value = false;
  }
}

const removeCategory = (category: string) => {
  tipData.value.categories = tipData.value.categories.filter(cat => cat !== category);
}
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Crear nuevo consejo</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-md">
          {{ error }}
        </div>
        
        <div>
          <label for="title" class="block text-sm font-medium text-slate-700 mb-1">Título</label>
          <input
            id="title"
            v-model="tipData.title"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Escribe un título descriptivo"
            required
          />
        </div>
        
        <div>
          <label for="content" class="block text-sm font-medium text-slate-700 mb-1">Contenido</label>
          <textarea
            id="content"
            v-model="tipData.content"
            rows="6"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            placeholder="Describe tu consejo en detalle"
            required
          ></textarea>
        </div>
        
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Categorías</label>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="category in categories" :key="category" 
              class="flex items-center p-2 rounded-md transition-colors"
              :class="tipData.categories.includes(category) ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50 border border-transparent'">
            <input
              type="checkbox"
              :id="category"
              :value="category"
              v-model="tipData.categories"
              class="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label :for="category" class="ml-2 block text-sm font-medium cursor-pointer select-none" 
                  :class="tipData.categories.includes(category) ? 'text-teal-700' : 'text-slate-700'">
              {{ category }}
            </label>
          </div>
        </div>
        <p class="text-xs text-slate-500 mt-2">Selecciona al menos una categoría para tu consejo</p>
        <div v-if="tipData.categories.length > 0" class="mt-3 flex flex-wrap gap-2">
          <div v-for="selected in tipData.categories" :key="selected" 
              class="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
            {{ selected }}
            <button @click="removeCategory(selected)" type="button" class="ml-1.5 text-teal-700 hover:text-teal-900">
              <span class="sr-only">Remove</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
                
        <div class="flex justify-end space-x-3 pt-4">
          <router-link
            to="/"
            class="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 hover:cursor-pointer"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Guardando...</span>
            <span v-else>Crear consejo</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
