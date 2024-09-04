import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getAuth } from "@/lib/auth/user"

const AuthContext = createContext()
AuthContext.displayName = "Auth Context"

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAuth().then(setUser)
  }, [])

  return (
    <AuthContext.Provider value={{ navigate, setUser, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
