import Vue from './extend'
import * as Babel from '@babel/standalone'
import vuejsx from '@vue/babel-preset-jsx'
import mergeProps from '@vue/babel-helper-vue-jsx-merge-props'
import vconsole from 'vconsole'

Babel.registerPreset('vue-jsx', vuejsx)

new Vue({
  data: {
    styleStr: '',
    code: '',
    mode: 'prod',
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
          presets: ['es2015', 'vue-jsx'],
        }).code
        if (this.mode === 'dev') {
          console.log(code)
        }
        const fn = new Function ('mergeProps', `${code.replace('"use strict";\n', '').replace('require("@vue/babel-helper-vue-jsx-merge-props")', 'mergeProps')}\nreturn obj;`)
        temp = fn(mergeProps)
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
      if(data && typeof data == 'string'){
        data = JSON.parse(data);
      }
      if (self.$xpe.has(key)) {
        self.$xpe.run(key, data.data)
      }
    }
    this.$xpe.on('setMode', (data) => {
      this.mode = data
    })
    this.$xpe.on('setCode', (data) => {
      this.$xpe.clean()
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
    this.$xpe.emit('ready')
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
