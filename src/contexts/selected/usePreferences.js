import { useCallback, useEffect, useRef, useState } from 'react'

import { PREFS_KEYS } from '@/lib/api/preferences'

import { isEmpty } from '@/lib/utils'

const AUTOSAVE_MILLIS = 5_000

const ALL_CLEAN = {
  [PREFS_KEYS.CONCEPTS]: false,
  [PREFS_KEYS.PANELS]: false,
  [PREFS_KEYS.SETTINGS]: false,
}

const usePreferences = ({
  conceptSelect,
  createPreferences,
  currentConcept,
  currentPanel,
  getPreferences,
  panelSelect,
  setSettings,
  settings,
  updatePreferences,
  user,
}) => {
  const [isDirty, setIsDirty] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [preferencesInitialized, setPreferencesInitialized] = useState(false)
  const [serverPreferencesExist, setServerPreferencesExist] = useState(false)

  const autosaveInterval = useRef(null)
  const isSaving = useRef(false)

  const prefsValue = useCallback(key => {
    switch (key) {
      case PREFS_KEYS.CONCEPTS:
        return {
          state: conceptSelect.getState(),
          position: conceptSelect.getPosition(),
        }
      case PREFS_KEYS.PANELS:
        return {
          state: panelSelect.getState(),
          position: panelSelect.getPosition(),
        }
      case PREFS_KEYS.SETTINGS:
        return settings
      default:
        return null
    }
  }, [conceptSelect, panelSelect, settings])

  useEffect(() => {
    if (!user || preferencesInitialized) return

    const initializePreferences = async () => {
      setIsLoading(true)

      const allPrefs = await getPreferences()

      if (isEmpty(allPrefs)) {
        await Promise.all(Object.values(PREFS_KEYS).map(key => {
          return createPreferences(key, prefsValue(key))
        }))
        setServerPreferencesExist(true)
      } else {
        conceptSelect.init(allPrefs.concepts)
        panelSelect.init(allPrefs.panels)
        setSettings(allPrefs.settings)
        setServerPreferencesExist(true)
      }

      setPreferencesInitialized(true)
      setIsDirty(ALL_CLEAN)
      setIsLoading(false)
    }

    initializePreferences()
  }, [
    conceptSelect,
    createPreferences,
    getPreferences,
    panelSelect,
    preferencesInitialized,
    prefsValue,
    setSettings,
    user,
  ])

  useEffect(() => {
    if (!preferencesInitialized || !currentConcept) return
    setIsDirty(prev => ({
      ...prev,
      [PREFS_KEYS.CONCEPTS]: true,
    }))
  }, [currentConcept, preferencesInitialized])

  useEffect(() => {
    if (!preferencesInitialized || !currentPanel) return
    setIsDirty(prev => ({
      ...prev,
      [PREFS_KEYS.PANELS]: true,
    }))
  }, [currentPanel, preferencesInitialized])

  useEffect(() => {
    if (!preferencesInitialized || !settings) return
    setIsDirty(prev => ({
      ...prev,
      [PREFS_KEYS.SETTINGS]: true,
    }))
  }, [settings, preferencesInitialized])

  const markDirty = useCallback(key => {
    if (!preferencesInitialized) return
    setIsDirty(prev => ({
      ...prev,
      [key]: true,
    }))
  }, [preferencesInitialized])

  useEffect(() => {
    if (!preferencesInitialized) return

    if (autosaveInterval.current) {
      clearInterval(autosaveInterval.current)
    }

    autosaveInterval.current = setInterval(() => {
      if (isSaving.current) return
      if (!Object.values(isDirty).some(value => value)) return
      if (!serverPreferencesExist) return

      isSaving.current = true

      const savePreferences = async () => {

        const prefUpdates = PREFS_KEYS.reduce((acc, key) => {
          if (isDirty[key]) {
            acc.push({ key, value: prefsValue(key) })
          }
          return acc
        }, [])

        try {
          await Promise.all(prefUpdates.map(update => {
            return updatePreferences(update.key, update.value)
          }))
          setIsDirty(ALL_CLEAN)
        } catch (error) {
          console.error('Failed to autosave preferences:', error)
        } finally {
          isSaving.current = false
        }
      }

      savePreferences()
    }, AUTOSAVE_MILLIS)

    return () => {
      if (autosaveInterval.current) {
        clearInterval(autosaveInterval.current)
      }
    }
  }, [isDirty, preferencesInitialized, prefsValue, serverPreferencesExist, updatePreferences])

  return {
    isLoading,
    markDirty,
  }
}

export default usePreferences
