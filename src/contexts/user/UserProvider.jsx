import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAuthUser from '@/contexts/user/lib/useAuthUser'
import useLogout from '@/contexts/user/lib/useLogout'
import useProcessAuth from '@/contexts/user/lib/useProcessAuth'
import useRefreshUser from '@/contexts/user/lib/useRefreshUser'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import useAppPreferences from '@/contexts/user/useAppPreferences'
import useUserPreferences from '@/contexts/user/useUserPreferences'
import { PREFS } from '@/lib/constants/prefs.js'

const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const appPhylogenyRootKey = PREFS.APP.PHYLOGENY.KEY
  const defaultPhylogenyRoot = PREFS.APP.PHYLOGENY.ROOT

  const { config } = use(ConfigContext)

  const [appPreferences, setAppPreferences] = useState({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [unsafeAction, setUnsafeAction] = useState(null)
  const [user, setUser] = useState(null)

  const mountedRef = useRef(true)
  const refreshingRef = useRef(false)
  const savePreferencesRef = useRef(null)

  const logout = useLogout(setUser, () => savePreferencesRef.current?.())

  const { getPreferences, createPreferences, updatePreferences } = useUserPreferences({ config, user })
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

  const phylogenyRoot = appPreferences[appPhylogenyRootKey] ?? defaultPhylogenyRoot

  const processAuth = useProcessAuth(setUser)
  const refreshUser = useRefreshUser({ setUser, user })

  useAuthUser({ logout, setUser, user })

  useEffect(() => {
    if (!config || !user) return

    const initializeAppPreferences = async () => {
      const appPhylogenyRoot = await getAppPreference(appPhylogenyRootKey)
      if (appPhylogenyRoot !== null && appPhylogenyRoot !== undefined) return

      await saveAppPreference(appPhylogenyRootKey, defaultPhylogenyRoot)
    }

    initializeAppPreferences().catch(error => {
      console.warn('App preference load failed:', error)
    })
  }, [appPhylogenyRootKey, config, defaultPhylogenyRoot, getAppPreference, saveAppPreference, user])

  useEffect(() => {
    if (!config || !user) return
    if (refreshingRef.current) return

    refreshingRef.current = true

    refreshUser()
      .then(() => {
        if (mountedRef.current && location.pathname !== '/kb') {
          navigate('/kb', { replace: true })
        }
      })
      .catch(error => {
        // Don't show error boundary for auth errors - they're handled by refreshUser
        // which calls handleInvalidAuth and navigates to login
        console.warn('User refresh failed:', error)
      })
      .finally(() => {
        refreshingRef.current = false
      })
  }, [config, refreshUser, user, navigate, location.pathname])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const value = useMemo(
    () => ({
      config,
      createPreferences,
      getAppPreference,
      getPreferences,
      hasUnsavedChanges,
      logout,
      phylogenyRoot,
      processAuth,
      refreshUser,
      savePreferencesRef,
      saveAppPreference,
      setHasUnsavedChanges,
      setUnsafeAction,
      unsafeAction,
      updatePreferences,
      user,
    }),
    [
      config,
      createPreferences,
      getAppPreference,
      getPreferences,
      hasUnsavedChanges,
      logout,
      phylogenyRoot,
      processAuth,
      refreshUser,
      saveAppPreference,
      setUnsafeAction,
      unsafeAction,
      updatePreferences,
      user,
    ]
  )
  return <UserContext value={value}>{children}</UserContext>
}

export default UserProvider
