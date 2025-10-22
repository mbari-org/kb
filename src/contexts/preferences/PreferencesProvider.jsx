import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptSelect from '@/contexts/selected/useConceptSelect'
import usePanelSelect from '@/contexts/selected/usePanelSelect'
import usePrefsTimer from '@/contexts/preferences/usePrefsTimer'
import useSavePrefs from '@/contexts/preferences/useSavePrefs'
import useInitPrefs from '@/contexts/preferences/useInitPrefs'

import { PREFS } from '@/lib/constants'

const PreferencesProvider = ({ children }) => {
  const { createPreferences, getPreferences, savePreferencesRef, updatePreferences, user } = use(UserContext)

  const [currentConcept, setCurrentConcept] = useState(null)
  const [currentPanel, setCurrentPanel] = useState(null)
  const [dirtyFlags, setDirtyFlags] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [preferencesInitialized, setPreferencesInitialized] = useState(false)
  const [serverPreferencesExist, setServerPreferencesExist] = useState(false)

  const onSettingsInitRef = useRef(null)
  const onSettingsChangeRef = useRef(null)
  const getSettingsRef = useRef(null)

  const onConceptChange = useCallback(concept => {
    setCurrentConcept(concept)
    if (preferencesInitialized) {
      setDirtyFlags(prev => ({ ...prev, [PREFS.KEYS.CONCEPTS]: true }))
    }
  }, [preferencesInitialized])

  const onPanelChange = useCallback(panel => {
    setCurrentPanel(panel)
    if (preferencesInitialized) {
      setDirtyFlags(prev => ({ ...prev, [PREFS.KEYS.PANELS]: true }))
    }
  }, [preferencesInitialized])

  const onSettingsChange = useCallback(() => {
    if (preferencesInitialized) {
      setDirtyFlags(prev => ({ ...prev, [PREFS.KEYS.SETTINGS]: true }))
    }
  }, [preferencesInitialized])

  const conceptSelect = useConceptSelect(onConceptChange)
  const panelSelect = usePanelSelect(onPanelChange)

  useEffect(() => {
    onSettingsChangeRef.current = onSettingsChange
  }, [onSettingsChange, onSettingsChangeRef])

  const getSettingsForPrefs = useCallback(() => {
    return getSettingsRef.current?.()
  }, [getSettingsRef])

  const { CLEAN_FLAGS, prefsValue } = useInitPrefs({
    conceptSelect,
    createPreferences,
    getPreferences,
    panelSelect,
    preferencesInitialized,
    getSettings: getSettingsForPrefs,
    getSettingsRef,
    onSettingsInitRef,
    setDirtyFlags,
    setIsLoading,
    setPreferencesInitialized,
    setServerPreferencesExist,
    user,
  })

  const { resetAutosaveTimer, isSaving } = usePrefsTimer({
    CLEAN_FLAGS,
    dirtyFlags,
    prefsValue,
    preferencesInitialized,
    serverPreferencesExist,
    setDirtyFlags,
    updatePreferences,
  })

  const conceptSelectRef = useRef(conceptSelect)
  const panelSelectRef = useRef(panelSelect)

  useEffect(() => {
    conceptSelectRef.current = conceptSelect
  }, [conceptSelect])

  useEffect(() => {
    panelSelectRef.current = panelSelect
  }, [panelSelect])

  const { savePreferences } = useSavePrefs({
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
  })

  useEffect(() => {
    savePreferencesRef.current = savePreferences
  }, [savePreferences, savePreferencesRef])

  const value = useMemo(
    () => ({
      conceptSelect,
      currentConcept,
      currentPanel,
      isLoading,
      getSettingsRef,
      onSettingsChangeRef,
      onSettingsInitRef,
      panelSelect,
      savePreferences,
    }),
    [conceptSelect, currentConcept, currentPanel, isLoading, panelSelect, savePreferences]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export default PreferencesProvider
