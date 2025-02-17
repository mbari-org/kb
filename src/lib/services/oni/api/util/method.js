import oniParams from './params'
import oniSend from './send'
import oniUrl from './url'

const oniMethod = method => async (config, path, data) => {
  const params = oniParams(method, data)
  const url = oniUrl(config, path)
  return oniSend(url, params)
}

export default oniMethod
