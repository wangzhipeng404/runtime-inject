const xpe = {}
xpe.install = function (Vue) {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  Vue.prototype.$xpe = {
    events: {},
    clean (keys = []) {
      keys.forEach(key => {
        if (this.events[key]) {
          delete this.events[key]
        }
      })
    },
    on (key, callback) {
      if (!this.events[key]) {
        this.events[key] = callback
      } else {
        console.log('key has been registered')
        throw new Error('key has been registered')
      }
    },
    off (key) {
      if (this.events[key]) {
        this.events[key] = undefined
      } else {
        console.warn('unregistered key')
        // throw new Error('unregistered key')
      }
    },
    run (key, data) {
      if (this.events[key]) {
        this.events[key](data)
      } else {
        console.warn('key not find')
        // throw new Error('key not find')
      }
    },
    has (key) {
      return !!this.events[key]
    },
    emit (name, params = null) {
      if (!isAndroid) {
        window.xpe_callEvent && window.xpe_callEvent(name, params, null);
      } else {
        if (params) {
          params = JSON.stringify(params);
        }
        window.pageObject.page_xpe_callEvent(name,params,null);
      }
    }
  }
}

export default xpe