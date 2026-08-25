import { isLocalConfigUrl, isLocalDevUrl, toConfigServiceUrl, toLocalDevUrl } from './localDevUrl'

const validateConfigUrl = async url => {
  const configUrl = isLocalConfigUrl(url) ? toConfigServiceUrl(url) : url.replace(/\/+$/, '')
  const healthUrl = isLocalDevUrl(configUrl)
    ? `${toLocalDevUrl(configUrl)}/health`
    : `${configUrl}/health`

  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      mode: 'cors',
    })
    if (response.status !== 200) {
      return {
        error: `Config service: ${response.status} ${response.statusText || 'Error'}`,
      }
    }
    return {}
  } catch (error) {
    const detail = error?.message ? ` (${error.message})` : ''
    return { error: `Config service: Failed access${detail}`, url }
  }
}

export default validateConfigUrl
