const LOCAL_HOSTNAMES = new Set(['127.0.0.1', '[::1]', 'localhost'])

const isLocalDevUrl = endpointUrl => {
  try {
    const { hostname } = new URL(endpointUrl)
    return LOCAL_HOSTNAMES.has(hostname) || hostname === globalThis.location?.hostname
  } catch {
    return false
  }
}

const isLocalConfigUrl = endpointUrl => {
  try {
    const { hostname } = new URL(endpointUrl)
    return LOCAL_HOSTNAMES.has(hostname) || hostname === globalThis.location?.hostname
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
