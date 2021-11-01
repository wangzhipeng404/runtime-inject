import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import * as Babel from '@babel/standalone'
import vjsx from 'babel-plugin-transform-vue-jsx'
import vconsole from 'vconsole'
import axios from 'axios'
import VueAxios from 'vue-axios'
import dayjs from 'dayjs'
import myRequire from './utils/require'
import xpe from './utils/xpe'

Babel.registerPlugin('transform-vue-jsx', vjsx)
Vue.use(Vant);
Vue.use(VueAxios, axios)
Vue.use(myRequire)
Vue.use(xpe)

Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs


new Vue({
  data: {
    styleStr: '',
    code: '',
  },
  computed: {
    style () {
      if (this.styleStr) {
        return window.stylus.render(this.styleStr)
      }
      return ''
    },
    component () {
      let temp = { template: '<van-skeleton :row="10" />' }
      if (!this.code) {
        return temp
      }
      try {
        const code = Babel.transform(`var obj = ${this.code}`, { 
          presets: ['es2015'],
          plugins: ['transform-vue-jsx'] 
        }).code
        temp = new Function (`${code.replace('"use strict";\n', '')} return obj; `)()
      } catch (e) {
        temp = {
          data () {
            return {
              msg: e
            }
          },
          render (h) {
            return h('div', {
              style: {
                color: 'red'
              }
            },
            JSON.stringify(e, null, 2))
          }
        }
      }
      return temp
    }
  },
  created () {
    this.$xpe.clean()
    const self = this
    window.xpe_reciveData = function(data, key){
      if(typeof data == 'string'){
        data = JSON.parse(data);
      }
      if (self.$xpe.has(key)) {
        self.$xpe.run(key, data.data)
      }
    }
    this.$xpe.on('setCode', (data) => {
      this.code = data
    })
    this.$xpe.on('setStyle', data => {
      this.styleStr = data
    })
    this.$xpe.on('openConsole', () => {
      if (!this.vconsole) {
        this.vconsole = new vconsole()
      }
    })
    this.$xpe.on('closeConsole', () => {
      if (this.vconsole) {
        this.vconsole.destroy()
        this.vconsole = null
      }
    })
    this.$xpe.emit('created')
  },
  mounted () {
    this.$xpe.emit('mounted')
  },
  render () {
    const Component = this.component
    return (
      <div>
        <style>{this.style}</style>
        <Component />
      </div>
    )
  },
}).$mount('#app')
