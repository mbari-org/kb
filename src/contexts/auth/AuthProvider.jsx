import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { decodeJwt } from "jose"

import AuthContext from "./AuthContext"

import authStore from "@/lib/store/auth"
import statusStore from "@/lib/store/status"

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [auth, setAuth] = useState(null)

  const updateAuth = someAuth => {
    const invalidAuth = () => {
      setAuth(null)
      authStore.clear()
      navigate("/login")
    }

    if (!someAuth) {
      return invalidAuth()
    }

    const { role: someRole, token, username: someUsername } = someAuth
    if (!token) {
      return invalidAuth()
    }

    const { role: authRole, name: authUsername } = decodeJwt(token)
    if (someRole !== authRole || someUsername !== authUsername) {
      return invalidAuth()
    }

    setAuth(someAuth)
    authStore.set(someAuth)

    navigate("/kb")
  }

  const logout = () => {
    authStore.clear()
    statusStore.clear()
    updateAuth(null)
    navigate("/login")
  }

  useEffect(() => {
    updateAuth(authStore.get())
    // updateAuth(authStore.get()) ? navigate("/kb") : navigate("/login")
  }, [])

  return (
    <AuthContext value={{ auth, logout, updateAuth }}>{children}</AuthContext>
  )
}

export default AuthProvider
