import { use, useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAuthUser from '@/contexts/user/lib/useAuthUser'
import useLogout from '@/contexts/user/lib/useLogout'
import useProcessAuth from '@/contexts/user/lib/useProcessAuth'
import useRefreshUser from '@/contexts/user/lib/useRefreshUser'

import UserContext from '@/contexts/user/UserContext'
import ConfigContext from '@/contexts/config/ConfigContext'

const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { config } = use(ConfigContext)

  const [user, setUser] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const mountedRef = useRef(true)
  const refreshingRef = useRef(false)

  const logout = useLogout(setUser)
  const processAuth = useProcessAuth(setUser)
  const refreshUser = useRefreshUser({ setUser, user })

  useAuthUser({ logout, setUser, user })

  useEffect(() => {
    if (!config || !user) return
    if (refreshingRef.current) return // Prevent concurrent refresh attempts

    refreshingRef.current = true

    refreshUser()
      .then(() => {
        if (mountedRef.current && location.pathname !== '/kb') {
          navigate('/kb')
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
      logout,
      processAuth,
      refreshUser,
      user,
      hasUnsavedChanges,
      setHasUnsavedChanges,
    }),
    [logout, processAuth, refreshUser, user, hasUnsavedChanges]
  )

  return <UserContext value={value}>{children}</UserContext>
}

export default UserProvider
