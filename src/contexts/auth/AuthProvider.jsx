import { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useErrorBoundary } from 'react-error-boundary'

import useAuthUser from '@/contexts/auth/lib/useAuthUser'
import useLogout from '@/contexts/auth/lib/useLogout'
import useProcessAuth from '@/contexts/auth/lib/useProcessAuth'
import useRefreshUser from '@/contexts/auth/lib/useRefreshUser'

import AuthContext from '@/contexts/auth/AuthContext'
import ConfigContext from '@/contexts/config/ConfigContext'

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const { showBoundary } = useErrorBoundary()

  const { config } = use(ConfigContext)

  const [user, setUser] = useState(null)

  const logout = useLogout(setUser)
  const processAuth = useProcessAuth(setUser)
  const refreshUser = useRefreshUser({ setUser, user })

  useAuthUser({ logout, setUser, user })

  useEffect(() => {
    if (!config) return
    if (!user) return

    refreshUser()
      .then(() => {
        navigate('/kb')
      })
      .catch(error => {
        showBoundary(error)
      })
    // None of config, navigate, refreshUser, showBoundary change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUser, user])

  return <AuthContext value={{ logout, processAuth, refreshUser, user }}>{children}</AuthContext>
}

export default AuthProvider
