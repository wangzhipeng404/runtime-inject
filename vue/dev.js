import Vue from 'vue'
import Vant, { ImagePreview } from 'vant';
import 'vant/lib/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import dayjs from 'dayjs'
import * as echarts from 'echarts';
import myRequire from './src/utils/require'
import xpe from './src/utils/xpe'

Vue.prototype.$echarts = echarts
Vue.use(Vant);
Vue.use(VueAxios, axios)
Vue.use(myRequire)
Vue.use(xpe)

Vue.prototype.$imagePreview = ImagePreview
Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs
Vue.prototype.$cache = new Map()

const Comp = () => import(process.env.VUE_APP_COMPONENT)

new Vue({
  render () {
    return <Comp />
  }
}).$mount('#app')
