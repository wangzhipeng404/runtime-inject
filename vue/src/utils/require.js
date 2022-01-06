const myRequire = {}
myRequire.install = function (Vue) {
  const __installed = {}
  Vue.prototype.$require = function (deps) {
    if (typeof deps === 'string') {
      deps = [deps]
    }
    const promises = deps.map(dep => {
      if (__installed[dep]) {
        return new Promise((resolve) => {
          resolve()
        })
      }
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = dep;
        const onScriptComplete = () => {
          __installed[dep] = true
          resolve()
        }
        script.onload = onScriptComplete
        script.onerror = () => {
          reject(`${dep} 加载失败`)
        }
        document.head.appendChild(script)
      })
    })
    return Promise.all(promises)
  }
}

export default myRequire
