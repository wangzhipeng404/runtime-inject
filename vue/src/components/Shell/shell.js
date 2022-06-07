import Vue from 'vue'

import Shell from './Shell.vue'

new Vue({
  data: {
    code: '{ render () { return <div class="color-blue">shell</div> } }',
    styleStr: `
.color-blue
  color blue
`
  },
  render () {
    return <Shell styleStr={this.styleStr} code={this.code} />
  }
}).$mount('#app')