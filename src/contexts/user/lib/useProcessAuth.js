import { useCallback } from 'react'
import processToken from '@/lib/auth/processToken'
import useInvalidAuth from '@/contexts/user/lib/useInvalidAuth'

const useProcessAuth = setUser => {
  const handleInvalidAuth = useInvalidAuth(setUser)

  return useCallback(
    anAuth => {
      if (!anAuth) {
        return
      }

      const { error: authError, user: authUser } = processToken(anAuth.token)
      if (authError) {
        handleInvalidAuth()
        return
      }

      setUser(authUser)
    },
    [handleInvalidAuth, setUser]
  )
}

export default useProcessAuth
