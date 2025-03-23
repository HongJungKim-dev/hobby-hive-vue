<template>
  <li class="nav-item" @click="handleClick" style="cursor: pointer">
    <!-- FontAwesome 아이콘으로 MdPerson 대체 -->
    <font-awesome-icon :icon="['fas', 'user']" class="icon" />
    <button class="basic-button" @click="handleButtonClick">
      {{ session ? '올린글' : '로그인' }}
    </button>

    <!-- 로그아웃 버튼: session이 존재하는 경우 표시 -->
    <div v-if="session" @click.stop="handleSignOut" style="margin-left: 1.2rem">
      <button class="basic-button">로그아웃</button>
    </div>
  </li>
</template>

<script setup>
import { useRouter } from 'vue-router' // Vue Router를 사용하여 경로 처리
import { supabase } from '@/utils/supabase' // supabase 연결 (같은 방식으로 사용 가능)
import { useSession } from '@/hooks/useSession' // Vue에서 작성된 커스텀 세션 훅 필요
import { useModalStore } from '@/stores/modalStore'

// FontAwesome 아이콘 임포트
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

// 사용자 세션 및 상태 관리
const session = useSession() // Vue용 커스텀 훅으로 변환이 필요합니다
const router = useRouter()
const modalStore = useModalStore()

// 로그아웃 처리 함수
const handleSignOut = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

// 버튼 클릭 이벤트
const handleButtonClick = (e) => {
  e.stopPropagation() // 이벤트 버블링 방지

  if (!session.value) {
    modalStore.openLoginModal()
  } else {
    router.push('/posts')
  }
}

const handleClick = () => {
  if (session.value) {
    router.push('/posts')
  } else {
    modalStore.openLoginModal()
  }
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
