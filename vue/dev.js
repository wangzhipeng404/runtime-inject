import Vue from './src/extend'


const Comp = () => import(process.env.VUE_APP_COMPONENT)

new Vue({
  created () {
    this.axios.defaults.baseURL = '/api/teapi/dy-biz'
    this.axios.interceptors.request.use((config) => {
      config.headers.token = localStorage.getItem('token')
      return config
    })
    this.axios.interceptors.response.use((response) => {
      return response.data.resp_data;
    }, (error) => {
      const data = error.response.data
      this.$dialog.alert({
        title: '提示信息',
        message: data.error_code
      })
      return Promise.reject(error);
    });
  },
  render () {
    return <Comp />
  }
}).$mount('#app')
