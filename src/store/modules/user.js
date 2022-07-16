// 用户信息
import { login, getInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  steUserInfo (state, payload) {
    state.userInfo = payload
  },
  // 清空token
  removeToken (state) {
    state.token = null
    removeToken()
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    const res = await login(data)
    // console.log(res)
    context.commit('setToken', res)
    setToken(res)
    setTime(Date.now())
    //! 拦截器分装了
    // if (res.data.success) {
    //   context.commit('steTokne', res.data.data)
    // } else {
    // 密码错误给 抛出 才能到login catch
    //   return Promise.reject(new Error(res.data.message))
    // }
  },
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    // console.log(res1, 1)
    // console.log(res, 2)
    context.commit('steUserInfo', { ...res, ...res1 })
  },

  logout (context) {
    context.commit('removeToken')// 删除token
    context.commit('removeUserInfo')// 删除用户资料
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

