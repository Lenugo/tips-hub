<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTipsStore } from '../stores/tips';
import { useUserStore } from '../stores/user';
import TipCard from '../components/TipCard.vue';
import LoginModal from '../components/modals/LoginModal.vue';

const route = useRoute();
const router = useRouter();
const tipsStore = useTipsStore();
const userStore = useUserStore();

const tipId = computed(() => route.params.id as string);
const tip = computed(() => tipsStore.getTipById(tipId.value));
const isLoginModalOpen = ref(false);
const isUserAuthor = computed(() => {
  if (!userStore.isLoggedIn || !tip.value?.author) return false;
  return tip.value.author._id === userStore.currentUser?._id;
});

// Handle like button click
const handleLike = (id: string) => {
  if (userStore.isLoggedIn) {
    tipsStore.likeTip(id, userStore.currentUser?._id || '');
  } else {
    isLoginModalOpen.value = true;
  }
};

const goToEdit = () => {
  router.push(`/edit/${tipId.value}`);
};

const goBack = () => {
  router.back();
};

const closeLoginModal = () => {
  isLoginModalOpen.value = false;
};

const handleLogin = () => {
  userStore.login();
  closeLoginModal();
};

onMounted(() => {
  // If tip not found, go back to home
  if (!tip.value) {
    router.push('/');
  }
});
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <!-- Back button -->
    <button 
      @click="goBack" 
      class="flex items-center text-gray-600 hover:text-gray-900 mb-4"
    >
      <span class="mr-1">←</span>
      <span>Volver</span>
    </button>
    
    <div v-if="tip">
      <!-- Detailed tip view -->
      <div class="max-w-3xl mx-auto">
        <TipCard :tip="tip" :detailed="true" @like="handleLike" />
        
        <!-- Edit button for author -->
        <div v-if="isUserAuthor" class="mt-4 flex justify-end">
          <button 
            @click="goToEdit"
            class="btn btn-secondary"
          >
            Editar consejo
          </button>
        </div>
        
        <!-- Related tips could go here -->
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-else class="flex justify-center items-center h-64">
      <div class="animate-pulse flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-primary-400"></div>
        <div class="w-3 h-3 rounded-full bg-primary-500"></div>
        <div class="w-3 h-3 rounded-full bg-primary-600"></div>
      </div>
    </div>
    
    <!-- Login modal -->
    <LoginModal 
      v-if="isLoginModalOpen" 
      @close="closeLoginModal" 
      @login="handleLogin"
    />
  </div>
</template>