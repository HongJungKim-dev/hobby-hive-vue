<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import ImageGrid from '@/components/ImageGrid.vue'
import '@/styles/app/page.scss'

const PAGE_SIZE = 5
const loading = ref(true)
const error = ref<string | null>(null)
const files = ref<any[]>([])

const fetchFiles = async () => {
  try {
    const { data: uploadedFiles, error: fetchError } = await supabase
      .from('files_upload')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    files.value = uploadedFiles.map((file) => ({
      id: file.id,
      file_path: file.file_path,
      description: file.description,
      created_at: new Date(file.created_at).toLocaleDateString('ko-KR'),
      updated_at: file.updated_at ? new Date(file.updated_at).toLocaleDateString('ko-KR') : null,
    }))
  } catch (err) {
    console.error('Error fetching files:', err)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFiles()
})
</script>

<template>
  <section class="layout-content">
    <div v-if="loading">로딩중...</div>
    <div v-else-if="error">{{ error }}</div>
    <ImageGrid v-else :files="files" />
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/styles/_variables.scss' as *;

.layout-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: map.get($spacing, 'spacing-4') map.get($spacing, 'spacing-5');
  width: 100%;
}
</style>
