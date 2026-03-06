import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'

import ConfigContext from './ConfigContext'

import createServiceLookup from '@/lib/services/config/createServiceLookup'
import getEndpoints from '@/lib/services/config/getEndpoints'
import useApiFns from '@/contexts/config/useApiFns'
import useAppPreferences from '@/contexts/config/useAppPreferences'

import configUrlStore from '@/lib/local/store/configUrl'
import { PREFS } from '@/lib/constants/prefs.js'

const IS_DEV = import.meta.env.DEV
const USE_M3_LOCAL = import.meta.env.VITE_M3_LOCAL ?? false
const appPhylogenyRootKey = PREFS.APP.PHYLOGENY.KEY
const defaultPhylogenyRoot = PREFS.APP.PHYLOGENY.ROOT

const ConfigProvider = ({ children }) => {
  const navigate = useNavigate()
  const { showBoundary } = useErrorBoundary()
  const [config, setConfig] = useState(null)
  const [apiFns, setApiFns] = useState(null)
  const [appPreferences, setAppPreferences] = useState({})
  const [appPreferencesInitialized, setAppPreferencesInitialized] = useState(false)
  const mountedRef = useRef(true)
  const appPreferencesInitializingRef = useRef(false)

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
  const { getAppPreference: loadAppPreference, saveAppPreference: persistAppPreference } = useAppPreferences({ config })

  useEffect(() => {
    setApiFns(apiFnsFromHook)
  }, [apiFnsFromHook])

  useEffect(() => {
    appPreferencesInitializingRef.current = false
    setAppPreferences({})
    setAppPreferencesInitialized(false)
  }, [config?.url])

  const getAppPreference = useCallback(
    async key => {
      const value = await loadAppPreference(key)
      setAppPreferences(prev => ({ ...prev, [key]: value }))
      return value
    },
    [loadAppPreference]
  )

  const saveAppPreference = useCallback(
    async (key, value) => {
      await persistAppPreference(key, value)
      setAppPreferences(prev => ({ ...prev, [key]: value }))
    },
    [persistAppPreference]
  )

  const initializeAppPreferences = useCallback(async () => {
    if (!config) return
    if (appPreferencesInitialized) return
    if (appPreferencesInitializingRef.current) return

    appPreferencesInitializingRef.current = true

    try {
      const appPhylogenyRoot = await getAppPreference(appPhylogenyRootKey)
      if (appPhylogenyRoot === null || appPhylogenyRoot === undefined) {
        await saveAppPreference(appPhylogenyRootKey, defaultPhylogenyRoot)
      }
      setAppPreferencesInitialized(true)
    } finally {
      appPreferencesInitializingRef.current = false
    }
  }, [appPreferencesInitialized, config, getAppPreference, saveAppPreference])

  const phylogenyRoot = appPreferences[appPhylogenyRootKey] ?? defaultPhylogenyRoot

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const value = useMemo(
    () => ({
      apiFns,
      appPreferencesInitialized,
      config,
      getAppPreference,
      initializeAppPreferences,
      IS_DEV,
      phylogenyRoot,
      saveAppPreference,
      updateConfig,
      USE_M3_LOCAL,
    }),
    [
      apiFns,
      appPreferencesInitialized,
      config,
      getAppPreference,
      initializeAppPreferences,
      phylogenyRoot,
      saveAppPreference,
      updateConfig,
    ]
  )

  return <ConfigContext value={value}>{children}</ConfigContext>
}

export default ConfigProvider
