import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/utils/supabase'

export function useSession() {
  const session = ref(null) // React의 useState와 동일한 역할

  const updateSession = (newSession) => {
    session.value = newSession
  }

  onMounted(() => {
    // 초기 세션 가져오기
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      updateSession(initialSession)
    })

    // 세션 상태 변화 구독
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      updateSession(updatedSession)
    })

    // 컴포넌트 언마운트 시 구독 해제
    onUnmounted(() => {
      subscription.unsubscribe()
    })
  })

  return session
}
