import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import RegisterForm from '../components/Register.vue'
import teamCreate from '../components/teamCreate.vue'
import teamJoin from '../components/teamJoin.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: RegisterForm },
  { path: '/teamCreate', name: 'teamCreate', component: teamCreate },
  { path: '/teamJoin', name: 'teamJoin', component: teamJoin},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router