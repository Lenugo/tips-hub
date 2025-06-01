<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useTipsStore } from '../stores/tips'
import { useRouter } from 'vue-router'
import { TipCard } from '../components/'
import { useI18n } from 'vue-i18n'
import type { Tip, User } from '../types'

const userStore = useUserStore()
const tipsStore = useTipsStore()
const router = useRouter()
const isLoading = ref(true)
const userData = ref<User | null>(null)
const { t, locale } = useI18n()

const userDataTips  = computed<Tip[]>(() => tipsStore.userTips)

// Format the date for display
const formattedDate = computed(() => {
  if (!userData.value?.createdAt) return ''
  const date = new Date(userData.value.createdAt)
  const dateTimeLocale = locale.value === 'es' ? 'es-ES' : 'en-EN'

  return new Intl.DateTimeFormat(dateTimeLocale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date)
})

onMounted(async () => {
  isLoading.value = true
  
  // Ensure user is authenticated
  if (!userStore.isLoggedIn) {
    await userStore.checkAuth()
  }
  
  // Get user data from API
  if (userStore.isLoggedIn) {
    try {
      const response: User = await userStore.getUserInfo()
      userData.value = response
      
      await tipsStore.getUserTips()
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
  
  isLoading.value = false
})

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}

const handleLike = (tipId: string) => {
  if (userStore.isLoggedIn) {
    tipsStore.likeTip(tipId)
  }
}

const goToCreateTip = () => {
  router.push('/create')
}
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div v-if="userStore.currentUser">
      <!-- Profile header -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-teal-500 to-teal-400 h-32"></div>
        <div class="px-6 pb-6 relative">
          <div class="flex flex-col md:flex-row items-start md:items-center">
            <!-- Avatar -->
            <div class="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-3xl -mt-12 border-4 border-white shadow-md">
              {{ userData?.userName?.charAt(0) || 'U' }}
            </div>
            
            <div class="mt-4 md:mt-0 md:ml-6 flex-grow">
              <h1 class="text-2xl font-bold text-slate-800">{{ userData?.userName }}</h1>
              <p class="text-slate-500">{{ userData?.email }}</p>
              <p class="text-sm text-slate-400 mt-1">{{ t('profile.memberSince') }} {{ formattedDate }}</p>
            </div>
            
            <button 
              @click="handleLogout" 
              class="mt-4 md:mt-0 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors text-sm font-medium flex items-center hover:cursor-pointer"
            >
              <span>{{ t('profile.logout' )}}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Content tabs -->
      <div class="mb-6">
        <div class="flex border-b border-slate-200">
          <button 
            class="px-4 py-2 border-b-2 border-teal-500 text-teal-600 font-medium"
          >
            {{ t('profile.myTips') }}
          </button>
        </div>
      </div>
      
      <!-- User's tips -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-slate-900">{{ t('profile.myTips') }}</h2>
          <button 
            @click="goToCreateTip"
            class="btn btn-primary"
          >
            <span class="mr-1">+</span> {{ t('profile.createTip') }}
          </button>
        </div>
        
        <div v-if="userDataTips && userDataTips.length > 0" class="space-y-4">
          <div v-for="tip in userDataTips" :key="tip.author?._id || tip?.id" class="relative">
            <TipCard :tip="tip" @like="handleLike" />
          </div>
        </div>
        
        <div v-else-if="!isLoading" class="bg-slate-50 rounded-lg p-8 text-center">
          <div class="text-4xl mb-2">📝</div>
          <h3 class="text-lg font-medium text-slate-800 mb-2">{{ t('profile.noTips') }}</h3>
          <p class="text-slate-600 mb-4">
            {{ t('profile.noTipsDescription') }}
          </p>
          <button 
            @click="goToCreateTip"
            class="btn btn-primary"
          >
            {{ t('profile.createTipButton')  }}
          </button>
        </div>
        
        <!-- Loading state for tips -->
        <div v-else class="flex justify-center items-center h-32">
          <div class="animate-pulse flex space-x-2">
            <div class="w-2 h-2 rounded-full bg-teal-400"></div>
            <div class="w-2 h-2 rounded-full bg-teal-500"></div>
            <div class="w-2 h-2 rounded-full bg-teal-600"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading indicator for user data -->
    <div v-else-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-teal-400"></div>
        <div class="w-3 h-3 rounded-full bg-teal-500"></div>
        <div class="w-3 h-3 rounded-full bg-teal-600"></div>
      </div>
    </div>
    
    <!-- Not logged in state -->
    <div v-else class="text-center py-12">
      <p class="text-lg text-slate-700 mb-4">Debes iniciar sesión para ver tu perfil</p>
      <button 
        @click="router.push('/login')"
        class="btn btn-primary"
      >
        Iniciar sesión
      </button>
    </div>
  </div>
</template>
