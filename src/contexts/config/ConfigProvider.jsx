import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'

import ConfigContext from './ConfigContext'

import createServiceLookup from '@/lib/services/config/createServiceLookup'
import getEndpoints from '@/lib/services/config/getEndpoints'

import configUrlStore from '@/lib/store/configUrl'

// const isDev = import.meta.env.DEV
const isDev = true

const ConfigProvider = ({ children }) => {
  const navigate = useNavigate()
  const { showBoundary } = useErrorBoundary()
  const [config, setConfig] = useState(null)
  const [apiFns, setApiFns] = useState(null)
  const mountedRef = useRef(true)

  const loadConfig = useCallback(async (url, onError) => {
    try {
      const { endpoints, error } = await getEndpoints(url)

      if (!mountedRef.current) return

      if (error) {
        if (onError) {
          onError(error)
        } else {
          setConfig({
            error,
            url,
            valid: false,
          })
        }
        return
      }

      const getServiceUrl = createServiceLookup(endpoints)
      setConfig({
        getServiceUrl,
        url,
        valid: true,
      })
    } catch (err) {
      if (!mountedRef.current) return
      if (onError) {
        onError(err)
      } else {
        setConfig({
          error: err,
          url,
          valid: false,
        })
      }
    }
  }, [])

  const updateConfig = useCallback(
    async url => {
      if (url === null) {
        setConfig(null)
        configUrlStore.clear()
        return
      }

      configUrlStore.set(url)
      await loadConfig(url)
    },
    [loadConfig]
  )

  useEffect(() => {
    const storedConfigUrl = configUrlStore.get()
    if (storedConfigUrl) {
      loadConfig(storedConfigUrl, () => {
        // On error, clear config and navigate to login
        if (mountedRef.current) {
          setConfig(null)
          configUrlStore.clear()
          navigate('/login')
        }
      })
    } else {
      navigate('/login')
    }
    // navigate and loadConfig are stable, no need to include in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createApiFns = useCallback((config, showBoundary) => {
    const apiPayload = async (payloadRequest, params) => {
      const { error, payload } = await payloadRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return payload
    }

    const apiPaginated = async (paginationRequest, params) => {
      // Even though the API returns limit and offset values, they simply echo the values sent by
      // the client. The values for limit and offset are maintained internally by the client itself.
      // So we can just return the payload content.
      const { error, payload } = await paginationRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return payload.content
    }

    const apiRaw = async (apiRequest, params) => apiRequest(config, params)

    const apiResult = async (apiRequest, params) => {
      const { error, result } = await apiRequest(config, params)
      if (error) {
        showBoundary(error)
      }
      return result
    }

    return {
      apiPayload,
      apiRaw,
      apiResult,
      apiPaginated,
    }
  }, [])

  useEffect(() => {
    if (!config?.valid) {
      setApiFns(null)
      return
    }

    setApiFns(createApiFns(config, showBoundary))
  }, [config, showBoundary, createApiFns])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const value = useMemo(
    () => ({ apiFns, config, isDev, updateConfig }),
    [apiFns, config, isDev, updateConfig]
  )

  return <ConfigContext value={value}>{children}</ConfigContext>
}

export default ConfigProvider
