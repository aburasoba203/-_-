<template>
  <form @submit.prevent="onLogin">
    <input v-model="email" placeholder="이메일" required />
    <input v-model="password" type="password" placeholder="비밀번호" required />
    <button type="submit">로그인</button>
    <div v-if="msg">{{ msg }}</div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '../stores/user'

const router = useRouter()
const email = ref('')
const password = ref('')
const msg = ref('')

// 새로고침시 localStorage 불러와서 로그인 유지!
onMounted(() => {
  const saved = localStorage.getItem('user')
  if (saved) {
    user.value = JSON.parse(saved)
    router.push('/MainPage') // 로그인 상태면 바로 메인페이지 이동
  }
})

const onLogin = async () => {
  try {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (data.success) {
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user)) // 로그인 유지!
      router.push('/MainPage')
    } else {
      msg.value = data.message
    }
  } catch (e) {
    msg.value = '서버 오류'
  }
}
</script>