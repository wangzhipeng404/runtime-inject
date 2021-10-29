function injectIframe (content) {
  content.xpe_callEvent = function (name, params) {
    content.parent.postMessage({ key: name, data: params }, location.origin)
  }
  content.addEventListener('message', (e) => {
    const { data, key } = e.data
    if (!key) return
    content.xpe_reciveData(e.data, key)
  }, false)
}
window.injectIframe
console.log('inject js')