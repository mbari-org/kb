import { useEffect, useState } from "react"

import configUrlStore from "@/lib/store/configUrl"
import fetchEndpoints from "@/lib/services/config/fetchEndpoints"

import ConfigContext from "@/components/config/ConfigContext"

const serviceNames = ["annosaurus", "oni"]

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null)
  const [endpoints, setEndpoints] = useState(null)

  const updateEndpoints = async url => {
    const { endpoints: allEndpoints, error } = await fetchEndpoints(url)

    setConfig({
      error,
      url,
      valid: !!allEndpoints,
    })

    if (!!allEndpoints) {
      const serviceEndpoints = allEndpoints
        .filter(endpoint => serviceNames.includes(endpoint.name))
        .reduce((acc, obj) => {
          acc.set(obj.name, obj)
          return acc
        }, new Map())

      setEndpoints(serviceEndpoints)
    }
  }

  const updateConfigUrl = async url => {
    if (url === null) {
      return { url }
    }
    configUrlStore.set(url)
    updateEndpoints(url)
  }

  const serviceUrl = (serviceName, path) => {
    if (!serviceNames.includes(serviceName)) {
      return { error: `Unknown service: ${serviceName}` }
    }
    const serviceEndpoint = endpoints?.get(serviceName)

    if (!serviceEndpoint) {
      return { error: `No endpoint info for service: ${serviceName}` }
    }

    return { url: `${serviceEndpoint.url}/${path}` }
  }

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    if (!!storedConfigUrl) {
      updateEndpoints(storedConfigUrl)
    }
  }, [])

  return (
    <ConfigContext value={{ config, serviceUrl, updateConfigUrl }}>
      {children}
    </ConfigContext>
  )
}

export default ConfigProvider
