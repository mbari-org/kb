import { useEffect, useState } from "react"

import ConfigContext from "./ConfigContext"

import fetchEndpoints from "@/lib/services/config/fetchEndpoints"
import createServiceLookup from "@/lib/services/config/createServiceLookup"

import configUrlStore from "@/lib/store/configUrl"

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null)

  const updateConfig = async url => {
    if (url === null) {
      setConfig(null)
      configUrlStore.clear()
      return
    }

    configUrlStore.set(url)

    const { endpoints: allEndpoints, error } = await fetchEndpoints(url)

    if (!!allEndpoints) {
      const getServiceUrl = createServiceLookup(allEndpoints)

      setConfig({
        getServiceUrl,
        url,
        valid: true,
      })
    } else {
      setConfig({
        error,
        url,
        valid: false,
      })
    }
  }

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    updateConfig(storedConfigUrl)
  }, [])

  return (
    <ConfigContext value={{ config, updateConfig }}>{children}</ConfigContext>
  )
}

export default ConfigProvider
