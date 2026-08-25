import { apiParams } from './params'
import apiSend from './send'
import apiUrl from './url'

const request = (service, method, tokenType = 'service') => async ({ config, data, path, qs }) => {
  let url = apiUrl(config, service, path)

  if (qs) {
    url = `${url}?${qs}`
  }
  const send = async token => apiSend(url, apiParams(method, data, token))

  try {
    const getToken =
      tokenType === 'user' ? config.getOniUserToken : () => config.getServiceToken(service)
    const refreshToken =
      tokenType === 'user' ? config.refreshOniUserToken : () => config.refreshServiceToken(service)
    let result = await send(await getToken())
    if (result.status === 401) {
      result = await send(await refreshToken())
    }
    return result
  } catch (error) {
    return {
      error: {
        message: error.message,
        title: 'Authentication Error',
      },
    }
  }
}

export default request
