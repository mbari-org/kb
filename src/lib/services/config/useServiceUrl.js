import { use } from "react"

import ConfigContext from "@/components/config/ConfigContext"

const serviceNames = ["annosaurus", "oni"]

const useServiceUrl = (serviceName, path) => {
  const { config } = use(ConfigContext)

  if (!config) {
    return null
  }

  if (!config.valid) {
    return { error: `config for ${config.url} is not valid` }
  }

  if (!serviceNames.includes(serviceName)) {
    return { error: `Unknown service: ${serviceName}` }
  }
  const serviceEndpoint = config.endpoints.get(serviceName)

  if (!serviceEndpoint) {
    return {
      error: `${config.url} has no endpoint info for service: ${serviceName}`,
    }
  }

  return { url: `${serviceEndpoint.url}/${path}` }
}

export default useServiceUrl
