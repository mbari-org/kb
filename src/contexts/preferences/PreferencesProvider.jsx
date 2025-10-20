import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptSelect from '@/contexts/selected/useConceptSelect'
import usePanelSelect from '@/contexts/selected/usePanelSelect'
import useSettings from '@/contexts/selected/useSettings'

import { PREFS_KEYS } from '@/lib/kb/api/preferences'
import { PREFS_AUTOSAVE_MILLIS } from '@/lib/constants'
import { isEmpty } from '@/lib/utils'

const CLEAN_PREFS = {
  [PREFS_KEYS.CONCEPTS]: false,
  [PREFS_KEYS.PANELS]: false,
  [PREFS_KEYS.SETTINGS]: false,
}

const PreferencesProvider = ({ children }) => {
  const { createPreferences, getPreferences, savePreferencesRef, updatePreferences, user } = use(UserContext)
  use(TaxonomyContext)

  const [currentConcept, setCurrentConcept] = useState(null)
  const [currentPanel, setCurrentPanel] = useState(null)

  const conceptSelect = useConceptSelect(setCurrentConcept)
  const panelSelect = usePanelSelect(setCurrentPanel)
  const { settings, setSettings, getSettings, updateSettings } = useSettings()

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
      setIsDirty(CLEAN_PREFS)
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
        const prefUpdates = Object.values(PREFS_KEYS).reduce((acc, key) => {
          if (isDirty[key]) {
            acc.push({ key, value: prefsValue(key) })
          }
          return acc
        }, [])

        try {
          await Promise.all(prefUpdates.map(update => {
            return updatePreferences(update.key, update.value)
          }))
          setIsDirty(CLEAN_PREFS)
        } catch (error) {
          console.error('Failed to autosave preferences:', error)
        } finally {
          isSaving.current = false
        }
      }

      savePreferences()
    }, PREFS_AUTOSAVE_MILLIS)

    return () => {
      if (autosaveInterval.current) {
        clearInterval(autosaveInterval.current)
      }
    }
  }, [isDirty, preferencesInitialized, prefsValue, serverPreferencesExist, updatePreferences])

  const savePreferences = useCallback(async () => {
    if (!preferencesInitialized || !serverPreferencesExist) return
    if (isSaving.current) return

    isSaving.current = true

    try {
      const prefUpdates = Object.values(PREFS_KEYS).reduce((acc, key) => {
        if (isDirty[key]) {
          acc.push({ key, value: prefsValue(key) })
        }
        return acc
      }, [])

      await Promise.all(prefUpdates.map(update => {
        return updatePreferences(update.key, update.value)
      }))
      setIsDirty(CLEAN_PREFS)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      isSaving.current = false
    }
  }, [isDirty, preferencesInitialized, serverPreferencesExist, prefsValue, updatePreferences])

  useEffect(() => {
    savePreferencesRef.current = savePreferences
  }, [savePreferences, savePreferencesRef])

  const value = useMemo(
    () => ({
      conceptSelect,
      currentConcept,
      currentPanel,
      getSettings,
      isLoading,
      panelSelect,
      savePreferences,
      updateSettings,
    }),
    [conceptSelect, currentConcept, currentPanel, getSettings, isLoading, panelSelect, savePreferences, updateSettings]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export default PreferencesProvider
