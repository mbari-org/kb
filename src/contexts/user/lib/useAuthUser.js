import { useEffect } from 'react'

import authStore from '@/lib/local/store/authStore'

const useAuthUser = ({ processAuth, user }) => {
  useEffect(() => {
    if (user) return

    const auth = authStore.get()
    if (!auth) return

    processAuth(auth)
  }, [processAuth, user])
}

export default useAuthUser
