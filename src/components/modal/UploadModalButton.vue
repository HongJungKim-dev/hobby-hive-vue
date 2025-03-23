<template>
  <li class="nav-item" style="cursor: pointer">
    <!-- FontAwesome 아이콘으로 MdUpload 대체 -->
    <font-awesome-icon :icon="['fas', 'upload']" class="icon" />
    <button class="basic-button" @click="handleClick">업로드</button>
    <!-- 로그인된 경우 업로드 모달 -->
    <UploadModal
      v-if="session"
      :isOpen="uploadModalStore.isUploadModalOpen"
      @close="uploadModalStore.closeUploadModal"
    />
  </li>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSession } from '@/hooks/useSession'
import { useModalStore } from '@/stores/modalStore'
import { useUploadModalStore } from '@/stores/uploadModalStore'
import UploadModal from './UploadModal.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

// 상태 관리
const session = useSession()
const router = useRouter()
const modalStore = useModalStore()
const uploadModalStore = useUploadModalStore()

// 클릭 시 동작 처리
const handleClick = () => {
  if (!session.value) {
    modalStore.openLoginModal()
    return
  }
  console.log('업로드 모달 열기', uploadModalStore)
  uploadModalStore.openUploadModal()
}
</script>

<style scoped>
.basic-button {
  display: block;
  border: none;
  padding: 0;
  text-align: left;

  font-size: 1.6rem;
  line-height: 1.5;
  font-family:
    var(--font-spoqa),
    -apple-system,
    sans-serif;
  margin: 0;
  padding: 0;
  background-color: transparent;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 1.4rem;
  color: inherit;
}
</style>
