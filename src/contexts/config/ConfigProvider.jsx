import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'

import ConfigContext from './ConfigContext'

import createServiceLookup from '@/lib/services/config/createServiceLookup'
import getEndpoints from '@/lib/services/config/getEndpoints'
import validateConfigUrl from '@/lib/services/config/validateConfigUrl'
import createServiceTokenManager from '@/lib/services/auth/serviceTokens'
import useApiFns from '@/contexts/config/useApiFns'
import useAppPreferences from '@/contexts/config/useAppPreferences'

import configUrlStore from '@/lib/local/store/configUrl'
import authStore from '@/lib/local/store/authStore'
import { PREFS } from '@/lib/constants/prefs.js'

const IS_DEV = import.meta.env.DEV
const appMediaBaseURLKey = PREFS.APP.MEDIA.BASE_URL.KEY
const defaultMediaBaseURL = PREFS.APP.MEDIA.BASE_URL.DEFAULT
const appDsgConceptUrlKey = PREFS.APP.DSG.CONCEPT_URL.KEY
const defaultDsgConceptUrl = PREFS.APP.DSG.CONCEPT_URL.DEFAULT
const appPhylogenyRootKey = PREFS.APP.PHYLOGENY.ROOT.KEY
const defaultPhylogenyRoot = PREFS.APP.PHYLOGENY.ROOT.DEFAULT

const ConfigProvider = ({ children }) => {
  const navigate = useNavigate()
  const { showBoundary } = useErrorBoundary()
  const [config, setConfig] = useState(() => {
    const storedConfigUrl = configUrlStore.get()
    return storedConfigUrl ? { url: storedConfigUrl, valid: false } : null
  })
  const [appPreferences, setAppPreferences] = useState({})
  const [appPreferencesInitialized, setAppPreferencesInitialized] = useState(false)
  const mountedRef = useRef(true)
  const appPreferencesInitializingRef = useRef(false)

  const clearAuthenticatedConfig = useCallback(() => {
    setConfig(currentConfig => {
      currentConfig?.clearServiceTokens?.()
      return currentConfig ? { url: currentConfig.url, valid: false } : currentConfig
    })
  }, [])

  const updateConfig = useCallback(
    async url => {
      if (url === null) {
        appPreferencesInitializingRef.current = false
        setAppPreferences({})
        setAppPreferencesInitialized(false)
        clearAuthenticatedConfig()
        authStore.remove()
        setConfig(null)
        configUrlStore.remove()
        return
      }
      const { error } = await validateConfigUrl(url)
      if (error) return { error }

      appPreferencesInitializingRef.current = false
      setAppPreferences({})
      setAppPreferencesInitialized(false)
      clearAuthenticatedConfig()
      authStore.remove()

      configUrlStore.set(url)
      setConfig({ url, valid: false })
    },
    [clearAuthenticatedConfig]
  )
  const authenticateConfig = useCallback(async (auth, oniUserCredentials, readOnly = false) => {
    const url = configUrlStore.get()
    if (!url) throw new Error('No config service URL configured')

    const { endpoints, error } = await getEndpoints(url, auth.token)
    if (error) {
      const configError = new Error(error)
      if (mountedRef.current) setConfig({ error, url, valid: false })
      throw configError
    }

    const getServiceUrl = createServiceLookup(endpoints, url)
    const tokenManager = createServiceTokenManager({
      getServiceUrl,
      oniUserCredentials,
      razielToken: auth.token,
      readOnlyToken: readOnly ? auth.token : undefined,
    })
    const authenticatedConfig = {
      clearServiceTokens: tokenManager.clearServiceTokens,
      getServiceToken: tokenManager.getServiceToken,
      getServiceUrl,
      getOniUserToken: tokenManager.getOniUserToken,
      refreshOniUserToken: tokenManager.refreshOniUserToken,
      refreshServiceToken: tokenManager.refreshServiceToken,
      url,
      valid: true,
    }

    if (mountedRef.current) setConfig(authenticatedConfig)
    return { config: authenticatedConfig }
  }, [])

  useEffect(() => {
    if (!config) {
      navigate('/kb', { replace: true })
    }
  }, [config, navigate])

  const apiFnsFromHook = useApiFns(config?.valid ? config : null, showBoundary)
  const apiFns = apiFnsFromHook
  const { getAppPreference: loadAppPreference, saveAppPreference: persistAppPreference } = useAppPreferences({ config })

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
      const appMediaBaseURL = await getAppPreference(appMediaBaseURLKey)
      if (appMediaBaseURL === null || appMediaBaseURL === undefined) {
        await saveAppPreference(appMediaBaseURLKey, defaultMediaBaseURL)
      }
      const appDsgConceptUrl = await getAppPreference(appDsgConceptUrlKey)
      if (appDsgConceptUrl === null || appDsgConceptUrl === undefined) {
        await saveAppPreference(appDsgConceptUrlKey, defaultDsgConceptUrl)
      }
      const appPhylogenyRoot = await getAppPreference(appPhylogenyRootKey)
      if (appPhylogenyRoot === null || appPhylogenyRoot === undefined) {
        await saveAppPreference(appPhylogenyRootKey, defaultPhylogenyRoot)
      }
      setAppPreferencesInitialized(true)
    } finally {
      appPreferencesInitializingRef.current = false
    }
  }, [appPreferencesInitialized, config, getAppPreference, saveAppPreference])

  const mediaBaseURL = appPreferences[appMediaBaseURLKey] ?? defaultMediaBaseURL
  const dsgConceptUrl = appPreferences[appDsgConceptUrlKey] ?? defaultDsgConceptUrl
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
      authenticateConfig,
      clearAuthenticatedConfig,
      config,
      dsgConceptUrl,
      getAppPreference,
      initializeAppPreferences,
      IS_DEV,
      mediaBaseURL,
      phylogenyRoot,
      saveAppPreference,
      updateConfig,
    }),
    [
      apiFns,
      appPreferencesInitialized,
      authenticateConfig,
      clearAuthenticatedConfig,
      config,
      dsgConceptUrl,
      getAppPreference,
      initializeAppPreferences,
      mediaBaseURL,
      phylogenyRoot,
      saveAppPreference,
      updateConfig,
    ]
  )

  return <ConfigContext value={value}>{children}</ConfigContext>
}

export default ConfigProvider
