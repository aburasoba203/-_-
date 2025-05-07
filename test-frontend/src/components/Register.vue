<template>
    <div style="max-width:350px;margin:100px auto;">
      <h1>회원가입</h1>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="이름" required /><br>
        <input v-model="email" type="email" placeholder="이메일" required /><br>
        <input v-model="password" type="password" placeholder="비밀번호" required /><br>
        <button type="submit">회원가입</button>
      </form>
      <p v-if="msg" style="color: red;">{{ msg }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const username = ref('')
  const email = ref('')
  const password = ref('')
  const msg = ref('')
  
  const register = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username: username.value,
        email: email.value,
        password: password.value
      })
      if (response.data.success) {
        msg.value = response.data.message
        username.value = ''
        email.value = ''
        password.value = ''
      } else {
        msg.value = response.data.message
      }
    } catch (e) {
      msg.value = '서버에 연결할 수 없습니다.'
    }
  }
  </script>