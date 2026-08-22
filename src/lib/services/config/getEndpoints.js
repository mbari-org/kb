const IS_DEV = import.meta.env.DEV

const toLocalDevUrl = endpointUrl => {
  const urlObj = new URL(endpointUrl)
  // Route service calls through the Vite dev-server proxy so the browser never
  // has to trust the local quickstart self-signed certificate.
  return `${globalThis.location.origin}${urlObj.pathname}${urlObj.search}`
}

const getEndpoints = async url => {
  try {
    // This allows the user's input for config server URL to be slashed or slashless
    const slashlessUrl = url.replace(/\/+$/, '')

    // In Vite dev, always go through the same-origin proxy. Direct browser calls to
    // https://localhost fail with net::ERR_CERT_AUTHORITY_INVALID on self-signed certs.
    const configPath = IS_DEV
      ? `${globalThis.location.origin}/config/endpoints`
      : `${slashlessUrl}/endpoints`

    const response = await fetch(configPath, {
      method: 'GET',
      mode: 'cors',
    })
    if (response.status !== 200) {
      return { error: `Config service: ${response.status} ${response.statusText || 'Error'}` }
    }

    const endpoints = await response.json()

    if (IS_DEV) {
      endpoints.forEach(endpoint => {
        endpoint.url = toLocalDevUrl(endpoint.url)
      })
    }

    return { endpoints }
  } catch (error) {
    const detail = error?.message ? ` (${error.message})` : ''
    return { error: `Config service: Failed access${detail}`, url }
  }
}

export default getEndpoints
