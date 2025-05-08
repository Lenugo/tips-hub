<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  categories: string[];
  selectedCategory: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', category: string | null): void;
}>();

const active = computed(() => props.selectedCategory);

const selectCategory = (category: string | null) => {
  emit('select', category);
};
</script>

<template>
  <div class="overflow-x-auto py-2 mb-4">
    <div class="flex space-x-2 min-w-max">
      <button
        @click="selectCategory(null)"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        :class="active === null ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        Todos
      </button>
      
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        :class="active === category ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>