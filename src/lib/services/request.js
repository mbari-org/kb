import apiParams from './params'
import apiSend from './send'
import apiUrl from './url'

const request = (service, method) => async (config, path, data) => {
  const params = apiParams(method, data)
  const url = apiUrl(config, service, path)
  return apiSend(url, params)
}

export default request
