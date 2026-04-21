import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/backrouter'

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { data, config } = response
    if(data.code === 200 || data.code === '200') {
      // console.log(data)
      return data
    } else {
      if(data.code === -1 || data.code === '-1') {
        // console.log(config.url)
        if(!config.url?.includes('/login')) {
          ElMessage.error(data.msg || '登陆过期，请重新登陆')

          // 清除登陆信息
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          router.push('/auth/login')
        } else {
          // 登录失败时，返回错误信息
          return Promise.reject(data.msg || '登录失败')
        }
      } else {
        ElMessage.error(data.msg || '网络连接异常1')
        return Promise.reject(data.msg || '网络连接异常')
      }
    }
  },
)

export default service