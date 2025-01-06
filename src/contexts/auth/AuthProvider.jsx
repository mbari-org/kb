import { use, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import ConfigContext from "@/contexts/config/ConfigContext"
import AuthContext from "./AuthContext"

import { isRole, validateAuth } from "@/lib/services/oni/auth/validate"

import authStore from "@/lib/store/auth"
import selectedStore from "@/lib/store/selected"

const AuthProvider = ({ children }) => {
  const { config } = use(ConfigContext)

  const navigate = useNavigate()

  const [auth, setAuth] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMaint, setIsMaint] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)

  const handleInvalidAuth = useCallback(() => {
    setAuth(null)
    authStore.clear()
    navigate("/login")
  }, [navigate])

  const updateAuth = useCallback(
    anAuth => {
      if (validateAuth(anAuth)) {
        setAuth(anAuth)
        authStore.set(anAuth)

        const admin = isRole("admin")
        const maint = isRole("maint")
        setIsAdmin(admin)
        setIsMaint(maint)
        setIsReadOnly(!admin && !maint)

        navigate("/kb")
      } else {
        handleInvalidAuth()
      }
    },
    [handleInvalidAuth, navigate]
  )

  const logout = () => {
    authStore.clear()
    selectedStore.clear()
    updateAuth(null)
    navigate("/login")
  }

  useEffect(() => {
    if (config) {
      config.valid ? updateAuth(authStore.get()) : handleInvalidAuth()
    }
  }, [config, handleInvalidAuth, updateAuth])

  return (
    <AuthContext
      value={{ auth, isAdmin, isMaint, isReadOnly, logout, updateAuth }}
    >
      {children}
    </AuthContext>
  )
}

export default AuthProvider
