<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useUserStore } from '../stores/user'
import type { Tip } from '../types'
import LikeButton from './LikeButton.vue'

const props = defineProps<{
  tip: Tip
  detailed?: boolean
}>()

const emit = defineEmits<{
  (e: 'like', tipId: string): void
}>()

const router = useRouter()
const userStore = useUserStore()

const formattedDate = computed(() => {
  try {
    const dateToFormat = props.tip.publishedDate || props.tip.createdAt
    return format(new Date(dateToFormat), 'PP', { locale: es })
  } catch (error) {
    return 'Date unknown'
  }
})

const isLiked = computed(() => {
  if (!userStore.isLoggedIn || !userStore.currentUser) {
    return false
  }
  
  const likedBy = Array.isArray(props.tip.likedBy) ? props.tip.likedBy : []
  
  return likedBy.includes(userStore.currentUser.id)
})

const truncatedContent = computed(() => {
  const content = props.tip.content || ''
  
  if (props.detailed) return content
  
  const maxLength = 150
  if (content.length <= maxLength) return content
  
  return content.substring(0, maxLength) + '...'
})

const handleCardClick = () => {
  if (!props.detailed) {
    router.push(`/tip/${props.tip.id}`)
  }
}

const handleLikeClick = (event: MouseEvent) => {
  event.stopPropagation()
  emit('like', props.tip.id)
}
</script>

<template>
  <div 
    class="card mb-4 hover:cursor-pointer"
    :class="{ 'hover:scale-[1.01] transition-transform': !detailed }"
    @click="handleCardClick"
  >
    <div class="p-4 md:p-6 bg-zinc-50">
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-semibold mb-1 text-gray-900">
          {{ tip.title }}
        </h3>
        
        <LikeButton 
          :is-liked="isLiked" 
          :count="tip.likes || 0" 
          @click="handleLikeClick"
        />
      </div>
      
      <div class="flex space-x-2 mb-3" v-if="tip.category">
        <span 
          v-for="cat in Array.isArray(tip.category) ? tip.category : [tip.category]" 
          :key="cat" 
          class="px-2 py-1 rounded-full text-xs bg-teal-50 text-teal-700"
        >
          {{ cat }}
        </span>
      </div>
      
      <p class="text-gray-700 mb-3" :class="{ 'whitespace-pre-line': detailed }">
        {{ truncatedContent }}
      </p>
      
      <div v-if="!detailed" class="text-teal-600 font-medium text-sm mb-3">
        Leer más...
      </div>
      
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>{{ formattedDate }}</span>
        <span v-if="tip.author">Por: {{ tip.author.username }}</span>
        <span v-else-if="tip.userName">Por: {{ tip.userName }}</span>
      </div>
    </div>
  </div>
</template>