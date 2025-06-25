import { use } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import UserContext from '@/contexts/user/UserContext'

const AuthRoute = () => {
  const { user } = use(UserContext)

  return <>{user ? <Outlet /> : <Navigate to='/login' />}</>
}

export default AuthRoute
