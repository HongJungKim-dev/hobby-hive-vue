<template>
  <a-modal
    :visible="isOpen"
    @update:visible="updateIsOpen"
    :width="400"
    centered
    @cancel="closeModal"
  >
    <AuthComponent />
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import AuthComponent from './AuthComponent.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isOpen', 'close']) // 상태 변경 이벤트와 닫기 이벤트 정의
const router = useRouter()

const closeModal = () => {
  emit('close') // close 이벤트를 부모로 전달
  if (router.currentRoute.value.path === '/login') {
    router.back() // /login 경로인 경우 뒤로 이동
  }
}

// 부모로 상태 업데이트를 전달하는 함수
const updateIsOpen = (value) => {
  emit('update:isOpen', value) // 부모 컴포넌트로 새로운 visible 값 전달
}
</script>
