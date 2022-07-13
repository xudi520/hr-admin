import { login } from '@/api/user'
const state = {
  token: null
}
const mutations = {
  steTokne (state, payload) {
    state.token = payload
  }
}
const actions = {
  async login (context, data) {
    try {
      const res = await login(data)
      console.log(res)
      context.commit('steTokne', res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

