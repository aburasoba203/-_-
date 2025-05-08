import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import teamCreate from '../components/TeamCreate.vue'
import teamJoin from '../components/TeamJoin.vue'
import UserProfile from '../components/UserProfile.vue'
const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/Register', name: 'Register', component: Register },
  { path: '/teamCreate', name: 'teamCreate', component: teamCreate },
  { path: '/teamJoin', name: 'teamJoin', component: teamJoin},
  { path: '/UserProfile', name: 'UserProfile', component: UserProfile},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router