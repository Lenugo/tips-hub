<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useTipsStore } from '../stores/tips'
import TipCard from '../components/TipCard.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import AuthModal from '../components/modals/AuthModal.vue'

const tipsStore = useTipsStore();
const isLoading = ref(false);
const currentPage = ref(1);
const limit = ref(10); // Number of items per page
const hasMorePages = ref(true);

const tips = computed(() => tipsStore.tips);

const categories = computed(() => tipsStore.categories)
const selectedCategory = ref<string | null>(null)

// Reference to the target element for intersection observer
const target = ref(null);

// Set up the intersection observer
useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isLoading.value && hasMorePages.value) {
      loadMoreTips();
    }
  },
  { threshold: 0.5 } // Trigger when element is 50% visible
);

const handleCategorySelect = (category: string | null) => {
  selectedCategory.value = category;
  // Reset pagination when changing category
  currentPage.value = 1;
  hasMorePages.value = true;
  tipsStore.clearTips(); // Clear existing tips
  fetchTips();
}

const fetchTips = async () => {
  isLoading.value = true;
  const response = await tipsStore.getAllTips(
    selectedCategory.value || undefined,
    currentPage.value,
    limit.value
  );
  
  // Check if we've reached the last page
  if (response && response.pagination) {
    hasMorePages.value = currentPage.value < response.pagination.pages;
  } else {
    hasMorePages.value = false;
  }
  
  isLoading.value = false;
}

const loadMoreTips = async () => {
  if (isLoading.value || !hasMorePages.value) return;
  
  currentPage.value++;
  await fetchTips();
}

onMounted(async () => {
  isLoading.value = true;
  await fetchTips();
  isLoading.value = false;
})

const handleLike = async (tipId: string) => {
  await tipsStore.likeTip(tipId);
};
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-2xl font-bold text-slate-900 mb-2">Tips Hub</h1>
    <p class="text-slate-600 mb-6">Descubre y comparte consejos sobre diversos temas</p>
    
    <!-- Categories filter -->
    <CategoryFilter 
      :categories="categories" 
      :selectedCategory="selectedCategory"
      @select="handleCategorySelect"
    />
    
    <!-- Tips feed -->
    <div v-if="tips.length > 0">
      <TransitionGroup name="list" tag="div" class="space-y-4">
        <TipCard 
          v-for="tip in tips" 
          :key="tip.id" 
          :tip="tip" 
          @like="handleLike"
        />
      </TransitionGroup>
      
      <!-- Loading indicator and intersection observer target -->
      <div 
        ref="target" 
        class="flex justify-center items-center py-8"
      >
        <div v-if="isLoading" class="animate-pulse flex space-x-2">
          <div class="w-2 h-2 rounded-full bg-teal-400"></div>
          <div class="w-2 h-2 rounded-full bg-teal-500"></div>
          <div class="w-2 h-2 rounded-full bg-teal-600"></div>
        </div>
        <span v-else-if="hasMorePages" class="text-slate-500 text-sm">Scroll para cargar más</span>
        <!-- <span v-else class="text-slate-500 text-sm">No hay más consejos para mostrar</span> -->
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!isLoading" class="text-center py-12">
      <div class="mb-4 text-4xl">🔍</div>
      <h3 class="text-xl font-medium text-slate-800 mb-2">No se encontraron consejos</h3>
      <p class="text-slate-600 mb-4">
        No hay consejos disponibles para la categoría seleccionada.
      </p>
      <button 
        @click="handleCategorySelect(null)" 
        class="btn btn-teal hover:cursor-pointer bg-teal-500 text-white"
      >
        Ver todos los consejos
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-else class="flex justify-center items-center py-12">
      <div class="animate-pulse flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-teal-400"></div>
        <div class="w-3 h-3 rounded-full bg-teal-500"></div>
        <div class="w-3 h-3 rounded-full bg-teal-600"></div>
      </div>
    </div>
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
