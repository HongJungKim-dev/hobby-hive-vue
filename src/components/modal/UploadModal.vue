<template>
  <a-modal
    :visible="isOpen"
    @update:visible="updateIsOpen"
    :width="400"
    :title="modalTitle"
    centered
    @cancel="initializeStateWhenClose"
    :maskClosable="false"
    :footer="null"
  >
    <div class="header">
      <template v-if="uploadedImageUrl || isNextStep">
        <a-button type="text" @click="handleBackStep" aria-label="이전 단계로 돌아가기">
          <template #icon><ArrowLeftOutlined /></template>
          이전
        </a-button>
      </template>
      <span id="modal-title">{{ isNextStep ? '설명 입력' : '파일 업로드' }}</span>
      <span v-if="uploadedImageUrl && !isNextStep">
        <a-button type="text" @click="setIsNextStep(true)" aria-label="다음 단계로 진행하기">
          <template #icon><ArrowRightOutlined /></template>
          다음
        </a-button>
      </span>
    </div>

    <div v-if="isNextStep" class="content-wrapper">
      <img
        :src="uploadedImageUrl"
        alt="업로드된 이미지 미리보기"
        width="200"
        height="200"
        style="object-fit: contain"
      />
      <div class="text-save-area">
        <label for="image-description" class="sr-only">이미지 설명</label>
        <a-textarea
          id="image-description"
          placeholder="이미지에 대한 설명을 입력해주세요"
          v-model:value="description"
          :disabled="saveMutation.isLoading"
          :rows="4"
          aria-required="true"
        />
        <a-button
          type="primary"
          style="margin-top: 10px"
          @click="handleSaveDescription"
          :loading="saveMutation.isLoading"
          :disabled="saveMutation.isLoading"
          aria-busy="saveMutation.isLoading"
        >
          {{ saveMutation.isLoading ? '저장중...' : '저장하기' }}
        </a-button>
      </div>
    </div>
    <div v-else>
      <a-upload-dragger
        name="file"
        :disabled="uploadMutation.isLoading"
        accept="image/*"
        :custom-request="customRequest"
      >
        <div v-if="uploadMutation.isLoading" role="status" aria-live="polite">업로드 중...</div>
        <div v-else>
          <p><inbox-outlined /></p>
          <p>클릭하거나 파일을 이 영역으로 드래그하세요</p>
          <p>이미지 파일을 업로드할 수 있습니다</p>
        </div>
      </a-upload-dragger>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { supabase } from '@/utils/supabase'
import { message } from 'ant-design-vue'
import { InboxOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['update:isOpen'])

const uploadedImageUrl = ref(null)
const isNextStep = ref(false)
const description = ref('')
const queryClient = useQueryClient()

const checkAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}

const initializeStateWhenClose = () => {
  uploadedImageUrl.value = null
  isNextStep.value = false
  description.value = ''
  emit('update:isOpen', false)
}

const updateIsOpen = (value) => {
  emit('update:isOpen', value)
}

const uploadMutation = useMutation({
  mutationFn: async (file) => {
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`

    const { error } = await supabase.storage.from('media').upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(fileName)

    return publicUrl
  },
  onSuccess: (publicUrl) => {
    uploadedImageUrl.value = publicUrl
    message.success('파일이 성공적으로 업로드되었습니다.')
  },
  onError: () => {
    message.error('업로드 중 오류가 발생했습니다.')
  },
})

const saveMutation = useMutation({
  mutationFn: async ({ url, description }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const { data, error } = await supabase.from('files_upload').insert([
      {
        file_path: url,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id,
      },
    ])

    if (error) throw error
    return data
  },
  onSuccess: () => {
    message.success('이미지와 설명이 성공적으로 저장되었습니다.')
    queryClient.invalidateQueries({
      queryKey: ['mediaFiles'],
      exact: true,
      refetchType: 'all',
    })
    initializeStateWhenClose()
  },
  onError: (error) => {
    console.error('Error:', error)
    message.error('저장 중 오류가 발생했습니다. 자동으로 재시도합니다.')
  },
})

const handleSaveDescription = async () => {
  if (!uploadedImageUrl.value) {
    message.error('이미지를 먼저 업로드해주세요.')
    return
  }

  if (saveMutation.isLoading) {
    message.warning('저장 중입니다. 잠시만 기다려주세요.')
    return
  }

  saveMutation.mutate({
    url: uploadedImageUrl.value,
    description: description.value,
  })
}

const setIsNextStep = (value) => {
  isNextStep.value = value
}

const handleBackStep = () => {
  if (isNextStep.value) {
    isNextStep.value = false
  } else {
    uploadedImageUrl.value = null
  }
}

const customRequest = async ({ file }) => {
  try {
    const isAuth = await checkAuth()
    if (!isAuth) {
      if (window.confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
        // Vue Router로 이동하는 로직 추가 필요
        return
      }
      return
    }
    uploadMutation.mutate(file)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .text-save-area {
    width: 100%;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
