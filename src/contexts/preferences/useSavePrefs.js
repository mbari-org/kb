import { useCallback } from 'react'

import { PREFS } from '@/lib/kb/constants/prefs.js'

const { KEY } = PREFS.API

const syncInMemoryStore = (key, value, conceptSelectRef, panelSelectRef, onSettingsInitRef) => {
  if (key === KEY.CONCEPTS && conceptSelectRef?.current) {
    conceptSelectRef.current.clear()
    value.state.forEach(name => conceptSelectRef.current.push(name))
  } else if (key === KEY.PANELS && panelSelectRef?.current) {
    panelSelectRef.current.clear()
    value.state.forEach(name => panelSelectRef.current.push(name))
  } else if (key === KEY.SETTINGS && onSettingsInitRef?.current) {
    onSettingsInitRef.current(value)
  }
}

const useSavePrefs = ({
  CLEAN_FLAGS,
  conceptSelectRef,
  dirtyFlags,
  isSaving,
  onSettingsInitRef,
  panelSelectRef,
  prefsValue,
  preferencesInitialized,
  resetAutosaveTimer,
  serverPreferencesExist,
  setDirtyFlags,
  updatePreferences,
}) => {
  const savePreferences = useCallback(async (key, value) => {
    if (!preferencesInitialized || !serverPreferencesExist) return
    if (isSaving.current) return

    isSaving.current = true

    try {
      let prefUpdates
      if (key && value) {
        prefUpdates = [{ key, value }]
      } else {
        prefUpdates = Object.values(PREFS.API.KEY).reduce((acc, k) => {
          if (dirtyFlags[k]) {
            acc.push({ key: k, value: prefsValue(k) })
          }
          return acc
        }, [])
      }

      await Promise.all(prefUpdates.map(update => {
        return updatePreferences(update.key, update.value)
      }))

      if (key && value) {
        syncInMemoryStore(key, value, conceptSelectRef, panelSelectRef, onSettingsInitRef)
        setDirtyFlags(prev => ({ ...prev, [key]: false }))
      } else {
        setDirtyFlags(CLEAN_FLAGS)
      }

      resetAutosaveTimer()
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      isSaving.current = false
    }
  }, [
    CLEAN_FLAGS,
    conceptSelectRef,
    dirtyFlags,
    isSaving,
    onSettingsInitRef,
    panelSelectRef,
    prefsValue,
    preferencesInitialized,
    resetAutosaveTimer,
    serverPreferencesExist,
    setDirtyFlags,
    updatePreferences,
  ])

  return { savePreferences }
}

export default useSavePrefs
