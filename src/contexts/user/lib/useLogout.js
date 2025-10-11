import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { clearStores } from '@/lib/store/clearStores'

const useLogout = (setUser, savePreferences) => {
  const navigate = useNavigate()

  return useCallback(async () => {
    try {
      if (savePreferences) {
        await savePreferences()
      }
    } catch (error) {
      console.error('Failed to save preferences on logout:', error)
    }
    clearStores()
    setUser(null)
    navigate('/login')
  }, [setUser, savePreferences])
}

export default useLogout
