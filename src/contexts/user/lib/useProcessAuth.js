import { useCallback } from 'react'
import { use } from 'react'
import { extract } from '@/lib/auth/refreshKey'
import processToken from '@/lib/auth/processToken'
import useInvalidAuth from '@/contexts/user/lib/useInvalidAuth'
import ConfigContext from '@/contexts/config/ConfigContext'
import authStore from '@/lib/local/store/authStore'
import { oniGet } from '@/lib/services/oni/methods'
import { createError } from '@/lib/errors'
import { ROLES } from '@/lib/constants/roles.js'

const useProcessAuth = (setUser, { onSuccess } = {}) => {
  const handleInvalidAuth = useInvalidAuth(setUser)
  const { authenticateConfig } = use(ConfigContext)

  return useCallback(
    async (anAuth, oniUserCredentials) => {
      if (!anAuth?.token) {
        handleInvalidAuth()
        return { error: createError('Authentication Error', 'Missing authentication token') }
      }

      try {
        const { error: authError, user: tokenUser } = processToken(anAuth.token)
        if (authError) throw new Error(authError)
        const isReadOnly = tokenUser.role === ROLES.READ_ONLY
        const credentials =
          oniUserCredentials ||
          (isReadOnly
            ? undefined
            : await extract(anAuth.refresh).then(({ error, password }) => {
                if (error) throw new Error(error)
                return { password, username: tokenUser.name }
              }))
        const { config } = isReadOnly
          ? await authenticateConfig(anAuth, credentials, true)
          : await authenticateConfig(anAuth, credentials)
        const profile = isReadOnly
          ? {}
          : await oniGet({
              config,
              path: ['users', tokenUser.name],
            }).then(({ error: profileError, payload }) => {
              if (profileError) throw profileError
              const userProfile = { ...payload }
              delete userProfile.password
              return userProfile
            })
        delete profile.password
        const authUser = {
          ...tokenUser,
          ...profile,
          name: profile.username || profile.name || tokenUser.name,
        }

        authStore.set(anAuth)
        setUser(authUser)
        if (onSuccess) onSuccess(authUser)
        return { auth: anAuth }
      } catch (error) {
        handleInvalidAuth()
        return {
          error: error?.title
            ? error
            : createError('Authentication Error', error.message || 'Authentication failed', {}, error),
        }
      }
    },
    [authenticateConfig, handleInvalidAuth, onSuccess, setUser]
  )
}

export default useProcessAuth
