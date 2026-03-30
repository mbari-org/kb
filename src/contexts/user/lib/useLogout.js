import { useCallback } from 'react'

import { clearStores } from '@/lib/local/store/clearStores'
import { createError } from '@/lib/errors'

const useLogout = (setUser, savePreferences, onError) => {
  return useCallback(async () => {
    try {
      if (savePreferences) {
        await savePreferences()
      }
    } catch (error) {
      onError?.(
        createError(
          'Preferences Save Error',
          'Failed to save preferences on logout',
          { scope: 'logout' },
          error
        )
      )
    }
    clearStores()
    setUser(null)
  }, [onError, savePreferences, setUser])
}

export default useLogout
