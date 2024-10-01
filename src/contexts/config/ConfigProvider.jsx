import { useEffect, useState } from "react"

import ConfigContext from "./ConfigContext"

import fetchEndpoints from "@/lib/services/config/fetchEndpoints"
import createServiceLookup from "@/lib/services/config/createServiceLookup"

import configUrlStore from "@/lib/store/configUrl"

const ConfigProvider = ({ children }) => {
  const [config, setStateConfig] = useState(null)

  const setConfig = async url => {
    if (url === null) {
      setStateConfig(null)
      configUrlStore.clear()
      return
    }

    configUrlStore.set(url)

    const { endpoints: allEndpoints, error } = await fetchEndpoints(url)

    if (!!allEndpoints) {
      const getServiceUrl = createServiceLookup(allEndpoints)

      setStateConfig({
        getServiceUrl,
        url,
        valid: true,
      })
    } else {
      setStateConfig({
        error,
        url,
        valid: false,
      })
    }
  }

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    setConfig(storedConfigUrl)
  }, [])

  return <ConfigContext value={{ config, setConfig }}>{children}</ConfigContext>
}

export default ConfigProvider
