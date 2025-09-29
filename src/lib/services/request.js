import { apiParams } from './params'
import apiSend from './send'
import apiUrl from './url'

const request = (service, method) => async ({ config, data, path, qs }) => {
  const params = apiParams(method, data)
  let url = apiUrl(config, service, path)

  if (qs) {
    url = `${url}?${qs}`
  }

  return apiSend(url, params)
}

export default request
