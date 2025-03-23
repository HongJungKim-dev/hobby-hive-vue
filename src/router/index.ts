import { createRouter, createWebHistory } from 'vue-router'
import AllView from '@/views/AllView.vue'
import { useModalStore } from '@/stores/modalStore'
import { supabase } from '@/utils/supabase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/all',
    name: 'All',
    component: AllView,
    meta: {
      title: 'Hobby Hive - 메인 피드',
      description: '다양한 취미 활동을 공유하는 공간입니다.',
    },
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('@/views/PostsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Hobby Hive - 내 게시물',
      description: '내가 업로드한 게시물을 확인할 수 있습니다.',
    },
  },
  // {
  //   path: '/my-posts',
  //   name: 'MyPosts',
  //   component: () => import('../views/MyPosts.vue'),
  // },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: (to, from, next) => {
      const modalStore = useModalStore()
      modalStore.openLoginModal()
      next(false) // 실제 라우트 변경을 막습니다
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 타이틀 업데이트
router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.title as string) || 'Hobby Hive'

  // 인증이 필요한 라우트 체크
  if (to.meta.requiresAuth) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      const modalStore = useModalStore()
      modalStore.openLoginModal()
      next(false)
      return
    }
  }
  next()
})

export default router
