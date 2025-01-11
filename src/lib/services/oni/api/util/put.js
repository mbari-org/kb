import oniParams from "./params"
import oniSend from "./send"
import oniUrl from "./url"

const oniPut = async (config, path, data) => {
  const params = oniParams("PUT", data)
  const url = oniUrl(config, path)
  return oniSend(url, params)
}

export default oniPut
