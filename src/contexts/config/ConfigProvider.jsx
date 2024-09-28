import { useEffect, useState } from "react"

import ConfigContext from "@/contexts/config/ConfigContext"

import fetchEndpoints from "@/lib/services/config/fetchEndpoints"
import fetchConceptNames from "@/lib/services/oni/fetchConceptNames"
import createServiceUrl from "@/lib/services/config/createServiceUrl"

import configUrlStore from "@/lib/store/configUrl"

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null)

  const updateConfig = async url => {
    const { endpoints: allEndpoints, error } = await fetchEndpoints(url)

    if (!!allEndpoints) {
      const getServiceUrl = createServiceUrl(allEndpoints)
      const { url: conceptNamesUrl } = getServiceUrl("oni", "names")
      const conceptNamesFetch = await fetchConceptNames(conceptNamesUrl)

      setConfig({
        conceptNamesFetch,
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

  const setConfigUrl = async url => {
    if (url === null) {
      return { url }
    }
    configUrlStore.set(url)
    updateConfig(url)
  }

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    if (!!storedConfigUrl) {
      updateConfig(storedConfigUrl)
    }
  }, [])

  return (
    <ConfigContext value={{ config, setConfigUrl }}>{children}</ConfigContext>
  )
}

export default ConfigProvider
