import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import ConfigContext from "./ConfigContext"

import createServiceLookup from "@/lib/services/config/createServiceLookup"
import fetchEndpoints from "@/lib/services/config/fetchEndpoints"

import configUrlStore from "@/lib/store/configUrl"

const ConfigProvider = ({ children }) => {
  const navigate = useNavigate()

  const [config, setConfig] = useState(null)

  const updateConfig = async url => {
    if (url === null) {
      setConfig(null)
      configUrlStore.clear()
      return
    }

    configUrlStore.set(url)
    const { endpoints, error } = await fetchEndpoints(url)
    if (error) {
      setConfig({
        error,
        url,
        valid: false,
      })
      return
    }

    const getServiceUrl = createServiceLookup(endpoints)
    setConfig({
      getServiceUrl,
      url,
      valid: true,
    })
  }

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    if (storedConfigUrl) {
      fetchEndpoints(storedConfigUrl).then(({ endpoints, error }) => {
        if (error) {
          updateConfig(null)
        } else {
          const getServiceUrl = createServiceLookup(endpoints)
          setConfig({
            getServiceUrl,
            url: storedConfigUrl,
            valid: true,
          })
        }
      })
    } else {
      navigate("/login")
    }
  }, [navigate])

  return (
    <ConfigContext value={{ config, updateConfig }}>{children}</ConfigContext>
  )
}

export default ConfigProvider
