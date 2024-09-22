import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import _ from "lodash"

import appUser from "@/lib/store/appUser"
import auth from "@/lib/store/auth"

import { loggedInUser } from "@/lib/auth/login"

const AuthContext = createContext()
AuthContext.displayName = "Auth Context"

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const navigateToPanel = user => navigate(`/kb/${user.panel}`)

  const [user, setUser] = useState(null)

  const updateUser = update => {
    if (user === null) {
      setUser(update)
      return
    }

    if (!_.isEqual(user, update)) {
      const updated = { ...user, ...update }
      setUser(updated)
      appUser.set(updated)
      navigateToPanel(updated)
    }
  }

  const logout = () => {
    appUser.clear()
    auth.clear()
    navigate("/")
  }

  useEffect(() => {
    const storedUser = loggedInUser(user)
    setUser(storedUser)
    _.isEmpty(storedUser) ? navigate("/login") : navigateToPanel(storedUser)
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
