import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { isTokenValid } from "@/lib/auth/user"

const AuthRoute = () => {
  const { user } = useAuth()

  return <>{!isTokenValid(user) ? <Navigate to="/login" /> : <Outlet />}</>
}

export default AuthRoute
