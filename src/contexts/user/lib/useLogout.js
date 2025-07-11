import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearStores } from '@/lib/store/clearStores'

const useLogout = setUser => {
  const navigate = useNavigate()

  return useCallback(() => {
    clearStores()
    setUser(null)
    navigate('/login')
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser])
}

export default useLogout
