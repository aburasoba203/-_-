<template>
  <div>
    <LoginForm v-if="!isLogin" @loginSuccess="handleLogin"/>
    <div v-else>
      <nav>
        <button @click="view='profile'">내 정보</button>
        <button @click="view='create'">팀 생성</button>
        <button @click="view='join'">팀 참가</button>
        <button @click="logout">로그아웃</button>
      </nav>
      <UserProfile v-if="view==='profile'" :user="loginUser" />
      <TeamCreate v-else-if="view==='create'" :user="loginUser"/>
      <TeamJoin v-else-if="view==='join'" :user="loginUser"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from './components/Login.vue'
import UserProfile from './components/UserProfile.vue'
import TeamCreate from './components/TeamCreate.vue'
import TeamJoin from './components/TeamJoin.vue'

const isLogin = ref(false)
const loginUser = ref(null)
const view = ref('profile')

function handleLogin(user) {
  isLogin.value = true
  loginUser.value = user
}

function logout() {
  isLogin.value = false
  loginUser.value = null
  view.value = 'profile'
}
</script>