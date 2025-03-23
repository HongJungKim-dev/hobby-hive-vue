import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

interface Post {
  id?: number
  title: string
  content: string
  created_at?: string
}

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPosts() {
      this.loading = true
      try {
        const { data, error } = await supabase.from('posts').select('*')
        if (error) throw error
        this.posts = data
      } catch (error) {
        this.error = (error as Error).message
      } finally {
        this.loading = false
      }
    },

    async createPost(post: Post) {
      const { data, error } = await supabase.from('posts').insert(post).single()

      if (error) throw error
      return data
    },
    // ... 수정, 삭제 등 다른 액션들
  },
})
