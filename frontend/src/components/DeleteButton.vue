<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTipsStore } from '../stores/tips';

const props = defineProps<{
  tipId: string;
}>();

const router = useRouter();
const tipsStore = useTipsStore();
const isDeleting = ref(false);
const error = ref('');

const handleDelete = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar este consejo? Esta acción no se puede deshacer.')) {
    return;
  }
  
  isDeleting.value = true;
  error.value = '';
  
  try {
    const result = await tipsStore.deleteTip(props.tipId);
    if (result) {
      router.push('/');
    } else {
      error.value = 'Error al eliminar el consejo. Inténtalo de nuevo.';
    }
  } catch (err) {
    console.error('Error al eliminar el tip:', err);
    error.value = 'Error al eliminar el consejo. Inténtalo de nuevo.';
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div>
    <button 
      @click="handleDelete"
      class="btn bg-red-300 hover:bg-red-400 text-white hover:cursor-pointer"
      :class="{ 'opacity-50 cursor-not-allowed': isDeleting }"
      :disabled="isDeleting"
    >
      <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span v-if="isDeleting">Eliminando...</span>
      <span v-else>Eliminar consejo</span>
    </button>
    
    <div v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>