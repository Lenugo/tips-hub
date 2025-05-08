<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Tip } from '../types';

interface FormData {
  title: string;
  content: string;
  category: string;
}

const props = defineProps<{
  initialData?: Partial<Tip>;
  categories?: string[];
}>();

const emit = defineEmits<{
  (e: 'submit', formData: { title: string; content: string; category: string[] }): void;
  (e: 'cancel'): void;
}>();

const form = ref<FormData>({
  title: props.initialData?.title || '',
  content: props.initialData?.content || '',
  category: '',
});

const selectedCategories = ref<string[]>(props.initialData?.category || []);
const categoryInput = ref<HTMLInputElement | null>(null);
const errors = ref({
  title: '',
  content: '',
  category: ''
});

const availableCategories = computed(() => props.categories || []);

const addCategory = () => {
  const category = form.value.category.trim().toLowerCase();
  
  if (!category) {
    errors.value.category = 'Por favor ingresa una categoría';
    return;
  }
  
  if (selectedCategories.value.includes(category)) {
    form.value.category = '';
    return;
  }
  
  selectedCategories.value.push(category);
  form.value.category = '';
  errors.value.category = '';
  
  if (categoryInput.value) {
    categoryInput.value.focus();
  }
};

const removeCategory = (category: string) => {
  selectedCategories.value = selectedCategories.value.filter(c => c !== category);
};

const selectExistingCategory = (category: string) => {
  if (!selectedCategories.value.includes(category)) {
    selectedCategories.value.push(category);
  }
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
  if (!form.value.title.trim()) {
    errors.value.title = 'El título es obligatorio';
    isValid = false;
  } else if (form.value.title.length < 5) {
    errors.value.title = 'El título debe tener al menos 5 caracteres';
    isValid = false;
  }
  
  // Content validation
  if (!form.value.content.trim()) {
    errors.value.content = 'El contenido es obligatorio';
    isValid = false;
  } else if (form.value.content.length < 20) {
    errors.value.content = 'El contenido debe tener al menos 20 caracteres';
    isValid = false;
  }
  
  // Category validation
  if (selectedCategories.value.length === 0) {
    errors.value.category = 'Debes seleccionar al menos una categoría';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      title: form.value.title,
      content: form.value.content,
      category: selectedCategories.value
    });
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-slate-700 mb-1">
        Título
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500"
        :class="{ 'border-red-500': errors.title }"
        placeholder="Un título claro y conciso"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
    </div>
    
    <div>
      <label for="content" class="block text-sm font-medium text-slate-700 mb-1">
        Contenido
      </label>
      <textarea
        id="content"
        v-model="form.content"
        rows="6"
        class="w-full px-3 py-2 border resize-none border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500"
        :class="{ 'border-red-500': errors.content }"
        placeholder="Comparte tu consejo detalladamente..."
      ></textarea>
      <p v-if="errors.content" class="mt-1 text-sm text-red-500">{{ errors.content }}</p>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">
        Categorías existentes
      </label>
      <div class="flex flex-wrap gap-2 mb-3">
        <button 
          v-for="category in availableCategories"
          :key="category"
          type="button"
          @click="selectExistingCategory(category)"
          class="px-3 py-1 text-sm rounded-full bg-lime-100 text-slate-700 hover:bg-lime-200 hover:cursor-pointer"
          :class="{ 'bg-teal-100 text-teal-700': selectedCategories.includes(category) }"
        >
          {{ category }}
        </button>
      </div>
      
      <label for="category" class="block text-sm font-medium text-slate-700 mb-1">
        Añadir categoría
      </label>
      <div class="flex">
        <input
          id="category"
          ref="categoryInput"
          v-model="form.category"
          type="text"
          class="flex-grow px-3 py-2 border border-slate-300 rounded-l-md shadow-sm focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-500"
          :class="{ 'border-red-500': errors.category }"
          placeholder="Nueva categoría..."
          @keyup.enter="addCategory"
        />
        <button
          type="button"
          @click="addCategory"
          class="px-4 py-2 bg-teal-500 text-white rounded-r-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-500 focus:ring-offset-2"
        >
          Añadir
        </button>
      </div>
      <p v-if="errors.category" class="mt-1 text-sm text-red-500">{{ errors.category }}</p>
    </div>
    
    <div v-if="selectedCategories.length > 0" class="mt-2">
      <p class="text-sm text-slate-700 mb-2">Categorías seleccionadas:</p>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="category in selectedCategories" 
          :key="category"
          class="flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-700"
        >
          <span>{{ category }}</span>
          <button
            type="button"
            @click="removeCategory(category)"
            class="ml-1 text-teal-700 hover:text-teal-900 focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end space-x-4 pt-4 border-t border-slate-200">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring focus:ring-slate-500 focus:ring-offset-2"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-500 focus:ring-offset-2"
      >
        Guardar
      </button>
    </div>
  </form>
</template>