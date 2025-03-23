<template>
  <section class="layout-content">
    <div class="user-profile-header">
      <div class="profile-container">
        <div class="profile-image">
          <img :src="userAvatar" alt="사용자 프로필" class="avatar-image" width="50" height="50" />
        </div>
        <div class="profile-info">
          <h3 class="user-name">{{ userName }}</h3>
        </div>
      </div>
    </div>
    <Suspense>
      <template #default>
        <GridWithModal :userId="userId" :initialFiles="initialFiles" />
      </template>
      <template #fallback>
        <div>로딩중...</div>
      </template>
    </Suspense>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import GridWithModal from '@/components/GridWithModal.vue'

const router = useRouter()
const userAvatar = ref('/default-avatar.png')
const userName = ref('')
const userId = ref(null)
const initialFiles = ref([])

onMounted(async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user) {
    router.push('/login')
    return
  }

  userId.value = user.id

  // 사용자 프로필 데이터 가져오기
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  userAvatar.value = profile?.avatar_url || user.user_metadata?.avatar_url || '/default-avatar.png'

  userName.value = profile?.full_name || user.user_metadata?.full_name || user.email

  // 파일 데이터 가져오기
  const { data: files, error } = await supabase
    .from('files_upload')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  initialFiles.value = files.map((file) => ({
    id: file.id,
    file_path: file.file_path,
    description: file.description,
    created_at: new Date(file.created_at).toLocaleDateString('ko-KR'),
    updated_at: file.updated_at ? new Date(file.updated_at).toLocaleDateString('ko-KR') : null,
  }))
})
</script>

<style lang="scss">
.layout-content {
  padding: 20px;
}

.user-profile-header {
  margin-bottom: 20px;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-image {
  .avatar-image {
    border-radius: 50%;
    object-fit: cover;
  }
}

.profile-info {
  .user-name {
    margin: 0;
    font-size: 1.2rem;
  }
}
</style>
