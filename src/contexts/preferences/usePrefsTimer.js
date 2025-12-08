import { useCallback, useEffect, useRef } from 'react'

import { PREFS } from '@/lib/constants/prefs.js'

const usePrefsTimer = ({
  CLEAN_FLAGS,
  dirtyFlags,
  preferencesInitialized,
  serverPreferencesExist,
  prefsValue,
  updatePreferences,
  setDirtyFlags,
}) => {
  const autosaveInterval = useRef(null)
  const isSaving = useRef(false)

  const resetAutosaveTimer = useCallback(() => {
    if (autosaveInterval.current) {
      clearInterval(autosaveInterval.current)
    }

    if (!preferencesInitialized || !serverPreferencesExist) return

    autosaveInterval.current = setInterval(() => {
      if (isSaving.current) return
      if (!Object.values(dirtyFlags).some(value => value)) return
      if (!serverPreferencesExist) return

      isSaving.current = true

      const savePreferences = async () => {
        const prefUpdates = Object.values(PREFS.API.KEY).reduce((acc, key) => {
          if (dirtyFlags[key]) {
            acc.push({ key, value: prefsValue(key) })
          }
          return acc
        }, [])

        try {
          await Promise.all(prefUpdates.map(update => {
            return updatePreferences(update.key, update.value)
          }))
          setDirtyFlags(CLEAN_FLAGS)
        } catch (error) {
          console.error('Failed to autosave preferences:', error)
        } finally {
          isSaving.current = false
        }
      }

      savePreferences()
    }, PREFS.API.AUTOSAVE_MILLIS)
  }, [
    CLEAN_FLAGS,
    dirtyFlags,
    preferencesInitialized,
    prefsValue,
    serverPreferencesExist,
    updatePreferences,
    setDirtyFlags,
  ])

  useEffect(() => {
    if (!preferencesInitialized) return

    resetAutosaveTimer()

    return () => {
      if (autosaveInterval.current) {
        clearInterval(autosaveInterval.current)
      }
    }
  }, [resetAutosaveTimer, preferencesInitialized])

  return {
    resetAutosaveTimer,
    isSaving,
  }
}

export default usePrefsTimer
