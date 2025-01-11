import oniParams from "./params"
import oniSend from "./send"
import oniUrl from "./url"

const oniGet = async (config, path) => {
  const params = oniParams("GET")
  const url = oniUrl(config, path)
  return oniSend(url, params)
}

export default oniGet
