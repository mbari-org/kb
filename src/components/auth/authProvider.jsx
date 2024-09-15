import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { clearAuth, getAuth } from "@/lib/auth/user"

const UserContext = createContext()
UserContext.displayName = "User Context"

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const updateUser = update => {
    setUser(prevUser => {
      return !!prevUser ? { ...prevUser, ...update } : update
    })
  }

  const logout = () => {
    clearAuth().then(setUser)
    navigate("/")
  }

  useEffect(() => {
    getAuth().then(setUser)
  }, [])

  return (
    <UserContext.Provider
      value={{ logout, navigate, setUser, updateUser, user }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(UserContext)
}
