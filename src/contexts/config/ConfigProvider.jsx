import { useEffect, useState, useMemo, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'

import ConfigContext from './ConfigContext'

import createServiceLookup from '@/lib/services/config/createServiceLookup'
import getEndpoints from '@/lib/services/config/getEndpoints'

import configUrlStore from '@/lib/store/configUrl'

const ConfigProvider = ({ children }) => {
  const navigate = useNavigate()
  const { showBoundary } = useErrorBoundary()
  const [config, setConfig] = useState(null)
  const [apiFns, setApiFns] = useState(null)

  const updateConfig = useCallback(async url => {
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
  }, [])

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

    const apiPayload = config => async (payloadRequest, params) => {
      const { error, payload } = await payloadRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return payload
    }

    const apiPaginated = config => async (paginationRequest, params) => {
      // Even though the API returns limit and offset values, they simply echo the values sent by
      // the client. The values for limit and offset are maintained internally by the client itself.
      // So we can just return the payload content.
      const { error, payload } = await paginationRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return payload.content
    }

    const apiRaw = config => async (apiRequest, params) => apiRequest(config, params)

    const apiResult = config => async (apiRequest, params) => {
      const { error, result } = await apiRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return result
    }

    setApiFns({
      apiPayload: apiPayload(config),
      apiRaw: apiRaw(config),
      apiResult: apiResult(config),
      apiPaginated: apiPaginated(config),
    })
  }, [config, showBoundary])

  const value = useMemo(
    () => ({ apiFns, config, updateConfig }),
    [apiFns, config, updateConfig]
  )

  return <ConfigContext value={value}>{children}</ConfigContext>
}

export default ConfigProvider
