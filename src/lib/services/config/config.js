import configUrlStore from "@/lib/store/configUrl"

import { endpointsConfig } from "./endpoints"

const submitConfigUrl = async (_prevState, formData) => {
  const formConfigUrl = formData.get("configUrl")

  return setConfigUrl(formConfigUrl)
}

const setConfigUrl = async url => {
  if (url === null) {
    return { url }
  }
  configUrlStore.set(url)
  return endpointsConfig(url)
}

export { setConfigUrl, submitConfigUrl }
