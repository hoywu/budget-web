import { createRouter, createWebHistory } from 'vue-router'
import LoadingView from '../views/LoadingView.vue'
const DashboardView = () => import('../views/DashboardView.vue')
const RecordView = () => import('../views/RecordView.vue')
const CategoryView = () => import('../views/CategoryView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'loading',
      component: LoadingView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/record',
      name: 'record',
      component: RecordView
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryView
    },
  ]
})

export default router
