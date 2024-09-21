import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import appUser from "@/lib/store/appUser"
import auth from "@/lib/store/auth"

const AuthContext = createContext()
AuthContext.displayName = "Auth Context"

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const updateUser = update => {
    setUser(user => {
      return !!user ? { ...user, ...update } : update
    })
  }

  const logout = () => {
    appUser.clear()
    auth.clear()
    navigate("/")
  }

  useEffect(() => {
    const storedUser = appUser.get()
    if (!!storedUser) {
      setUser(storedUser)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ logout, updateUser, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
