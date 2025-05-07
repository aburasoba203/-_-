<template>
    <form @submit.prevent="join">
      <input v-model="inviteCode" placeholder="초대코드를 입력해주세요" />
      <button type="submit">팀 참여</button>
      <div v-if="msg">{{ msg }}</div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  const props = defineProps(['user'])
  const inviteCode = ref('')
  const msg = ref('')
  
  const join = async () => {
    if (!props.user) {
      msg.value = '로그인 후 참가 가능합니다!'
      return
    }
    try {
      const res = await axios.post('http://localhost:3001/joinTeam', {
        invite_code: inviteCode.value,
        user_id: props.user.id // 로그인한 사용자 id!
      })
      if(res.data.success) {
        msg.value = '팀 참가 완료!'
        inviteCode.value = ''
      } else {
        msg.value = res.data.message || '팀 참가 실패'
      }
    } catch(e) {
      msg.value = '서버 오류!'
    }
  }
  </script>