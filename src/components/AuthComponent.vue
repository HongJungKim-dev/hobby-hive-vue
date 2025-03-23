<template>
  <div>
    <form @submit.prevent="signIn">
      <label for="email">이메일</label>
      <input id="email" v-model="email" type="email" required />

      <label for="password">비밀번호</label>
      <input id="password" v-model="password" type="password" required />

      <button type="submit">로그인</button>
    </form>
    <button @click="signUp">회원가입</button>
    <button @click="signInWithGoogle">Google로 로그인</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

const email = ref('')
const password = ref('')

// 로그인 함수
const signIn = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    alert('로그인 실패: ' + error.message)
  } else {
    alert('로그인 성공!')
  }
}

// 회원가입 함수
const signUp = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) {
    alert('회원가입 실패: ' + error.message)
  } else {
    alert('회원가입 성공!')
  }
}

// Google OAuth 로그인 함수
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  if (error) {
    alert('Google 로그인 실패: ' + error.message)
  }
}
</script>
