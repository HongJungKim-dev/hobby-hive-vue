<template>
  <div>
    <!-- 로그인 모달 컴포넌트 -->
    <LoginModal :isOpen="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from '@/components/LoginModal.vue' // 위에서 만든 LoginModal 컴포넌트 가져오기

// 상태 관리
const isModalOpen = ref(true) // 항상 모달을 띄운 상태로 시작
const router = useRouter()

// 모달 닫기 함수
const closeModal = () => {
  isModalOpen.value = false // 모달 상태 변경
  router.back() // 이전 페이지로 이동
}
</script>

<style scoped>
/* 페이지 스타일 추가가 필요하다면 여기에 작성하세요 */
</style>
