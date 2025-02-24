import authStore from '@/lib/store/auth'
import selectedStore from '@/lib/store/selected'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const useLogout = setUser => {
  const navigate = useNavigate()

  return useCallback(() => {
    authStore.clear()
    selectedStore.clear()
    setUser(null)
    navigate('/login')
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser])
}

export default useLogout
