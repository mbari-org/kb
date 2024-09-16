import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { clearAuth, getAuth, setAuth } from "@/lib/auth/user"

const AuthContext = createContext()
AuthContext.displayName = "Auth Context"

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  const updateUser = async update => {
    const auth = await getAuth()
    setAuth({ ...auth, ...update })

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
    <AuthContext.Provider value={{ logout, setUser, updateUser, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
