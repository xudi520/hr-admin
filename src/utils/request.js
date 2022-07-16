import axios from 'axios'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
import router from '@/router'
// vuex 和本地存储
// 1.vuex数据是响应式的，实时跟新的而本地存储需要童话手动跟新
// 2.速度vuex更块，应为vuex数据存在内存中 本地存储在文件中，获取时间man
import store from '@/store'
// 创建一个axios的实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const token = store.state.user.token
  if (token) {
    // 判断token是不是有俩小时如果有就要重新登录
    const time = Date.now() - getTime()
    // 2 * 60 * 60 * 1000
    if (time > 2 * 60 * 60 * 1000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    // config.headers = {
    //   Authorization: 'Bearer ' + token
    // }
    config.headers['Authorization'] = 'Bearer ' + token
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    const { data, success, message } = response.data
    // console.log(data, 1)
    // console.log(success, 2)
    // console.log(message, 3)
    // 对响应数据做点什么
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  function (error) {
    console.dir(error)
    if (error.response && error.response.data && error.response.data.dode === 10002) {
      store.dispatch('user/login')
      router.push('/login')
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default request
