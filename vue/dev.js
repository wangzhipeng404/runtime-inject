import Vue from './src/extend'


const Comp = () => import(process.env.VUE_APP_COMPONENT)

new Vue({
  render () {
    return <Comp />
  }
}).$mount('#app')
