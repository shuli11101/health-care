import { createRouter, createWebHistory } from 'vue-router'
import BackLayout from '@/components/BackLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Knowledge from '@/views/Knowledge.vue'
import Colsulations from '@/views/Colsulations.vue'
import Emotional from '@/views/Emotional.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AuthLayout from '@/components/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/back'
    },
    {
      path: '/back',
      component: BackLayout,
      redirect: '/back/dashboard',
      children: [
        {
          path: 'dashboard',
          component: Dashboard,
          meta: {
            title: '数据分析',
            icon: 'PieChart'
          }
        },
        {
          path: 'knowledge',
          component: Knowledge,
          meta: {
            title: '知识文章',
            icon: 'Knowledge'
          }
        },
        {
          path: 'colsulations',
          component: Colsulations,
          meta: {
            title: '咨询记录',
            icon: 'ChatLineRound'
          }
        },
        {
          path: 'emotional',
          component: Emotional,
          meta: {
            title: '情绪日志',
            icon: 'User'
          }
        }

      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          component: Login,
          meta: {
            title: '登录',
            icon: 'Login'
          }
        },
        {
          path: 'register',
          component: Register,
          meta: {
            title: '注册',
            icon: 'Register'
          }
        }
      ]
    }
  ]
})

export default router
