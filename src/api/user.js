import request from '@/utils/request.js'

// 登录
export const userLoaingService = ({ mobile, password }) => request.post('/sys/login', { mobile, password })

// 用户相关 - 获取用户基本质料
export const userGetInfoService = () => request.get('/sys/profile')

// 用户相关 - 退出登录
export const userLogoutService = (data) => request.put('/sys/user/updatePass', data)
