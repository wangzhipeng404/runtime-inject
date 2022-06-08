import Shell from './Shell.vue'

Shell.install = function (Vue) {
  Vue.component('shell', Shell)
}

export default Shell