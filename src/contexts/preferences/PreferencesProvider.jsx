import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useErrorBoundary } from 'react-error-boundary'

import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import UserContext from '@/contexts/user/UserContext'

import useConceptSelect from '@/contexts/selected/useConceptSelect'
import usePanelSelect from '@/contexts/selected/usePanelSelect'
import usePrefsTimer from '@/contexts/preferences/usePrefsTimer'
import useSavePrefs from '@/contexts/preferences/useSavePrefs'
import useInitPrefs from '@/contexts/preferences/useInitPrefs'

import { PREFS } from '@/lib/constants/prefs.js'

const { KEY } = PREFS.USER

const PreferencesProvider = ({ children }) => {
  const { createPreferences, getPreferences, savePreferencesRef, updatePreferences, user } = use(UserContext)

  const [currentConcept, setCurrentConcept] = useState(null)
  const [currentPanel, setCurrentPanel] = useState(null)
  const [dirtyFlags, setDirtyFlags] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [preferencesInitialized, setPreferencesInitialized] = useState(false)
  const [serverPreferencesExist, setServerPreferencesExist] = useState(false)

  const onInitSettingsRef = useRef(null)
  const markSettingsDirtyRef = useRef(null)
  const getSettingsRef = useRef(null)

  const onConceptChange = useCallback(concept => {
    setCurrentConcept(concept)
    if (preferencesInitialized) {
      setDirtyFlags(prev => ({ ...prev, [KEY.CONCEPTS]: true }))
    }
  }, [preferencesInitialized])

  const onPanelChange = useCallback(panel => {
    setCurrentPanel(panel)
    if (preferencesInitialized) {
      setDirtyFlags(prev => ({ ...prev, [KEY.PANELS]: true }))
    }
  }, [preferencesInitialized])

  const onSettingsChange = useCallback(() => {
    if (preferencesInitialized) {
      setDirtyFlags(prev => ({ ...prev, [KEY.SETTINGS]: true }))
    }
  }, [preferencesInitialized])

  const conceptSelect = useConceptSelect(onConceptChange)
  const panelSelect = usePanelSelect(onPanelChange)

  useEffect(() => {
    markSettingsDirtyRef.current = onSettingsChange
  }, [onSettingsChange, markSettingsDirtyRef])

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
    onInitSettingsRef,
    setDirtyFlags,
    setIsLoading,
    setPreferencesInitialized,
    setServerPreferencesExist,
    user,
  })

  const { showBoundary } = useErrorBoundary()
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

  const conceptSelectRef = useRef(conceptSelect)
  const panelSelectRef = useRef(panelSelect)

  useEffect(() => {
    conceptSelectRef.current = conceptSelect
  }, [conceptSelect])

  useEffect(() => {
    panelSelectRef.current = panelSelect
  }, [panelSelect])

  const { flushPreferences, savePreferences } = useSavePrefs({
    CLEAN_FLAGS,
    conceptSelectRef,
    dirtyFlags,
    isSaving,
    onInitSettingsRef,
    panelSelectRef,
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
      conceptSelect,
      currentConcept,
      currentPanel,
      isLoading,
      getSettingsRef,
      markSettingsDirtyRef,
      onInitSettingsRef,
      panelSelect,
      savePreferences,
    }),
    [conceptSelect, currentConcept, currentPanel, isLoading, panelSelect, savePreferences]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export default PreferencesProvider
