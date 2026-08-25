import { isLocalConfigUrl, isLocalDevUrl, toConfigServiceUrl, toLocalDevUrl } from './localDevUrl'

const getEndpoints = async (url, token) => {
  try {
    // This allows the user's input for config server URL to be slashed or slashless
    const configUrl = isLocalConfigUrl(url) ? toConfigServiceUrl(url) : url.replace(/\/+$/, '')

    const configPath = isLocalDevUrl(configUrl)
      ? `${toLocalDevUrl(configUrl)}/endpoints`
      : `${configUrl}/endpoints`

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined

    const response = await fetch(configPath, {
      headers,
      method: 'GET',
      mode: 'cors',
    })
    if (response.status !== 200) {
      return { error: `Config service: ${response.status} ${response.statusText || 'Error'}` }
    }

    const endpoints = await response.json()

    endpoints.forEach(endpoint => {
      if (isLocalDevUrl(endpoint.url)) {
        endpoint.url = toLocalDevUrl(endpoint.url)
      }
    })

    return { endpoints }
  } catch (error) {
    const detail = error?.message ? ` (${error.message})` : ''
    return { error: `Config service: Failed access${detail}`, url }
  }
}

export default getEndpoints
