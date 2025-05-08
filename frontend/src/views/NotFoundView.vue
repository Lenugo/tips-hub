<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="container mx-auto py-12 px-4 text-center">
    <div class="mb-6 text-6xl">🔍</div>
    <h1 class="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
    <p class="text-gray-600 max-w-md mx-auto mb-8">
      Lo sentimos, la página que estás buscando no existe o ha sido movida.
    </p>
    <button 
      @click="goToHome"
      class="btn btn-primary"
    >
      Volver al inicio
    </button>
  </div>
</template>
