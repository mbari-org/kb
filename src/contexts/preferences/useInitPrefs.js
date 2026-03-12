import { useCallback, useEffect } from 'react'

import { createError } from '@/lib/errors'
import { isEmpty } from '@/lib/utils'

import { PREFS } from '@/lib/constants/prefs.js'

const { KEY } = PREFS.USER

const CLEAN_FLAGS = {
  [KEY.CONCEPTS]: false,
  [KEY.PANELS]: false,
  [KEY.SETTINGS]: false,
}

const normalizeHistoryPreferences = value => {
  const state = Array.isArray(value?.state) ? value.state : []
  const rawPosition = Number.isInteger(value?.position) ? value.position : -1

  if (state.length === 0) {
    return { state, position: -1 }
  } else if (rawPosition < 0) {
    return { state, position: 0 }
  } else if (rawPosition >= state.length) {
    return { state, position: state.length - 1 }
  } else {
    return { state, position: rawPosition }
  }
}

const isSameHistoryPreferences = (left, right) => {
  if (left.position !== right.position) {
    return false
  } else if (left.state.length !== right.state.length) {
    return false
  } else {
    return left.state.every((name, index) => name === right.state[index])
  }
}

const useInitPrefs = ({
  conceptSelection,
  createPreferences,
  getPreferences,
  panelSelection,
  preferencesInitialized,
  getSettings,
  getSettingsRef,
  onInitSettingsRef,
  setDirtyFlags,
  setIsLoading,
  setPreferencesInitialized,
  setServerPreferencesExist,
  updatePreferences,
  user,
}) => {
  const prefsValue = useCallback(
    key => {
      switch (key) {
        case KEY.CONCEPTS:
          return {
            state: conceptSelection.getState(),
            position: conceptSelection.getPosition(),
          }

        case KEY.PANELS:
          return {
            state: panelSelection.getState(),
            position: panelSelection.getPosition(),
          }

        case KEY.SETTINGS:
          return getSettings()

        default:
          throw createError('Invalid Preference Key', `Invalid preference key: ${key}`, { key })
      }
    },
    [conceptSelection, panelSelection, getSettings]
  )

  useEffect(() => {
    if (!user || preferencesInitialized) return

    const initializePreferences = async () => {
      setIsLoading(true)

      const allPrefs = await getPreferences()

      if (isEmpty(allPrefs)) {
        await Promise.all(
          Object.values(KEY).map(key => {
            return createPreferences(key, prefsValue(key))
          })
        )
        setServerPreferencesExist(true)
      } else {
        const normalizedConcepts = normalizeHistoryPreferences(allPrefs.concepts)
        const normalizedPanels = normalizeHistoryPreferences(allPrefs.panels)

        conceptSelection.init(normalizedConcepts)
        panelSelection.init(normalizedPanels)
        if (onInitSettingsRef?.current) {
          onInitSettingsRef.current(allPrefs.settings)
        }
        await Promise.all([
          isSameHistoryPreferences(allPrefs.concepts, normalizedConcepts)
            ? Promise.resolve()
            : updatePreferences(KEY.CONCEPTS, normalizedConcepts),
          isSameHistoryPreferences(allPrefs.panels, normalizedPanels)
            ? Promise.resolve()
            : updatePreferences(KEY.PANELS, normalizedPanels),
        ])
        setServerPreferencesExist(true)
      }

      setPreferencesInitialized(true)
      setDirtyFlags(CLEAN_FLAGS)
      setIsLoading(false)
    }

    initializePreferences()
  }, [
    conceptSelection,
    createPreferences,
    getPreferences,
    getSettingsRef,
    onInitSettingsRef,
    panelSelection,
    preferencesInitialized,
    prefsValue,
    setDirtyFlags,
    setIsLoading,
    setPreferencesInitialized,
    setServerPreferencesExist,
    updatePreferences,
    user,
  ])

  return { CLEAN_FLAGS, prefsValue }
}

export default useInitPrefs
