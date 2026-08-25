const IS_DEV = import.meta.env.DEV
const LOCAL_HOSTNAMES = new Set(['127.0.0.1', '[::1]', 'localhost'])

const isLocalDevUrl = endpointUrl => {
  if (!IS_DEV) return false

  try {
    const { hostname, port, protocol } = new URL(endpointUrl)
    return LOCAL_HOSTNAMES.has(hostname) && (protocol === 'https:' || (protocol === 'http:' && !port))
  } catch {
    return false
  }
}
const isLocalConfigUrl = endpointUrl => {
  try {
    return LOCAL_HOSTNAMES.has(new URL(endpointUrl).hostname)
  } catch {
    return false
  }
}

const toConfigServiceUrl = endpointUrl => {
  const urlObj = new URL(endpointUrl)
  const pathname = urlObj.pathname.replace(/\/+$/, '') || '/config'
  return `${urlObj.origin}${pathname}${urlObj.search}`
}

const toLocalDevUrl = endpointUrl => {
  const urlObj = new URL(endpointUrl)
  const pathname = urlObj.pathname.replace(/\/+$/, '')
  return `${globalThis.location.origin}${pathname}${urlObj.search}`
}
export { isLocalConfigUrl, isLocalDevUrl, toConfigServiceUrl, toLocalDevUrl }
