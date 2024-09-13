import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { clearAuth, getAuth } from "@/lib/auth/user"

const AuthContext = createContext()
AuthContext.displayName = "Auth Context"

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAuth().then(setUser)
  }, [])

  const logout = () => {
    clearAuth().then(setUser)
    navigate("/")
  }

  return (
    <AuthContext.Provider value={{ logout, navigate, setUser, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
