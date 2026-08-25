import {
  isLocalConfigUrl,
  isLocalDevUrl,
  toConfigServiceUrl,
  toLocalDevUrl,
} from '@/lib/services/config/localDevUrl'
const authUrl = (config, path = 'auth') => {
  if (!config?.url) {
    return { error: 'No config service URL configured' }
  }
  const configUrl = isLocalConfigUrl(config.url)
    ? toConfigServiceUrl(config.url)
    : config.url.replace(/\/+$/, '')
  const baseUrl = isLocalDevUrl(configUrl) ? toLocalDevUrl(configUrl) : configUrl
  return { url: `${baseUrl}/${path}` }
}

export default authUrl
