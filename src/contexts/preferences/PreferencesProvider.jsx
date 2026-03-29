import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useErrorBoundary } from 'react-error-boundary'

import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptSelection from '@/contexts/selected/useConceptSelection'
import usePanelSelection from '@/contexts/selected/usePanelSelection'
import usePrefsTimer from '@/contexts/preferences/usePrefsTimer'
import useSavePrefs from '@/contexts/preferences/useSavePrefs'
import useInitPrefs from '@/contexts/preferences/useInitPrefs'

import { PREFS } from '@/lib/constants/prefs.js'

const { KEY } = PREFS.USER

const PreferencesProvider = ({ children }) => {
  const { createPreferences, config, getPreferences, savePreferencesRef, updatePreferences, user } = use(UserContext)

  const [currentConcept, setCurrentConcept] = useState(null)
  const [currentPanel, setCurrentPanel] = useState(null)
  const [dirtyFlags, setDirtyFlags] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [preferencesInitialized, setPreferencesInitialized] = useState(false)
  const [serverPreferencesExist, setServerPreferencesExist] = useState(false)

  const onInitSettingsRef = useRef(null)
  const markSettingsDirtyRef = useRef(null)
  const getSettingsRef = useRef(null)

  const onConceptChange = useCallback(
    concept => {
      setCurrentConcept(concept)
      if (preferencesInitialized) {
        setDirtyFlags(prev => ({ ...prev, [KEY.CONCEPTS]: true }))
      }
    },
    [preferencesInitialized]
  )

  const onPanelChange = useCallback(
    panel => {
      setCurrentPanel(panel)
      if (preferencesInitialized) {
        setDirtyFlags(prev => ({ ...prev, [KEY.PANELS]: true }))
      }
    },
    [preferencesInitialized]
  )

  const onSettingsChange = useCallback(() => {
    if (preferencesInitialized) {
      setDirtyFlags(prev => ({ ...prev, [KEY.SETTINGS]: true }))
    }
  }, [preferencesInitialized])

  const conceptSelection = useConceptSelection(onConceptChange)
  const panelSelection = usePanelSelection(onPanelChange)

  useEffect(() => {
    markSettingsDirtyRef.current = onSettingsChange
  }, [onSettingsChange, markSettingsDirtyRef])

  const getSettingsForPrefs = useCallback(() => {
    return getSettingsRef.current?.()
  }, [getSettingsRef])
  const { showBoundary } = useErrorBoundary()

  const { CLEAN_FLAGS, prefsValue } = useInitPrefs({
    config,
    conceptSelection,
    createPreferences,
    getPreferences,
    panelSelection,
    preferencesInitialized,
    getSettings: getSettingsForPrefs,
    getSettingsRef,
    onInitSettingsRef,
    setDirtyFlags,
    setIsLoading,
    setPreferencesInitialized,
    setServerPreferencesExist,
    showBoundary,
    updatePreferences,
    user,
  })

  const { resetAutosaveTimer, isSaving } = usePrefsTimer({
    CLEAN_FLAGS,
    dirtyFlags,
    prefsValue,
    preferencesInitialized,
    serverPreferencesExist,
    setDirtyFlags,
    showBoundary,
    updatePreferences,
  })

  const conceptSelectionRef = useRef(conceptSelection)
  const panelSelectionRef = useRef(panelSelection)

  useEffect(() => {
    conceptSelectionRef.current = conceptSelection
  }, [conceptSelection])

  useEffect(() => {
    panelSelectionRef.current = panelSelection
  }, [panelSelection])

  const { flushPreferences, savePreferences } = useSavePrefs({
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
    updatePreferences,
  })

  useEffect(() => {
    savePreferencesRef.current = flushPreferences
  }, [flushPreferences, savePreferencesRef])

  const value = useMemo(
    () => ({
      conceptSelection,
      currentConcept,
      currentPanel,
      isLoading,
      getSettingsRef,
      markSettingsDirtyRef,
      onInitSettingsRef,
      panelSelection,
      savePreferences,
    }),
    [conceptSelection, currentConcept, currentPanel, isLoading, panelSelection, savePreferences]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export default PreferencesProvider
