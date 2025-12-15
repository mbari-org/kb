import { use } from 'react'
import { Outlet } from 'react-router-dom'

import UserContext from '@/contexts/user/UserContext'
import StartUp from '@/components/startup/StartUp'

const AuthRoute = () => {
  const { user } = use(UserContext)

  return <>{user ? <Outlet /> : <StartUp />}</>
}

export default AuthRoute
