import { use } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import AuthContext from '@/contexts/auth/AuthContext'

const AuthRoute = () => {
  const { user } = use(AuthContext)

  return <>{user ? <Outlet /> : <Navigate to='/login' />}</>
}

export default AuthRoute
