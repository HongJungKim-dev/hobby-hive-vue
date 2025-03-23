<template>
  <header>
    <nav
      :class="['header-nav', { scrolled: isScrolled }]"
      role="navigation"
      aria-label="메인 내비게이션"
    >
      <div class="nav-container">
        <!-- 로고 -->
        <router-link to="/" class="logo" aria-label="홈페이지로 이동">
          <h1>hobby-hive</h1>
        </router-link>

        <!-- 오른쪽 액션 버튼들 -->
        <div class="nav-actions">
          <Suspense>
            <template #default>
              <div class="action-buttons">
                <UploadModalButton />
                <ProfileButton />
              </div>
            </template>
            <template #fallback>
              <div role="status" aria-live="polite">로딩중...</div>
            </template>
          </Suspense>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router' // Vue Router에서 현재 경로를 가져옴
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faSearch, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import UploadModalButton from '@/components/modal/UploadModalButton.vue'
import ProfileButton from '@/components/ProfileButton.vue'

// FontAwesome 아이콘 등록
library.add(faHome, faSearch, faCircleInfo)

const isScrolled = ref(false)
const route = useRoute()
const isMainPage = ref(route.path === '/')

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// 스크롤 이벤트 등록
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-nav {
  background-color: white;
  padding: 10px 20px;
  transition: background-color 0.3s ease-in-out;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

/* 로딩 상태 스타일 */
[aria-live='polite'] {
  font-size: 0.875rem;
  color: #999;
}
</style>
