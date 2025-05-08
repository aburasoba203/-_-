<template>
  <div>
    <!-- 로그인/회원가입 폼 분기 -->
    <div v-if="!isLogin">
      <LoginForm v-if="view!=='register'" @loginSuccess="handleLogin"/>
      <Register v-else @registerSuccess="view='profile'" />
      <button v-if="view!=='register'" @click="view='register'">회원가입</button>
      <button v-if="view==='register'" @click="view='profile'">로그인으로</button>
    </div>
    <!-- 로그인 후 화면 -->
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
import Register from './components/Register.vue'
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