<template>
  <form @submit.prevent="onLogin">
    <input v-model="email" placeholder="이메일" required />
    <input v-model="password" placeholder="비밀번호" type="password" required />
    <button type="submit">로그인</button>
    <div v-if="msg">{{ msg }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const msg = ref('')

const emit = defineEmits(['loginSuccess'])

async function onLogin() {
  try {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (data.success) {
      msg.value = `${data.user.username}님 환영합니다!`
      emit('loginSuccess', data.user) // 로그인 성공시 상위로 알림
    } else {
      msg.value = data.message
    }
  } catch (e) {
    msg.value = '서버 오류'
  }
}
</script>