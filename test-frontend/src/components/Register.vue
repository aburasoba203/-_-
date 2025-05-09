<template>
  <form @submit.prevent="onRegister">
    <input v-model="username" required placeholder="이름" />
    <input v-model="email" required placeholder="이메일" />
    <input v-model="password" type="password" required placeholder="비밀번호" />
    <button type="submit">회원가입</button>
    <div v-if="msg">{{ msg }}</div>
  </form>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const msg = ref('')
const onRegister = async () => {
  try {
    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, email: email.value, password: password.value })
    })
    const data = await res.json()
    if (data.success) {
      msg.value = data.message
      router.push('/') // 회원가입 성공 후, 로그인창 이동
    } else {
      msg.value = data.message
    }
  } catch (e) {
    msg.value = '서버 오류'
  }
}
</script>