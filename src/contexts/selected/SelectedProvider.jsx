import { use, useCallback, useEffect, useMemo } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'

import useSettings from '@/contexts/selected/useSettings'
import { createError } from '@/lib/errors'
import { SELECTED } from '@/lib/constants/selected.js'

const { CONCEPT, PANEL } = SELECTED

const SelectedProvider = ({ children }) => {
  const { conceptSelection, getSettingsRef, isLoading, markSettingsDirtyRef, onInitSettingsRef, panelSelection } =
    use(PreferencesContext)
  const { settings, setSettings, getSettings, updateSettings: stateUpdateSettings } = useSettings()

  useEffect(() => {
    onInitSettingsRef.current = setSettings
    getSettingsRef.current = () => settings
  }, [setSettings, settings, onInitSettingsRef, getSettingsRef])

  const getSelected = useCallback(
    key => {
      switch (key) {
        case CONCEPT:
          return conceptSelection.current()

        case PANEL:
          return panelSelection.current()

        default:
          throw createError('Invalid Selection Key', `Cannot get selection for unknown key: ${key}`, { key })
      }
    },
    [conceptSelection, panelSelection]
  )

  const updateSelected = useCallback(
    ({ concept: conceptName, panel: panelName }) => {
      if (conceptName && conceptName !== conceptSelection.current()) {
        conceptSelection.push(conceptName)
      }

      if (panelName && panelName !== panelSelection.current()) {
        panelSelection.push(panelName)
      }
    },
    [conceptSelection, panelSelection]
  )

  const persistUpdateSettings = useCallback(
    arg => {
      stateUpdateSettings(arg)
      if (markSettingsDirtyRef.current) {
        markSettingsDirtyRef.current(arg)
      }
    },
    [stateUpdateSettings, markSettingsDirtyRef]
  )

  const value = useMemo(
    () => ({
      concepts: conceptSelection,
      getSelected,
      getSettings,
      isLoading,
      panels: panelSelection,
      settings,
      setSettings,
      updateSelected,
      updateSettings: persistUpdateSettings,
    }),
    [
      conceptSelection,
      getSelected,
      getSettings,
      isLoading,
      panelSelection,
      settings,
      setSettings,
      updateSelected,
      persistUpdateSettings,
    ]
  )

  return <SelectedContext.Provider value={value}>{children}</SelectedContext.Provider>
}

export default SelectedProvider
