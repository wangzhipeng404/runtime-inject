<script>
import * as Babel from '@babel/standalone'
import vuejsx from '@vue/babel-preset-jsx'
import mergeProps from '@vue/babel-helper-vue-jsx-merge-props'
import { render } from 'stylus'

Babel.registerPreset('vue-jsx', vuejsx)

export default {
  props: {
    styleStr: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'prod'
    }
  },
  computed: {
    style () {
      if (this.styleStr) {
        return render(this.styleStr)
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
  render () {
    const Component = this.component
    return (
      <div>
        <style>{this.style}</style>
        <Component />
      </div>
    )
  },
}
</script>