import authStore from '@/lib/store/authStore'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const useInvalidAuth = setUser => {
  const navigate = useNavigate()

  return useCallback(() => {
    authStore.remove()
    setUser(null)
    navigate('/login')
    // navigate does not change, so no need to include it in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser])
}

export default useInvalidAuth
