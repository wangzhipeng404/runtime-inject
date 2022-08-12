const xpe = {}
xpe.install = function (Vue) {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  const protectKeys = ['setMode', 'setCode', 'setStyle', 'openConsole', 'closeConsole']
  Vue.prototype.$xpe = {
    events: {},
    clean () {
      Object.keys(this.events).forEach(key => {
        if (!protectKeys.includes(key)) {
          delete this.events[key]
        }
      })
    },
    onece (key, callback) {
      if (!this.events[key]) {
        this.events[key] = (...args) => {
          callback(...args)
          delete this.events[key]
        }
      } else {
        console.log('key has been registered')
        throw new Error('key has been registered')
      }
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
      if (isAndroid && params) {
        params = JSON.stringify(params);
      }
      this.bridge('callEvent', name, params, null)
    },
    bridge (name, ...args) {
      if (!isAndroid) {
        window[`xpe_${name}`] && window[`xpe_${name}`](...args);
      } else {
        if (window.AIWebViewExtension && window.AIWebViewExtension[`page_xpe_${name}`]) {
          window.AIWebViewExtension[`page_xpe_${name}`](...args)
        } else if (window.SmartCommonWebViewExtension && window.SmartCommonWebViewExtension[`page_xpe_${name}`]) {
          window.SmartCommonWebViewExtension[`page_xpe_${name}`](...args)
        } else if (window.pageObject && window.pageObject[`page_xpe_${name}`]) {
          window.pageObject[`page_xpe_${name}`](...args)
        }
      }
    },
    getBaseUrl () {
      if (location.href.indexOf('localhost') !== -1) {
        return Promise.resolve(location.href)
      }
      if (window.__baseUrl) {
        return Promise.resolve(window.__baseUrl)
      }
      return new Promise((resovle) => {
        if (isAndroid) {
          window.excel_getBaseUrl = (success, errMsg, baseUrl) => {
            window.__baseUrl = baseUrl
            resovle(baseUrl)
          }
          window.SmartCommonWebViewExtension.page_xpe_getBaseUrl()
        } else {
          window.xpe_getBaseUrl((success, errMsg, baseUrl) => {
            window.__baseUrl = baseUrl
            resovle(baseUrl)
          })
        }
      })
    },
    getNativeData(params = {}) {
      const uuid = new Date().toString(16).substring(3)
      const newParams = { ...params, callbackid: uuid }
      return new Promise((resolve) => {
        this.onece(uuid, resolve)
        if (isAndroid) {
          if (!window.excel_getNativeData) {
            window.excel_getNativeData = (success, errMsg, data) => {
              this.run(data.callbackid, data)
            }
          }
          window.SmartCommonWebViewExtension.page_xpe_getNativeData(JSON.stringify(newParams), '')
        } else {
          window.xpe_getNativeData(JSON.stringify(newParams), (success, errMsg, data) => {
            resolve(data)
          })
        }
      })
    }
  }
}

export default xpe