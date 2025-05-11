import router from '@/router'
import store from '@/store'
// 进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 白名单
const whiteList = ['/login', '/404']
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  // 有 token
  if (store.getters.token) {
    // 调用获取用户信息接口
    // await store.dispatch('user/getUserInfoStore')

    // 是登录页面，跳转到首页
    if (to.path === '/login') {
      next('/')
      nprogress.done()
    } else {
      // 否则放行
      next()
    }
  } else {
    // 没有 token
    if (whiteList.includes(to.path)) {
      // 是白名单，放行
      next()
    } else {
      // 否则跳转到登录页面
      next('/login')
      nprogress.done()
    }
  }
})

// 路由后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})
