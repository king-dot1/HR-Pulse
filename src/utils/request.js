import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

// 创建 axios 实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础路径
  timeout: 10000 // 超时时间
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  // 判断是否有 token
  const token = store.getters.token
  if (token) {
    // 携带 token
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  const { success, message } = response.data
  // 判断响应状成功失败
  if (success) {
    // 成功
    return response.data
  } else {
    // 失败
    Message({
      type: 'error',
      message: message || '操作失败'
    })
    return Promise.reject(new Error(message || '操作失败'))
  }
}, async(error) => {
  // token 失效 401
  if (error.response.status === 401) {
    Message({
      type: 'error',
      message: 'token失效了'
    })
    // 清空 token
    await store.dispatch('user/logout')
    // 跳转到登录页
    router.push('/login')
    return Promise.reject(error)
  }
  Message({
    type: 'error',
    message: error.message || '操作失败'
  })
  return Promise.reject(error)
})

// 导出
export default instance
