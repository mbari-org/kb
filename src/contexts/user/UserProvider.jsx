import { use, useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAuthUser from '@/contexts/user/lib/useAuthUser'
import useLogout from '@/contexts/user/lib/useLogout'
import useProcessAuth from '@/contexts/user/lib/useProcessAuth'
import useRefreshUser from '@/contexts/user/lib/useRefreshUser'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import useUserPreferences from '@/contexts/user/useUserPreferences'

const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { config } = use(ConfigContext)

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [unsafeAction, setUnsafeAction] = useState(null)
  const [user, setUser] = useState(null)

  const mountedRef = useRef(true)
  const refreshingRef = useRef(false)
  const savePreferencesRef = useRef(null)

  const logout = useLogout(setUser, () => savePreferencesRef.current?.())

  const { getPreferences, createPreferences, updatePreferences } = useUserPreferences({ config, user })

  const processAuth = useProcessAuth(setUser)
  const refreshUser = useRefreshUser({ setUser, user })

  useAuthUser({ logout, setUser, user })

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
      getPreferences,
      hasUnsavedChanges,
      logout,
      processAuth,
      refreshUser,
      savePreferencesRef,
      setHasUnsavedChanges,
      setUnsafeAction,
      unsafeAction,
      updatePreferences,
      user,
    }),
    [
      config,
      createPreferences,
      getPreferences,
      hasUnsavedChanges,
      logout,
      processAuth,
      refreshUser,
      setUnsafeAction,
      unsafeAction,
      updatePreferences,
      user,
    ]
  )
  return <UserContext value={value}>{children}</UserContext>
}

export default UserProvider
