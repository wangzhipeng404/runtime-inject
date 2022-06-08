import Vue from 'vue'
import Vant, { ImagePreview } from 'vant';
import 'vant/lib/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import dayjs from 'dayjs'
import * as echarts from 'echarts';
import myRequire from './utils/require'
import xpe from './utils/xpe'

Vue.prototype.$echarts = echarts
Vue.use(Vant);
Vue.use(VueAxios, axios)
Vue.use(myRequire)
Vue.use(xpe)

Vue.prototype.$imagePreview = ImagePreview
Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs
Vue.prototype.$cache = new Map()

export default Vue
