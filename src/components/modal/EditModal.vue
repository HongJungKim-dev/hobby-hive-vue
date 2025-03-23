<template>
  <!-- 삭제 확인 모달 -->
  <a-modal title="삭제 확인" :visible="isConfirmModalOpen" @cancel="isConfirmModalOpen = false">
    <template #footer>
      <div style="display: flex; justify-content: flex-end">
        <a-button @click="isConfirmModalOpen = false">취소</a-button>
        <a-button
          type="primary"
          danger
          :loading="deleteMutation.isLoading"
          @click="deleteMutation.mutate"
        >
          삭제
        </a-button>
      </div>
    </template>
    <p>정말로 이 게시물을 삭제하시겠습니까?</p>
  </a-modal>

  <!-- 메인 수정 모달 -->
  <a-modal :title="modalTitle" :visible="isOpen" @cancel="onClose" centered>
    <template #title>
      <div class="header">
        <span>게시물 수정</span>
      </div>
    </template>

    <div class="content-wrapper">
      <a-upload
        :show-upload-list="false"
        :before-upload="handleUpload"
        :disabled="uploadMutation.isLoading"
      >
        <div>
          <img
            v-if="uploadedImageUrl"
            :src="uploadedImageUrl"
            alt="업로드된 이미지"
            style="width: 200px; height: 200px; object-fit: contain"
          />
          <div v-else>클릭하여 이미지 업로드</div>
        </div>
      </a-upload>

      <div class="text-save-area">
        <a-textarea
          v-model:value="description"
          :rows="4"
          placeholder="이미지에 대한 설명을 입력해주세요"
          :disabled="updateMutation.isLoading"
          style="height: 200px"
        />
      </div>
    </div>

    <template #footer>
      <div style="display: flex; justify-content: space-between">
        <a-button
          danger
          @click="isConfirmModalOpen = true"
          :disabled="deleteMutation.isLoading || updateMutation.isLoading"
        >
          삭제하기
        </a-button>
        <a-button
          type="primary"
          @click="updateMutation.mutate()"
          :loading="updateMutation.isLoading"
          :disabled="uploadMutation.isLoading"
        >
          {{ editMode ? '수정하기' : '저장하기' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { supabase } from '@/utils/supabase'
import { message } from 'ant-design-vue'

const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
  editMode: {
    type: Boolean,
    default: false,
  },
  initialData: Object,
})

const queryClient = useQueryClient()
const isConfirmModalOpen = ref(false)
const uploadedImageUrl = ref(props.initialData?.file_path || null)
const description = ref(props.initialData?.description || '')

// 이미지 업로드 mutation
const uploadMutation = useMutation({
  mutationFn: async (file) => {
    // 1. 기존 이미지 삭제
    if (props.initialData?.file_path) {
      const existingFileName = props.initialData.file_path.split('/').pop()
      if (existingFileName) {
        await supabase.storage.from('media').remove([existingFileName])
      }
    }

    // 2. 새 이미지 업로드
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`

    const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file)

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(fileName)

    return publicUrl
  },
  onSuccess: (publicUrl) => {
    uploadedImageUrl.value = publicUrl
    message.success('이미지가 업로드되었습니다. 저장하려면 수정하기를 클릭하세요.')
  },
  onError: () => {
    message.error('이미지 업로드 중 오류가 발생했습니다.')
  },
})

// 설명 수정 mutation
const updateMutation = useMutation({
  mutationFn: async () => {
    if (!props.initialData?.id) throw new Error('데이터 ID가 없습니다.')

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('인증 정보를 확인할 수 없습니다.')

    const { error: dbError } = await supabase
      .from('files_upload')
      .update({
        file_path: uploadedImageUrl.value,
        description: description.value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', props.initialData.id)
      .eq('user_id', user.id)

    if (dbError) throw dbError
  },
  onSuccess: () => {
    message.success('게시물이 성공적으로 수정되었습니다.')
    queryClient.invalidateQueries({
      queryKey: ['mediaFiles'],
      exact: true,
      refetchType: 'all',
    })
    props.onClose()
  },
  onError: (error) => {
    console.error('Error:', error)
    message.error('수정 중 오류가 발생했습니다.')
  },
})

// 삭제 mutation
const deleteMutation = useMutation({
  mutationFn: async () => {
    if (!props.initialData?.id) throw new Error('데이터 ID가 없습니다.')

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('인증 정보를 확인할 수 없습니다.')

    const { error: dbError } = await supabase
      .from('files_upload')
      .delete()
      .eq('id', props.initialData.id)
      .eq('user_id', user.id)

    if (dbError) throw dbError
  },
  onSuccess: () => {
    message.success('게시물이 성공적으로 삭제되었습니다.')
    queryClient.invalidateQueries({
      queryKey: ['mediaFiles'],
      exact: true,
      refetchType: 'all',
    })
    props.onClose()
  },
  onError: (error) => {
    console.error('Error:', error)
    message.error('삭제 중 오류가 발생했습니다.')
  },
})

const handleUpload = (file) => {
  uploadMutation.mutate(file)
  return false
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .text-save-area {
    width: 100%;
  }
}
</style>
