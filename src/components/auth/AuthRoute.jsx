import React from "react"
import { Navigate, Outlet } from "react-router-dom"

import { isLoggedIn } from "@/lib/auth/login"

const AuthRoute = () => (
  <>{isLoggedIn() ? <Outlet /> : <Navigate to="/login" />}</>
)

export default AuthRoute
