import { use } from 'react'
import { Outlet } from 'react-router-dom'
import ConfigContext from '@/contexts/config/ConfigContext'

import UserContext from '@/contexts/user/UserContext'
import StartUp from '@/components/startup/StartUp'

const AuthRoute = () => {
  const { config } = use(ConfigContext)
  const { user } = use(UserContext)
  return <>{user && config?.valid ? <Outlet /> : <StartUp />}</>
}

export default AuthRoute
