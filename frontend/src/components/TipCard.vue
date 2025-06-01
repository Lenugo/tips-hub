<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/user'
import type { Tip } from '../types'
import { LikeButton } from './'

const props = defineProps<{
  tip: Tip
  detailed?: boolean
}>()

const emit = defineEmits<{
  (e: 'like', tipId: string): void
}>()

const router = useRouter()
const userStore = useUserStore()
const { t, locale } = useI18n()
const MAX_LENGHT = 150

const formattedDate = computed(() => {
  try {
    const dateToFormat = props.tip.publishedDate || props.tip.createdAt
    const dateLocale = locale.value === 'es' ? es : enUS
    return format(new Date(dateToFormat), 'PP', { locale: dateLocale })
  } catch (error) {
    return t('common.dateUnknown')
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
  
  const maxLength = MAX_LENGHT
  if (content.length <= maxLength) return content
  
  return content.substring(0, maxLength) + '...'
})

const showReadMore = computed(() => {
  const content = props.tip.content || ''
  return !props.detailed && content.length > MAX_LENGHT
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
      
      <p class="text-gray-700 mb-3" :class="{ 'whitespace-pre-line': detailed }">
        {{ truncatedContent }}
      </p>
      
      <div v-if="showReadMore" class="text-teal-600 font-medium text-sm mb-3">
        {{ t('tip.readMore') }}
      </div>
      
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>{{ formattedDate }}</span>
        <span v-if="tip.author">{{ t('tip.by') }} {{ tip.author.username }}</span>
      </div>
    </div>
  </div>
</template>