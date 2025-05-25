<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Tip } from '../types';

const props = defineProps<{
  initialData?: Partial<Tip>;
  categories?: string[];
}>();

const emit = defineEmits<{
  (e: 'submit', formData: { title: string; content: string; categories: string[] }): void;
  (e: 'cancel'): void;
}>();

// Extraer los datos iniciales del tip
const initialTitle = props.initialData?.title || '';
const initialContent = props.initialData?.content || '';
const initialCategories = Array.isArray(props.initialData?.categories) 
  ? [...props.initialData.categories] 
  : [];

// Estado del formulario
const tipData = ref({
  title: initialTitle,
  content: initialContent,
  categories: [...initialCategories],
});

const errors = ref({
  title: '',
  content: '',
  category: ''
});

const isSubmitting = ref(false);

// Verificar si se han realizado cambios en el formulario
const hasChanges = computed(() => {
  return tipData.value.title !== initialTitle ||
         tipData.value.content !== initialContent ||
         !areArraysEqual(tipData.value.categories, initialCategories);
});

// Función auxiliar para comparar arrays
function areArraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

const availableCategories = computed(() => props.categories || []);

const removeCategory = (category: string) => {
  tipData.value.categories = tipData.value.categories.filter(cat => cat !== category);
};

const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  errors.value = {
    title: '',
    content: '',
    category: ''
  };
  
  // Title validation
  if (!tipData.value.title.trim()) {
    errors.value.title = 'El título es obligatorio';
    isValid = false;
  } else if (tipData.value.title.length < 5) {
    errors.value.title = 'El título debe tener al menos 5 caracteres';
    isValid = false;
  }
  
  // Content validation
  if (!tipData.value.content.trim()) {
    errors.value.content = 'El contenido es obligatorio';
    isValid = false;
  } else if (tipData.value.content.length < 20) {
    errors.value.content = 'El contenido debe tener al menos 20 caracteres';
    isValid = false;
  }
  
  // Category validation
  if (tipData.value.categories.length === 0) {
    errors.value.category = 'Debes seleccionar al menos una categoría';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    isSubmitting.value = true;
    try {
      emit('submit', {
        title: tipData.value.title,
        content: tipData.value.content,
        categories: tipData.value.categories
      });
    } finally {
      isSubmitting.value = false;
    }
  }
}

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div v-if="Object.values(errors).some(error => error)" class="p-3 bg-red-50 text-red-600 rounded-md">
      <p v-if="errors.title">{{ errors.title }}</p>
      <p v-if="errors.content">{{ errors.content }}</p>
      <p v-if="errors.category">{{ errors.category }}</p>
    </div>
    
    <div>
      <label for="title" class="block text-sm font-medium text-slate-700 mb-1">
        Título
      </label>
      <input
        id="title"
        v-model="tipData.title"
        type="text"
        class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        :class="{ 'border-red-500': errors.title }"
        placeholder="Un título claro y conciso"
      />
    </div>
    
    <div>
      <label for="content" class="block text-sm font-medium text-slate-700 mb-1">
        Contenido
      </label>
      <textarea
        id="content"
        v-model="tipData.content"
        rows="6"
        class="w-full px-3 py-2 border resize-none border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        :class="{ 'border-red-500': errors.content }"
        placeholder="Comparte tu consejo detalladamente..."
      ></textarea>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Categorías</label>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="category in availableCategories" :key="category" 
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
    
    <div class="flex justify-end space-x-4 pt-4 border-t border-slate-200">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring focus:ring-slate-500 focus:ring-offset-2 hover:cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-500 focus:ring-offset-2"
        :class="{ 'opacity-50 cursor-not-allowed': !hasChanges || isSubmitting, 'cursor-pointer': hasChanges && !isSubmitting }"
        :disabled="!hasChanges || isSubmitting"
      >
        <span v-if="isSubmitting">Editando...</span>
        <span v-else>Editar</span>
      </button>
    </div>
  </form>
</template>