import Vue from 'vue'
// 第三方 css库 让不同的浏览器渲染效果一致
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 公共样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control 权限控制

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 假数据 mock
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN 中英文
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 注释控制台生产报错
Vue.config.productionTip = false
// 没图片显示自定义图片
// import '@/directives'
import * as obj from '@/directives'
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})

// 处理时间
import * as filters from '@/filters'
// Object.keys 获取对象的属性名放到数组中
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
// 什么时候哟个插件?当我们封装了一堆公共组件供同事使用的时候 为了让同事使用起来方便
import components from '@/components'
// 会自动执行install方法
Vue.use(components)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
