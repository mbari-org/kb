import { useCallback } from 'react'

import {
  createPreferences as apiCreatePreferences,
  getPreferences as apiGetPreferences,
  updatePreferences as apiUpdatePreferences,
} from '@/lib/api/preferences'

import { createError } from '@/lib/errors'

const useUserPreferences = ({ config, user }) => {

  const getPreferences = useCallback(
    async username => {
      const { error, payload } = await apiGetPreferences(config, username)
      if (error) {
        throw createError('Preferences Loading Error', 'Failed to load user preferences', { username }, error)
      }

      if (!payload) return null

      try {
        const raw = typeof payload?.value === 'string' ? payload.value : payload
        const prefs = typeof raw === 'string' ? JSON.parse(raw) : raw
        
        if (Array.isArray(prefs) && prefs.length === 0) {
          return null
        }
        
        return prefs
      } catch (e) {
        throw createError('Preferences Parse Error', 'Invalid preferences JSON from server', { username, payload }, e)
      }
    },
    [config]
  )

  const createPreferences = useCallback(
    async prefs => {
      if (!user) return
      const value = JSON.stringify(prefs)
      const { error } = await apiCreatePreferences(config, user.name, value)
      if (error) throw error
    },
    [config, user]
  )

  const updatePreferences = useCallback(
    async prefs => {
      if (!user) return
      const value = JSON.stringify(prefs)
      const { error } = await apiUpdatePreferences(config, user.name, value)
      if (error) throw error
    },
    [config, user]
  )

  return { getPreferences, createPreferences, updatePreferences }
}

export default useUserPreferences
