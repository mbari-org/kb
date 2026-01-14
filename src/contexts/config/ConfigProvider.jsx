import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'

import ConfigContext from './ConfigContext'

import createServiceLookup from '@/lib/services/config/createServiceLookup'
import getEndpoints from '@/lib/services/config/getEndpoints'
import useApiFns from '@/contexts/config/useApiFns'

import configUrlStore from '@/lib/local/store/configUrl'

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
        configUrlStore.remove()
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
        if (mountedRef.current) {
          setConfig(null)
          configUrlStore.remove()
          navigate('/kb', { replace: true })
        }
      })
    } else {
      navigate('/kb', { replace: true })
    }
  }, [loadConfig, navigate])

  const apiFnsFromHook = useApiFns(config?.valid ? config : null, showBoundary)

  useEffect(() => {
    setApiFns(apiFnsFromHook)
  }, [apiFnsFromHook])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const value = useMemo(
    () => ({ apiFns, config, isDev, updateConfig }),
    [apiFns, config, updateConfig]
  )

  return <ConfigContext value={value}>{children}</ConfigContext>
}

export default ConfigProvider
