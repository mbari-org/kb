import { useCallback } from 'react'
import processToken from '@/lib/auth/processToken'
import useInvalidAuth from '@/contexts/user/lib/useInvalidAuth'

const useProcessAuth = (setUser, { onSuccess } = {}) => {
  const handleInvalidAuth = useInvalidAuth(setUser)

  return useCallback(
    anAuth => {
      if (!anAuth) return

      const { error: authError, user: authUser } = processToken(anAuth.token)
      if (authError) {
        handleInvalidAuth()
        return
      }

      setUser(authUser)
      if (onSuccess) onSuccess(authUser)
    },
    [handleInvalidAuth, onSuccess, setUser]
  )
}

export default useProcessAuth
