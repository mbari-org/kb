import authStore from '@/lib/local/store/authStore'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const useInvalidAuth = setUser => {
  const navigate = useNavigate()

  return useCallback(() => {
    authStore.remove()
    setUser(null)
    navigate('/kb')
  }, [navigate, setUser])
}

export default useInvalidAuth
