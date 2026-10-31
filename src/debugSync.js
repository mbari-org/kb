const entries = []
let el = null

const debugSync = (...args) => {
  console.debug(...args)
  if (!el) {
    el = document.createElement('div')
    el.style.cssText =
      'position:fixed;bottom:0;left:0;right:0;max-height:180px;overflow:auto;background:rgba(0,0,0,0.85);color:#7CFC00;font:11px/1.3 monospace;z-index:99999;white-space:pre-wrap;pointer-events:none;padding:4px'
    document.body.appendChild(el)
  }
  const line = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
  entries.push(line)
  if (entries.length > 40) entries.shift()
  el.textContent = entries.join('\n')
  el.scrollTop = el.scrollHeight
}

export default debugSync
