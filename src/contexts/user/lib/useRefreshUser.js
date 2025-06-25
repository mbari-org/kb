import { use, useCallback } from 'react'

import useInvalidAuth from '@/contexts/user/lib/useInvalidAuth'
import useProcessAuth from '@/contexts/user/lib/useProcessAuth'

import { extract } from '@/lib/auth/refreshKey'
import { loginUser } from '@/lib/services/auth/login'
import authStore from '@/lib/store/authStore'

import tokenIsExpiring from './tokenIsExpiring'

import ConfigContext from '@/contexts/config/ConfigContext'

const useRefreshUser = ({ setUser, user }) => {
  const { config } = use(ConfigContext)

  const handleInvalidAuth = useInvalidAuth(setUser)
  const processAuth = useProcessAuth(setUser)

  return useCallback(() => {
    if (!tokenIsExpiring(user)) return Promise.resolve()

    return new Promise((resolve, reject) => {
      ;(async () => {
        try {
          const { refresh } = authStore.get()
          const userRefresh = await extract(refresh)
          if (userRefresh.error) throw userRefresh.error

          const { name } = user
          const { auth, error } = await loginUser(config, name, userRefresh.password)
          if (error) throw error

          processAuth(auth)
          resolve()
        } catch (error) {
          handleInvalidAuth()
          reject(error)
        }
      })()
    })
  }, [config, handleInvalidAuth, processAuth, user])
}

export default useRefreshUser
