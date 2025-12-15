import { useCallback } from 'react'

import { clearStores } from '@/lib/local/store/clearStores'

const useLogout = (setUser, savePreferences) => {
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
  }, [savePreferences, setUser])
}

export default useLogout
