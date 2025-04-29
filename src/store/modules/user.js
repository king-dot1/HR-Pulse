import { setToken, getToken, removeToken } from '@/utils/auth.js'
import { userLoaingService, userGetInfoService } from '@/api/user'
import { Message } from 'element-ui'

// 存储数据
const state = {
  token: getToken(), // 从本地获取 token
  userInfo: {} // 用户基本信息
}

// 修改数据
const mutations = {
  setToken(state, token) {
    state.token = token
    // 本地持久化，同步数据
    setToken(token)
  },

  removeToken(state) {
    // 移除数据
    state.token = null
    removeToken()
  },

  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

// 异步操作
const actions = {
  // 登录
  async login(context, data) {
    // 发起请求， 获取 token
    const res = await userLoaingService(data)
    context.commit('setToken', res.data)
    // 提示
    Message({
      message: res.message,
      type: 'success'
    })
  },

  // 获取用户基本信息
  async getUserInfoStore(context, state) {
    const res = await userGetInfoService()
    context.commit('setUserInfo', res.data)
  },

  // 退出
  logout(context) {
    // 清除 token、用户信息
    context.commit('removeToken')
    context.commit('setUserInfo', {})
  }
}

// 基于 state 的计算属性
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
