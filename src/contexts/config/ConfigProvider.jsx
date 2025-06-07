import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ConfigContext from './ConfigContext'

import createServiceLookup from '@/lib/services/config/createServiceLookup'
import getEndpoints from '@/lib/services/config/getEndpoints'

import configUrlStore from '@/lib/store/configUrl'

const ConfigProvider = ({ children }) => {
  const navigate = useNavigate()

  const [config, setConfig] = useState(null)
  const [apiFns, setApiFns] = useState(null)

  const updateConfig = async url => {
    if (url === null) {
      setConfig(null)
      configUrlStore.clear()
      return
    }

    configUrlStore.set(url)
    const { endpoints, error } = await getEndpoints(url)
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

  const barfOnError = error => {
    if (error) throw new Error(`${error.title}: ${error.message}\n${error.detail}`)
  }

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    if (storedConfigUrl) {
      getEndpoints(storedConfigUrl).then(({ endpoints, error }) => {
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
      navigate('/login')
    }
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!config) {
      setApiFns(null)
      return
    }

    const apiResult = config => async (apiRequest, params) => {
      const { error, result } = await apiRequest(config, params)
      barfOnError(error)
      return result
    }

    const apiPayload = config => async (payloadRequest, params) => {
      const { error, payload } = await payloadRequest(config, params)
      barfOnError(error)
      return payload
    }

    const apiPaginated = config => async (paginationRequest, params) => {
      // Even though the API returns limit and offset values, they simply echo the values sent by
      // the client. The values for limit and offset are maintained internally by the client itself.
      // So we can just return the payload content.
      const { error, payload } = await paginationRequest(config, params)
      barfOnError(error)
      return payload.content
    }

    setApiFns({
      apiPayload: apiPayload(config),
      apiResult: apiResult(config),
      apiPaginated: apiPaginated(config),
    })
  }, [config])

  return <ConfigContext value={{ apiFns, config, updateConfig }}>{children}</ConfigContext>
}

export default ConfigProvider
