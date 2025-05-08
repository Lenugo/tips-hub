<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTipsStore } from '../stores/tips';
import { useUserStore } from '../stores/user';
import TipForm from '../components/TipForm.vue';

const router = useRouter();
const tipsStore = useTipsStore();
const userStore = useUserStore();

const handleSubmit = (formData: { title: string; content: string; category: string[] }) => {
  if (!userStore.currentUser) return;
  
  const newTip = tipsStore.addTip({
    title: formData.title,
    content: formData.content,
    category: formData.category,
    author: userStore.currentUser
  });
  
  router.push(`/tip/${newTip.id}`);
};

const handleCancel = () => {
  router.back();
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/');
  }
});
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Crear nuevo consejo</h1>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <TipForm 
          :categories="tipsStore.categories"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
