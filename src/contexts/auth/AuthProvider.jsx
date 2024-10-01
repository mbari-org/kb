import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import AuthContext from "./AuthContext"

import { isLoggedIn } from "@/lib/auth/login"

import authStore from "@/lib/store/auth"
import userStore from "@/lib/store/user"

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [auth, setAuth] = useState(null)

  useEffect(() => {
    const storedAuth = authStore.get()
    setAuth(storedAuth)
    isLoggedIn() ? navigate("/kb") : navigate("/login")
  }, [])

  const logout = () => {
    authStore.clear()
    userStore.clear()
    setAuth(null)
    navigate("/login")
  }

  return <AuthContext value={{ auth, logout, setAuth }}>{children}</AuthContext>
}

export default AuthProvider
