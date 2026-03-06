import { useCallback } from 'react'

import {
  createAppPreference as apiCreateAppPreference,
  getAppPreference as apiGetAppPreference,
  updateAppPreference as apiUpdateAppPreference,
} from '@/lib/api/preferences'

import { createError } from '@/lib/errors'

const useAppPreferences = ({ config }) => {
  const getAppPreference = useCallback(
    async key => {
      try {
        return await apiGetAppPreference(config, key)
      } catch (error) {
        throw createError(
          'Preferences Loading Error',
          'Failed to load app preferences',
          { key },
          error
        )
      }
    },
    [config]
  )

  const saveAppPreference = useCallback(
    async (key, value) => {
      try {
        const currentValue = await apiGetAppPreference(config, key)
        if (currentValue === null || currentValue === undefined) {
          await apiCreateAppPreference(config, key, value)
        } else {
          await apiUpdateAppPreference(config, key, value)
        }
      } catch (error) {
        throw createError(
          'Preferences Save Error',
          'Failed to save app preferences',
          { key },
          error
        )
      }
    },
    [config]
  )

  return { getAppPreference, saveAppPreference }
}

export default useAppPreferences
