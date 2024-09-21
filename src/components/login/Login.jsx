import { Navigate } from "react-router-dom"

import { useAuth } from "@/components/auth/AuthProvider"

import LoginForm from "@/components/login/loginForm"

const Login = () => {
  const { user } = useAuth()
  return !!user ? <Navigate to="/kb" /> : <LoginForm />
}

export default Login
