import apiParams from './params'
import apiSend from './send'
import apiUrl from './url'

const request = (service, method) => async (config, path, data) => {
  const params = apiParams(method, data)
  let url = apiUrl(config, service, path)

  if (method === 'GET' && params.qs) {
    url = `${url}?${params.qs}`
    delete params.qs
  }

  return apiSend(url, params)
}

export default request
