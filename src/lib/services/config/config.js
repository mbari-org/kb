import configUrlStore from "@/lib/store/configUrl"

import { fetchEndpoints } from "./endpoints"

const submitConfigUrl = async (_prevState, formData) => {
  const formConfigUrl = formData.get("configUrl")

  return setConfigUrl(formConfigUrl)
}

const setConfigUrl = async url => {
  if (url === null) {
    return { url }
  }
  configUrlStore.set(url)
  return fetchEndpoints(url)
}

export { setConfigUrl, submitConfigUrl }
