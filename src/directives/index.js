// import Vue from 'vue'
// 没图片显示自定义图片
// 自定义指令
// const imgerror = {
// 指令所在的标签插入到DOM中的时候就会执行
// inserted (el, binding) {
// el.src = binding.value
//   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
// },
// 数据更新的时候就执行
// update (el, binding) {
// el.src = binding.value
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// }
// Vue.directive('imgerror', imgerror)
// 分装的img替代图片
export const imgerror = {
  inserted (el, binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
