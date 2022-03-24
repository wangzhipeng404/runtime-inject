const myRequire = {}
myRequire.install = function (Vue) {
  const __installed = {}
  Vue.prototype.$require = function (deps) {
    if (typeof deps === 'string') {
      deps = [deps]
    }
    const css = []
    const js = []
    deps.forEach(path => {
      const arr = path.split('.')
      const type = arr[arr.length - 1]
      if (type === 'css') {
        css.push(path)
      } else {
        js.push(path)
      }
    });
    const head = document.getElementsByTagName('head')[0];
    css.forEach(path => {
      const link = document.createElement('link');
      link.type='text/css';
      link.rel = 'stylesheet';
      link.href = path;
      head.appendChild(link);
    })
    const promises = js.map(dep => {
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
