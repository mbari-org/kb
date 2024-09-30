import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import _ from "lodash"

import AuthContext from "./AuthContext"

import appUser from "@/lib/store/appUser"
import auth from "@/lib/store/auth"

import { loggedInUser } from "@/lib/auth/login"

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const updateUser = update => {
    const updated = { ...user, ...update }

    if (!_.isEqual(user, update)) {
      appUser.set(updated)
      setUser(updated)
    }

    if (_.isEmpty(user)) {
      navigate("/kb")
    }
  }

  const logout = () => {
    auth.clear()
    appUser.clear()
    setUser(null)
    navigate("/login")
  }

  useEffect(() => {
    const storedUser = loggedInUser(user)
    setUser(storedUser)
    _.isEmpty(storedUser) ? navigate("/login") : navigate("/kb")
  }, [])

  return (
    <AuthContext value={{ logout, updateUser, user }}>{children}</AuthContext>
  )
}

export default AuthProvider
