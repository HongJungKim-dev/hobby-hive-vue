<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import { useModalStore } from '@/stores/modalStore'
import { useUploadModalStore } from '@/stores/uploadModalStore'
import LoginModal from '@/components/LoginModal.vue'
import UploadModal from '@/components/modal/UploadModal.vue'

const modalStore = useModalStore()
const uploadModalStore = useUploadModalStore()
</script>

<template>
  <div id="app" class="app-layout">
    <!-- 헤더 (Navigation) -->
    <Navigation />

    <!-- 메인 콘텐츠 영역 -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- 푸터 -->
    <Footer />

    <!-- 모달들 -->
    <LoginModal :isOpen="modalStore.isLoginModalOpen" @close="modalStore.closeLoginModal" />
    <UploadModal
      :isOpen="uploadModalStore.isUploadModalOpen"
      @update:isOpen="uploadModalStore.closeUploadModal"
    />
  </div>
</template>

<style scoped>
/* 전체 레이아웃 스타일 */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 화면 전체 높이를 유지합니다 */
}

.main-content {
  flex: 1; /* 메인 콘텐츠가 화면의 남은 공간을 채우도록 설정 */
  padding: 20px;
  background-color: #fff; /* 배경색 추가 (필요 시) */
}

/* 기존 네비게이션 스타일은 Navigation.vue로 이동 */
</style>
