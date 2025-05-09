import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { user } from './stores/user'

// localStorage에서 복구
const saved = localStorage.getItem('user')
if (saved) user.value = JSON.parse(saved)

// 로그 확인 (여기!)
console.log('main.js에서 user.value =', user.value)

const app = createApp(App)
app.use(router)
app.mount('#app')