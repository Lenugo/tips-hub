<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useTipsStore } from '../stores/tips';
import { useUserStore } from '../stores/user';
import TipCard from '../components/TipCard.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import LoginModal from '../components/modals/LoginModal.vue';

const tipsStore = useTipsStore();
const userStore = useUserStore();

const isLoginModalOpen = ref(false);
const target = ref(null);
const displayCount = ref(3);
const isLoading = ref(false);

// Mock infinite scroll data loading
const loadMoreTips = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  
  // Simulate a network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Increment the display count (simulating fetching more data)
  displayCount.value += 2;
  isLoading.value = false;
};

// Setup intersection observer for infinite scrolling
const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadMoreTips();
    }
  }
);

const categories = computed(() => tipsStore.categories);
const selectedCategory = computed(() => tipsStore.selectedCategory);

// Filtered and limited tips for display
const displayedTips = computed(() => {
  return tipsStore.filteredTips.slice(0, displayCount.value);
});

// Handle category selection
const handleCategorySelect = (category: string | null) => {
  tipsStore.setCategory(category);
  // Reset display count when changing categories
  displayCount.value = 3;
};

// Handle like button click
const handleLike = (tipId: string) => {
  if (userStore.isLoggedIn) {
    tipsStore.likeTip(tipId, userStore.currentUser?._id || '');
  } else {
    isLoginModalOpen.value = true;
  }
};

const closeLoginModal = () => {
  isLoginModalOpen.value = false;
};

const handleLogin = () => {
  userStore.login();
  closeLoginModal();
};

onMounted(() => {
  // Initialize tips on component mount if needed
  if (tipsStore.tips.length === 0) {
    tipsStore.initializeTips();
  }
});
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Tips Hub</h1>
    <p class="text-gray-600 mb-6">Descubre y comparte consejos sobre diversos temas</p>
    
    <!-- Categories filter -->
    <CategoryFilter 
      :categories="categories" 
      :selectedCategory="selectedCategory"
      @select="handleCategorySelect"
    />
    
    <!-- Tips feed -->
    <div v-if="displayedTips.length > 0">
      <TransitionGroup name="list" tag="div" class="space-y-4">
        <TipCard 
          v-for="tip in displayedTips" 
          :key="tip.id" 
          :tip="tip" 
          @like="handleLike"
        />
      </TransitionGroup>
      
      <!-- Loading indicator and intersection observer target -->
      <div 
        ref="target" 
        class="flex justify-center items-center py-8"
        v-if="displayedTips.length < tipsStore.filteredTips.length"
      >
        <div v-if="isLoading" class="animate-pulse flex space-x-2">
          <div class="w-2 h-2 rounded-full bg-primary-400"></div>
          <div class="w-2 h-2 rounded-full bg-primary-500"></div>
          <div class="w-2 h-2 rounded-full bg-primary-600"></div>
        </div>
        <span v-else class="text-gray-500 text-sm">Scroll para cargar más</span>
      </div>
      
      <!-- End of feed message -->
      <div 
        v-else-if="displayedTips.length > 0" 
        class="text-center py-8 text-gray-500"
      >
        No hay más consejos por mostrar
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="mb-4 text-4xl">🔍</div>
      <h3 class="text-xl font-medium text-gray-800 mb-2">No se encontraron consejos</h3>
      <p class="text-gray-600 mb-4">
        No hay consejos disponibles para la categoría seleccionada.
      </p>
      <button 
        @click="handleCategorySelect(null)" 
        class="btn btn-primary"
      >
        Ver todos los consejos
      </button>
    </div>
    
    <!-- Login modal -->
    <LoginModal 
      v-if="isLoginModalOpen" 
      @close="closeLoginModal" 
      @login="handleLogin"
    />
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
