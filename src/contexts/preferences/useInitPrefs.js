import { useCallback, useEffect } from 'react'

import { createError } from '@/lib/errors'
import { isEmpty } from '@/lib/utils'

import { PREFS } from '@/lib/constants/prefs.js'

const { KEY } = PREFS.API

const CLEAN_FLAGS = {
  [KEY.CONCEPTS]: false,
  [KEY.PANELS]: false,
  [KEY.SETTINGS]: false,
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
      case KEY.CONCEPTS:
        return {
          state: conceptSelect.getState(),
          position: conceptSelect.getPosition(),
        }

      case KEY.PANELS:
        return {
          state: panelSelect.getState(),
          position: panelSelect.getPosition(),
        }

      case KEY.SETTINGS:
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
        await Promise.all(Object.values(KEY).map(key => {
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
