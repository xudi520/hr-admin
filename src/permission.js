
// 路由守卫
import router from '@/router'
import store from '@/store'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 白名单默认所有人是坏人 这几个是好人
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach((to, form, next) => {
  // 开启进度效果
  NProgress.start()
  // next()
  const token = store.state.user.token
  // console.log(store.state)
  if (token) {
    // 如果登录了 就不能再去登录
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      // 优化 这块只会发起一次ajax请求
      if (!store.state.user.userInfo.id) {
        // 当用户手里面有token 并且访问的不是login页面那就应该请求个人资料
        store.dispatch('user/getInfo')
      }
      next()// 放 行
    }
  } else {
    // includes 包括
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach((to, form, next) => {
  // 结束进度效果
  NProgress.done()
})
