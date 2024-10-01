import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { decodeJwt } from "jose"

import AuthContext from "./AuthContext"

import authStore from "@/lib/store/auth"
import userStore from "@/lib/store/user"

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [auth, setStateAuth] = useState(null)

  const setAuth = someAuth => {
    const invalid = () => {
      setStateAuth(null)
      authStore.clear()
      navigate("/login")
      // return false
    }

    if (!someAuth) {
      return invalid()
    }

    const { role: someRole, token, username: someUsername } = someAuth
    if (!token) {
      return invalid()
    }

    const { role: authRole, name: authUsername } = decodeJwt(token)
    if (someRole !== authRole || someUsername !== authUsername) {
      return invalid()
    }

    setStateAuth(someAuth)
    authStore.set(someAuth)

    navigate("/kb")
    // return true
  }

  const logout = () => {
    authStore.clear()
    userStore.clear()
    setAuth(null)
    navigate("/login")
  }

  useEffect(() => {
    setAuth(authStore.get())
    // setAuth(authStore.get()) ? navigate("/kb") : navigate("/login")
  }, [])

  return <AuthContext value={{ auth, logout, setAuth }}>{children}</AuthContext>
}

export default AuthProvider
