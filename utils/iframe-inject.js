function injectIframe (content) {
  var css = content.document.createElement('style');
  css.type = 'text/css';
  css.innerHTML = 'body::-webkit-scrollbar { width: 0 }';
  content.document.getElementsByTagName('head')[0].appendChild(css);
  var script = content.document.createElement('script')
  script.src = '../../../../lib/vant-touch-emulator.js'
  content.document.getElementsByTagName('head')[0].appendChild(script)
  content.xpe_callEvent = function (name, params) {
    content.parent.postMessage({ key: name, data: params }, location.origin)
  }
  content.addEventListener('message', (e) => {
    if (!e.data.key) return
    content.xpe_reciveData(e.data, e.data.key)
  }, false)
}