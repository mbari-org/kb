import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/components/auth/AuthProvider"
import { isTokenValid } from "@/lib/auth/user"

import LoginForm from "@/components/login/loginForm"

const Login = () => {
  const { user } = useAuth()

  if (isTokenValid(user)) {
    return <Navigate to="/kb" />
  }
  return <LoginForm />
}

export default Login
