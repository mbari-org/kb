import { useCallback } from 'react'

import { clearStores } from '@/lib/local/store/clearStores'
import { createError } from '@/lib/errors'
import ConfigContext from '@/contexts/config/ConfigContext'
import { use } from 'react'

const useLogout = (setUser, savePreferences, onError) => {
  const { clearAuthenticatedConfig } = use(ConfigContext)
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
    clearAuthenticatedConfig()
    setUser(null)
  }, [clearAuthenticatedConfig, onError, savePreferences, setUser])
}

export default useLogout
