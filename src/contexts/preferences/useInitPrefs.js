import { useCallback, useEffect } from 'react'

import { PREFS } from '@/lib/constants/constants'
import { createError } from '@/lib/errors'
import { isEmpty } from '@/lib/utils'

const CLEAN_FLAGS = {
  [PREFS.KEYS.CONCEPTS]: false,
  [PREFS.KEYS.PANELS]: false,
  [PREFS.KEYS.SETTINGS]: false,
}

const useInitPrefs = ({
  conceptSelect,
  createPreferences,
  getPreferences,
  panelSelect,
  preferencesInitialized,
  getSettings,
  getSettingsRef,
  onSettingsInitRef,
  setDirtyFlags,
  setIsLoading,
  setPreferencesInitialized,
  setServerPreferencesExist,
  user,
}) => {
  const prefsValue = useCallback(key => {
    switch (key) {
      case PREFS.KEYS.CONCEPTS:
        return {
          state: conceptSelect.getState(),
          position: conceptSelect.getPosition(),
        }

      case PREFS.KEYS.PANELS:
        return {
          state: panelSelect.getState(),
          position: panelSelect.getPosition(),
        }

      case PREFS.KEYS.SETTINGS:
        return getSettings()

      default:
        throw createError('Invalid Preference Key', `Invalid preference key: ${key}`, { key })
    }
  }, [conceptSelect, panelSelect, getSettings])

  useEffect(() => {
    if (!user || preferencesInitialized) return

    const initializePreferences = async () => {
      setIsLoading(true)

      const allPrefs = await getPreferences()

      if (isEmpty(allPrefs)) {
        await Promise.all(Object.values(PREFS.KEYS).map(key => {
          return createPreferences(key, prefsValue(key))
        }))
        setServerPreferencesExist(true)
      } else {
        conceptSelect.init(allPrefs.concepts)
        panelSelect.init(allPrefs.panels)
        if (onSettingsInitRef?.current) {
          onSettingsInitRef.current(allPrefs.settings)
        }
        setServerPreferencesExist(true)
      }

      setPreferencesInitialized(true)
      setDirtyFlags(CLEAN_FLAGS)
      setIsLoading(false)
    }

    initializePreferences()
  }, [
    conceptSelect,
    createPreferences,
    getPreferences,
    getSettingsRef,
    onSettingsInitRef,
    panelSelect,
    preferencesInitialized,
    prefsValue,
    setDirtyFlags,
    setIsLoading,
    setPreferencesInitialized,
    setServerPreferencesExist,
    user,
  ])

  return { CLEAN_FLAGS, prefsValue }
}

export default useInitPrefs
