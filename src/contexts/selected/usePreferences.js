import { useCallback, useEffect, useRef, useState } from 'react'

import { isEmpty } from '@/lib/utils'

const AUTOSAVE_MILLIS = 5_000

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
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [preferencesInitialized, setPreferencesInitialized] = useState(false)
  const [serverPreferencesExist, setServerPreferencesExist] = useState(false)

  const autosaveInterval = useRef(null)
  const isSaving = useRef(false)

  const buildPreferencesObject = useCallback(() => ({
    concepts: {
      state: conceptSelect.getState(),
      position: conceptSelect.getPosition(),
    },
    panels: {
      state: panelSelect.getState(),
      position: panelSelect.getPosition(),
    },
    settings,
  }), [conceptSelect, panelSelect, settings])

  // Initialize preferences on login
  useEffect(() => {
    if (!user || preferencesInitialized) return

    const initializePreferences = async () => {
      setIsLoading(true)

      const prefs = await getPreferences(user.name)

      if (isEmpty(prefs)) {
        const defaultPrefs = buildPreferencesObject()
        await createPreferences(defaultPrefs)
        setServerPreferencesExist(true)
      } else {
        const { concepts, panels, settings: serverSettings } = JSON.parse(prefs[0].value)

        conceptSelect.init(concepts)
        panelSelect.init(panels)
        setSettings(serverSettings)
        setServerPreferencesExist(true)
      }

      setPreferencesInitialized(true)
      setIsDirty(false)
      setIsLoading(false)
    }

    initializePreferences()
  }, [
    buildPreferencesObject,
    conceptSelect,
    createPreferences,
    getPreferences,
    panelSelect,
    preferencesInitialized,
    setSettings,
    user,
  ])

  useEffect(() => {
    if (!preferencesInitialized) return
    setIsDirty(true)
  }, [currentConcept, currentPanel, settings, preferencesInitialized])

  useEffect(() => {
    if (!preferencesInitialized) return

    if (autosaveInterval.current) {
      clearInterval(autosaveInterval.current)
    }

    autosaveInterval.current = setInterval(() => {
      if (isSaving.current) return
      if (!isDirty) return
      if (!serverPreferencesExist) return

      isSaving.current = true

      const savePreferences = async () => {
        try {
          const prefs = buildPreferencesObject()
          await updatePreferences(prefs)
          setIsDirty(false)
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
  }, [buildPreferencesObject, isDirty, preferencesInitialized, serverPreferencesExist, updatePreferences])

  return {
    isLoading,
    buildPreferencesObject,
  }
}

export default usePreferences
