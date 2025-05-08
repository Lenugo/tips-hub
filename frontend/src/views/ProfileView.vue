<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTipsStore } from '../stores/tips';
import { useUserStore } from '../stores/user';
import TipCard from '../components/TipCard.vue';

const router = useRouter();
const tipsStore = useTipsStore();
const userStore = useUserStore();

const userTips = computed(() => {
  if (!userStore.currentUser) return [];
  
  return tipsStore.tips.filter(tip => 
    tip.author && tip.author._id === userStore.currentUser?._id
  );
});

const likedTips = computed(() => {
  if (!userStore.currentUser) return [];
  
  return tipsStore.tips.filter(tip => 
    tip.likedBy.includes(userStore.currentUser?._id || '')
  );
});

const handleLike = (tipId: string) => {
  if (userStore.isLoggedIn) {
    tipsStore.likeTip(tipId, userStore.currentUser?._id || '');
  }
};

const goToCreateTip = () => {
  router.push('/create');
};

const goToEditTip = (tipId: string) => {
  router.push(`/edit/${tipId}`);
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/');
  }
});
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div v-if="userStore.currentUser">
      <!-- Profile header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div class="flex items-center space-x-4">
          <div class="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold">
            {{ userStore.currentUser.username.charAt(0) }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ userStore.currentUser.username }}</h1>
            <p class="text-gray-500">{{ userStore.currentUser.email }}</p>
          </div>
        </div>
        
        <div class="flex justify-end mt-4">
          <button @click="handleLogout" class="btn btn-secondary">
            Cerrar sesión
          </button>
        </div>
      </div>
      
      <!-- Content tabs -->
      <div class="mb-6">
        <div class="flex border-b border-gray-200">
          <button 
            class="px-4 py-2 border-b-2 border-primary-500 text-primary-600 font-medium"
          >
            Mis consejos
          </button>
          <button 
            class="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Consejos que me gustan
          </button>
        </div>
      </div>
      
      <!-- User's tips -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Mis consejos</h2>
          <button 
            @click="goToCreateTip"
            class="btn btn-primary"
          >
            <span class="mr-1">+</span> Nuevo consejo
          </button>
        </div>
        
        <div v-if="userTips.length > 0" class="space-y-4">
          <div v-for="tip in userTips" :key="tip.id" class="relative">
            <TipCard :tip="tip" @like="handleLike" />
            <button 
              @click="goToEditTip(tip.id)"
              class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              ✏️
            </button>
          </div>
        </div>
        
        <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
          <div class="text-4xl mb-2">📝</div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">No has creado consejos</h3>
          <p class="text-gray-600 mb-4">
            Comparte tu conocimiento y experiencia con la comunidad.
          </p>
          <button 
            @click="goToCreateTip"
            class="btn btn-primary"
          >
            Crear mi primer consejo
          </button>
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-else class="flex justify-center items-center h-64">
      <div class="animate-pulse flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-primary-400"></div>
        <div class="w-3 h-3 rounded-full bg-primary-500"></div>
        <div class="w-3 h-3 rounded-full bg-primary-600"></div>
      </div>
    </div>
  </div>
</template>
