<template>
    <div>
      <h2>{{ user.username }}님의 마이페이지</h2>
      <p>이메일: {{ user.email }}</p>
      <button @click="logout">로그아웃</button>
      <hr>
      <h3>내가 참여 중인 팀</h3>
      <ul>
        <li v-if="joinedTeams.length === 0">아직 참가한 팀이 없어요!</li>
        <li v-for="team in joinedTeams" :key="team.id">
          {{ team.name }} (소개: {{ team.description }})
        </li>
      </ul>
      <h3>내가 만든 팀</h3>
      <ul>
        <li v-if="createdTeams.length === 0">아직 내가 만든 팀이 없어요!</li>
        <li v-for="team in createdTeams" :key="team.id">
          {{ team.name }} (초대코드: {{ team.invite_code }}) 
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  const props = defineProps(['user'])
  const emit = defineEmits(['logout'])
  
  const createdTeams = ref([])
  const joinedTeams = ref([])
  
  function logout() { emit('logout') }
  
  onMounted(async () => {
    if (!props.user) return
    const res = await fetch('http://localhost:3001/my-teams-and-created?user_id=' + props.user.id)
    const data = await res.json()
    if (data.success) {
      createdTeams.value = data.created_teams
      joinedTeams.value = data.joined_teams
    }
  })
  </script>