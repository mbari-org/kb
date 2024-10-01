import { use } from "react"
import { Navigate, Outlet } from "react-router-dom"

import AuthContext from "@/contexts/auth/AuthContext"

const AuthRoute = () => {
  const { auth } = use(AuthContext)

  return <>{!!auth ? <Outlet /> : <Navigate to="/login" />}</>
}

export default AuthRoute
