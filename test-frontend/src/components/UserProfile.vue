<template>
  <div v-if="user.value">
    <h2>{{ user.value.username }}님의 마이페이지</h2>
    <p>이메일: {{ user.value.email }}</p>
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
  <div v-else>
    <p>로그인이 필요합니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { user } from '../stores/user'
import { useRouter } from 'vue-router' 

console.log('user.value:', user.value)
console.log('user.value == null:', user.value == null)
console.log('!!user.value:', !!user.value)

const router = useRouter()
const createdTeams = ref([])
const joinedTeams = ref([])

function logout() {
  user.value = null
  router.push('/')
}

onMounted(async () => {
  
  console.log('UserProfile.vue에서 onMounted 시 user.value =', user.value)
  if (!user.value) return
  const res = await fetch(
    'http://localhost:3001/my-teams-and-created?user_id=' + user.value.id
  )
  const data = await res.json()
  if (data.success) {
    createdTeams.value = data.created_teams
    joinedTeams.value = data.joined_teams
  }
})
</script>
