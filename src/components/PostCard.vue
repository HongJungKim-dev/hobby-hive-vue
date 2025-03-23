<template>
  <a-card class="post-card" :loading="loading">
    <img :src="post.imageUrl" :alt="post.title" />
    <template #actions>
      <edit-outlined key="edit" @click="handleEdit" v-if="isOwner" />
      <delete-outlined key="delete" @click="handleDelete" v-if="isOwner" />
    </template>
    <a-card-meta :title="post.title" :description="post.description" />
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  post: Post
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', post: Post): void
  (e: 'delete', id: string): void
}>()

const authStore = useAuthStore()
const isOwner = computed(() => props.post.userId === authStore.user?.id)

const handleEdit = () => emit('edit', props.post)
const handleDelete = () => emit('delete', props.post.id)
</script>

<style lang="scss" scoped>
.post-card {
  width: 300px;
  margin: 16px;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}
</style>
