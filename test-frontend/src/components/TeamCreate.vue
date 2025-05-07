<template>
    <div>
      <h2>팀 생성</h2>
      <form @submit.prevent="handleCreate">
        <input v-model="name" placeholder="팀 이름" required />
        <textarea v-model="description" placeholder="팀 소개" />
        <input v-model="owner_id" placeholder="팀장 아이디" type="number" required />
        <button type="submit">생성</button>
      </form>
      <div v-if="inviteCode" class="popup">
        <p>초대코드: <b>{{ inviteCode }}</b></p>
        <button @click="inviteCode = ''">닫기</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const name = ref('')
  const description = ref('')
  const owner_id = ref('')
  
  const inviteCode = ref('')
  
  const handleCreate = async () => {
    inviteCode.value = ''
    const res = await axios.post('http://localhost:3001/teams', {
      name: name.value,
      description: description.value,
      owner_id: owner_id.value,
    });
    if (res.data.success) {
      inviteCode.value = res.data.invite_code
      name.value = description.value = owner_id.value = ''
    }
  }
  </script>
  
  <style scoped>
  .popup {
    margin: 20px 0;
    padding: 20px;
    border: 2px solid #3b82f6;
    border-radius: 12px;
    background: #f0f8ff;
  }
  </style>