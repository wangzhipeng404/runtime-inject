function injectIframe (content) {
  var css = content.document.createElement('style');
  css.type = 'text/css';
  css.innerHTML = 'body::-webkit-scrollbar { width: 0 }';
  content.document.getElementsByTagName('head')[0].appendChild(css);
  content.xpe_callEvent = function (name, params) {
    content.parent.postMessage({ key: name, data: params }, location.origin)
  }
  content.addEventListener('message', (e) => {
    if (!e.data.key) return
    console.log(content)
    content.xpe_reciveData(e.data, e.data.key)
  }, false)
}
console.log('inject js')