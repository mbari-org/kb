import { useCallback } from 'react'

import { PREFS } from '@/lib/constants/prefs.js'
import { createError } from '@/lib/errors'

const { KEY } = PREFS.USER

const getAllPreferenceUpdates = prefsValue => {
  return Object.values(PREFS.USER.KEY).map(key => ({ key, value: prefsValue(key) }))
}

const getDirtyPreferenceUpdates = (dirtyFlags, prefsValue) => {
  return Object.values(PREFS.USER.KEY).reduce((acc, key) => {
    if (dirtyFlags[key]) {
      acc.push({ key, value: prefsValue(key) })
    }
    return acc
  }, [])
}

const syncInMemoryStore = (key, value, conceptSelectionRef, panelSelectionRef, onInitSettingsRef) => {
  if (key === KEY.CONCEPTS && conceptSelectionRef?.current) {
    conceptSelectionRef.current.clear()
    value.state.forEach(name => conceptSelectionRef.current.push(name))
  } else if (key === KEY.PANELS && panelSelectionRef?.current) {
    panelSelectionRef.current.clear()
    value.state.forEach(name => panelSelectionRef.current.push(name))
  } else if (key === KEY.SETTINGS && onInitSettingsRef?.current) {
    onInitSettingsRef.current(value)
  }
}

const useSavePrefs = ({
  CLEAN_FLAGS,
  conceptSelectionRef,
  dirtyFlags,
  isSaving,
  onInitSettingsRef,
  panelSelectionRef,
  prefsValue,
  preferencesInitialized,
  resetAutosaveTimer,
  serverPreferencesExist,
  setDirtyFlags,
  showBoundary,
  updatePreferences,
}) => {
  const updatePreferenceValues = useCallback(
    async prefUpdates => {
      await Promise.all(
        prefUpdates.map(update => {
          return updatePreferences(update.key, update.value)
        })
      )
    },
    [updatePreferences]
  )
  const savePreferences = useCallback(
    async (key, value) => {
      if (!preferencesInitialized || !serverPreferencesExist) return
      if (isSaving.current) return

      isSaving.current = true

      try {
        let prefUpdates
        if (key && value) {
          prefUpdates = [{ key, value }]
        } else {
          prefUpdates = getDirtyPreferenceUpdates(dirtyFlags, prefsValue)
        }

        await updatePreferenceValues(prefUpdates)

        if (key && value) {
          syncInMemoryStore(key, value, conceptSelectionRef, panelSelectionRef, onInitSettingsRef)
          setDirtyFlags(prev => ({ ...prev, [key]: false }))
        } else {
          setDirtyFlags(CLEAN_FLAGS)
        }

        resetAutosaveTimer()
      } catch (error) {
        const saveError = createError(
          'Preferences Save Error',
          'Failed to save preferences',
          { key: key || null },
          error
        )
        showBoundary(saveError)
        throw saveError
      } finally {
        isSaving.current = false
      }
    },
    [
      CLEAN_FLAGS,
      conceptSelectionRef,
      dirtyFlags,
      isSaving,
      onInitSettingsRef,
      panelSelectionRef,
      prefsValue,
      preferencesInitialized,
      resetAutosaveTimer,
      serverPreferencesExist,
      setDirtyFlags,
      showBoundary,
      updatePreferenceValues,
    ]
  )

  const flushPreferences = useCallback(async () => {
    if (!preferencesInitialized || !serverPreferencesExist) return

    while (isSaving.current) {
      await new Promise(resolve => setTimeout(resolve, 5))
    }

    isSaving.current = true

    try {
      const prefUpdates = getAllPreferenceUpdates(prefsValue)
      await updatePreferenceValues(prefUpdates)
      setDirtyFlags(CLEAN_FLAGS)
      resetAutosaveTimer()
    } catch (error) {
      const flushError = createError(
        'Preferences Flush Error',
        'Failed to flush preferences',
        {},
        error
      )
      showBoundary(flushError)
      throw flushError
    } finally {
      isSaving.current = false
    }
  }, [
    CLEAN_FLAGS,
    isSaving,
    preferencesInitialized,
    prefsValue,
    resetAutosaveTimer,
    serverPreferencesExist,
    setDirtyFlags,
    showBoundary,
    updatePreferenceValues,
  ])

  return { flushPreferences, savePreferences }
}

export default useSavePrefs
