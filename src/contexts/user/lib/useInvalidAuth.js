import authStore from '@/lib/local/store/authStore'
import ConfigContext from '@/contexts/config/ConfigContext'
import { useCallback } from 'react'
import { use } from 'react'
import { useNavigate } from 'react-router-dom'

const useInvalidAuth = setUser => {
  const navigate = useNavigate()
  const { clearAuthenticatedConfig } = use(ConfigContext)

  return useCallback(() => {
    authStore.remove()
    clearAuthenticatedConfig()
    setUser(null)
    navigate('/kb')
  }, [clearAuthenticatedConfig, navigate, setUser])
}

export default useInvalidAuth
