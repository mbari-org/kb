import { use, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import AuthContext from "./AuthContext"
import ConfigContext from "@/contexts/config/ConfigContext"

import processToken from "@/lib/auth/processToken"
import { extract } from "@/lib/auth/refresh"
import login from "@/lib/services/oni/auth/login"
import authStore from "@/lib/store/auth"
import selectedStore from "@/lib/store/selected"

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const { config } = use(ConfigContext)

  const [user, setUser] = useState(null)

  const handleInvalidAuth = useCallback(() => {
    authStore.clear()

    setUser(null)
    navigate("/login")
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const processAuth = useCallback(
    anAuth => {
      if (!anAuth) {
        return
      }

      const { error: authError, user: authUser } = processToken(anAuth.token)
      if (authError) {
        handleInvalidAuth()
        return
      }

      setUser(authUser)
    },
    [handleInvalidAuth]
  )

  const logout = useCallback(() => {
    authStore.clear()
    selectedStore.clear()
    setUser(null)
    navigate("/login")
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user) return

    const auth = authStore.get()
    if (!auth) return

    const { error: authError, user: authUser } = processToken(auth.token)
    if (authError) {
      logout()
      return
    }
    setUser(authUser)
  }, [logout, user])

  useEffect(() => {
    if (!config) return
    if (!user) return

    const { expiry, name } = user
    const currentTime = Date.now() / 1000
    if (currentTime < expiry) {
      navigate("/kb")
      return
    }

    const { refresh } = authStore.get()
    extract(refresh).then(userRefresh => {
      if (userRefresh.error) {
        handleInvalidAuth()
        return
      }

      login(config, name, userRefresh.password).then(({ auth, error }) => {
        if (error) {
          handleInvalidAuth()
          return
        }
        processAuth(auth)
      })
    })
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, handleInvalidAuth, processAuth, user])

  return (
    <AuthContext value={{ logout, processAuth, user }}>{children}</AuthContext>
  )
}

export default AuthProvider
