import Vue from './extend'
import vconsole from 'vconsole'
import Shell from './components/Shell';

Vue.use(Shell)

new Vue({
  data: {
    styleStr: '',
    code: '',
    mode: 'prod',
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
    return <Shell styleStr={this.styleStr} code={this.code} mode={this.mode} />
  },
}).$mount('#app')
