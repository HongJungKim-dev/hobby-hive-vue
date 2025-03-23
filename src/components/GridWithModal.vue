<template>
  <div>
    <ImageGrid :initialFiles="files" @click="setSelectedFile" />
    <EditPostModal v-if="selectedFile" :file="selectedFile" @close="setSelectedFile(null)" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { supabase } from '@/utils/supabase'
import ImageGrid from './ImageGrid.vue'
import EditPostModal from './modal/EditPostModal.vue'

const props = defineProps({
  userId: String,
  initialFiles: Array,
})

const selectedFile = ref(null)

const { data: files } = useQuery({
  queryKey: ['files', props.userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('files_upload')
      .select('*')
      .eq('user_id', props.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((file) => ({
      id: file.id,
      file_path: file.file_path,
      description: file.description,
      created_at: new Date(file.created_at).toLocaleDateString('ko-KR'),
      updated_at: file.updated_at ? new Date(file.updated_at).toLocaleDateString('ko-KR') : null,
    }))
  },
  initialData: props.initialFiles,
})

const setSelectedFile = (file) => {
  selectedFile.value = file
}
</script>
