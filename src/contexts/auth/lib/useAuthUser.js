import { useEffect } from 'react'

import processToken from '@/lib/auth/processToken'
import authStore from '@/lib/store/auth'

const useAuthUser = ({ logout, setUser, user }) => {
  useEffect(() => {
    if (user) return

    const auth = authStore.get()
    if (!auth) return

    const { error: authError, user: authUser } = processToken(auth.token)
    if (authError) {
      logout()
      return
    }
    setUser(authUser)
  }, [logout, setUser, user])
}

export default useAuthUser
