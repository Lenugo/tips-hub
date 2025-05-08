<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isLiked: boolean;
  count: number;
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const liked = ref(props.isLiked);
const likeCount = ref(props.count);

// Update component state when props change
watch(() => props.isLiked, (newValue) => {
  liked.value = newValue;
});

watch(() => props.count, (newValue) => {
  likeCount.value = newValue;
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <button 
    @click="handleClick"
    class="flex items-center space-x-1 focus:outline-none group"
    aria-label="Like Tip"
  >
    <span 
      class="text-xl transition-transform duration-300 transform group-hover:scale-110"
      :class="{ 'text-accent-500': liked, 'text-gray-400': !liked }"
    >
      {{ liked ? '❤️' : '🤍' }}
    </span>
    <span 
      v-if="likeCount > 0"
      class="text-sm" 
      :class="{ 'text-accent-500 font-medium': liked, 'text-gray-500': !liked }"
    >
      {{ likeCount }}
    </span>
  </button>
</template>