import { createRouter, createWebHistory } from 'vue-router'
import BackLayout from '@/components/BackLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Knowledge from '@/views/Knowledge.vue'
import Colsulations from '@/views/Colsulations.vue'
import Emotional from '@/views/Emotional.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AuthLayout from '@/components/AuthLayout.vue'

const backRouter =[
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


  
// 前台路由
const frontRouter = [
    {
      path: '/',
      component: () => import('@/components/FrontLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/home.vue')
        },
        {
          path: 'frontConsulations',
          component: () => import('@/views/frontConsulations.vue')
        },
        {
          path: 'frontEmotional',
          component: () => import('@/views/frontEmotional.vue')
        },
        {
          path: 'frontKnowledge',
          component: () => import('@/views/frontKnowledge.vue')
        },
        {
          path: 'frontArticleDetail/:id',
          component: () => import('@/views/frontArticleDetail.vue'),
          props: true
        }
      ]
    }
]
    

const router = createRouter({
  history: createWebHistory('/health-care/'),
  routes: [
    ...backRouter,
    ...frontRouter
  ]
})

export default router




router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')
  // 存在token
  if(token && userInfo) {
    // 判断是前台后台
    if(userInfo.userType == 2) { //后台时
      if(to.path.startsWith('/back')) {
        next()
      } else if(to.path.startsWith('/auth')) {
        next()
      } else {
        next('/back/dashboard')
      }
    } else { //如果是前台
      if(to.path.startsWith('/back')) {
        next('/')
      } else {
        next()
      }
    }
  } else {
    if(to.path.startsWith('/back')) {
      next('/auth/login')
    } else {
      next()
    }
  }
})






