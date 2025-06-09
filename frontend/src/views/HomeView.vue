<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useTipsStore } from '../stores/tips'
import { useUserStore } from '../stores/user'
import { TipCard, CategoryFilter, AuthModal } from '../components'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const tipsStore = useTipsStore()
const userStore = useUserStore()
const router = useRouter()
const isLoading = ref(false)
const currentPage = ref(1)
const limit = ref(10)
const hasMorePages = ref(true)
const isLoginModalOpen = ref(false)

const tips = computed(() => tipsStore.tips)
const categories = computed(() => tipsStore.categories)
const selectedCategory = ref<string | null>(null)

const target = ref(null)

useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isLoading.value && hasMorePages.value) {
      loadMoreTips();
    }
  },
  { threshold: 0.5 }
);

const handleCategorySelect = (category: string | null) => {
  selectedCategory.value = category
  currentPage.value = 1
  hasMorePages.value = true
  tipsStore.clearTips()
  fetchTips()
}

const fetchTips = async () => {
  isLoading.value = true;
  const response = await tipsStore.getAllTips(
    selectedCategory.value || undefined,
    currentPage.value,
    limit.value
  );
  
  if (response && response.pagination) {
    hasMorePages.value = currentPage.value < response.pagination.pages
  } else {
    hasMorePages.value = false
  }
  
  isLoading.value = false
}

const loadMoreTips = async () => {
  if (isLoading.value || !hasMorePages.value) return
  
  currentPage.value++
  await fetchTips()
}

onMounted(async () => {
  isLoading.value = true
  await fetchTips()
  isLoading.value = false
})

const handleLike = async (tipId: string) => {
  if (!userStore.isLoggedIn) {
    isLoginModalOpen.value = true
    return
  }
  await tipsStore.likeTip(tipId)
}

const closeLoginModal = () => {
  isLoginModalOpen.value = false
}

const handleEmptyCreate = () => {
  if (!userStore.isLoggedIn) {
    isLoginModalOpen.value = true
    return
  }
  router.push('/create')
}
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <h1 class="text-2xl font-bold text-slate-900 mb-2">{{ t('home.title') }}</h1>
    <p class="text-slate-600 mb-6">{{ t('home.description') }}</p>
    
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
        <span v-else-if="hasMorePages" class="text-slate-500 text-sm">{{ t('home.loadMore') }}</span>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!isLoading" class="text-center py-12">
      <div v-if="selectedCategory" class="mb-4 text-4xl">🔍</div>
      <h3 class="text-xl font-medium text-slate-800 mb-2">{{ !selectedCategory ? t('home.emptyView') : t('home.noTipsFound') }}</h3>
      <p class="text-slate-600 mb-4">
        {{ !selectedCategory ? t('home.emptyViewDescription') : t('home.noTipsDescription') }}
      </p>
      
      <button
        v-if="selectedCategory !== null"
        @click="handleCategorySelect(null)" 
        class="btn btn-teal hover:cursor-pointer bg-teal-500 text-white"
      >
        {{ t('home.viewAllTips') }}
      </button>
      
      <button 
        v-else
        @click="handleEmptyCreate()" 
        class="btn btn-teal hover:cursor-pointer bg-teal-500 text-white flex items-center justify-center mx-auto"
      >
        <span class="mr-1">+</span> {{ t('profile.createTip') }}
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

    <!-- Auth Modal -->
    <AuthModal
      v-if="isLoginModalOpen" 
      mode="login"
      @close="closeLoginModal" 
    />
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
