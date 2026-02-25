import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/agendar', name: 'ReservaCita', component: () => import('@/views/ReservaCita.vue') },
  { path: '/admin', name: 'AdminPanel', component: () => import('@/views/AdminPanel.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return savedPosition || { top: 0, left: 0 }
  }
})

export default router