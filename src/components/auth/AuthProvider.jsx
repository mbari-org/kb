import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import _ from "lodash"

import AuthContext from "@/components/auth/AuthContext"

import appUser from "@/lib/store/appUser"
import auth from "@/lib/store/auth"

import { loggedInUser } from "@/lib/auth/login"

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
    <AuthContext value={{ logout, updateUser, user }}>{children}</AuthContext>
  )
}

export default AuthProvider
