import { useCallback } from 'react'

import {
  createPreferences as apiCreatePreferences,
  getPreferences as apiGetPreferences,
  updatePreferences as apiUpdatePreferences,
} from '@/lib/kb/api/preferences'

import { createError } from '@/lib/errors'

const useUserPreferences = ({ config, user }) => {

  const getPreferences = useCallback(
    async key => {
      try {
        return await apiGetPreferences(config, user.name, key)
      } catch (error) {
        throw createError('Preferences Loading Error', 'Failed to load user preferences', { username: user.name }, error)
      }
    },
    [config, user]
  )

  const createPreferences = useCallback(
    async (key, prefs) => {
      if (!user) return
      await apiCreatePreferences(config, user.name, key, prefs)
    },
    [config, user]
  )

  const updatePreferences = useCallback(
    async (key, prefs) => {
      if (!user) return
      await apiUpdatePreferences(config, user.name, key, prefs)
    },
    [config, user]
  )

  return { getPreferences, createPreferences, updatePreferences }
}

export default useUserPreferences
