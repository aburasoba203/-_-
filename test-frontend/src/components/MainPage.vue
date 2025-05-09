<template>
    <h1>WELCOME!</h1>
    <nav>
      <button @click="goProfile">내 정보</button>
      <button @click="logout">로그아웃</button>
    </nav>
    <router-view />
</template>
  
<script setup>
  import { useRouter } from 'vue-router'
  import { user } from '../stores/user'
  const router = useRouter()
  function goProfile() {
    router.push('/UserProfile')
  }
  function logout() {
    user.value = null
    localStorage.removeItem('user')
    router.push('/')
    }
</script>