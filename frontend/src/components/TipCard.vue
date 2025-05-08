<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useUserStore } from '../stores/user';
import type { Tip } from '../types';
import LikeButton from './LikeButton.vue';

const props = defineProps<{
  tip: Tip;
  detailed?: boolean;
}>();

const emit = defineEmits<{
  (e: 'like', tipId: string): void;
}>();

const router = useRouter();
const userStore = useUserStore();

const formattedDate = computed(() => {
  try {
    return format(new Date(props.tip.publishedDate), 'PP', { locale: es });
  } catch (error) {
    return 'Fecha desconocida';
  }
});

const isLiked = computed(() => {
  return userStore.hasLikedTip(props.tip.likedBy);
});

const truncatedContent = computed(() => {
  if (props.detailed) return props.tip.content;
  
  const maxLength = 150;
  if (props.tip.content.length <= maxLength) return props.tip.content;
  
  return props.tip.content.substring(0, maxLength) + '...';
});

const handleCardClick = () => {
  if (!props.detailed) {
    router.push(`/tip/${props.tip.id}`);
  }
};

const handleLikeClick = (event: MouseEvent) => {
  event.stopPropagation();
  emit('like', props.tip.id);
};
</script>

<template>
  <div 
    class="card mb-4 hover:cursor-pointer"
    :class="{ 'hover:scale-[1.01] transition-transform': !detailed }"
    @click="handleCardClick"
  >
    <div class="p-4 md:p-6">
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-semibold mb-1 text-gray-900">
          {{ tip.title }}
        </h3>
        
        <LikeButton 
          :is-liked="isLiked" 
          :count="tip.likes" 
          @click="handleLikeClick"
        />
      </div>
      
      <div class="flex space-x-2 mb-3">
        <span 
          v-for="cat in tip.category" 
          :key="cat" 
          class="px-2 py-1 rounded-full text-xs bg-primary-50 text-primary-700"
        >
          {{ cat }}
        </span>
      </div>
      
      <p class="text-gray-700 mb-3" :class="{ 'whitespace-pre-line': detailed }">
        {{ truncatedContent }}
      </p>
      
      <div v-if="!detailed" class="text-primary-600 font-medium text-sm mb-3">
        Leer más...
      </div>
      
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>{{ formattedDate }}</span>
        <span v-if="tip.author">Por: {{ tip.author.username }}</span>
      </div>
    </div>
  </div>
</template>