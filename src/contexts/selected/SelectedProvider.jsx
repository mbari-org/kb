import { use, useCallback, useEffect, useMemo } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'

import useSettings from '@/contexts/selected/useSettings'
import { createError } from '@/lib/errors'
import { SELECTED } from '@/lib/constants'

const { CONCEPT, PANEL } = SELECTED

const SelectedProvider = ({ children }) => {
  const {
    conceptSelect,
    getSettingsRef,
    isLoading,
    onSettingsChangeRef,
    onSettingsInitRef,
    panelSelect,
  } = use(PreferencesContext)
  const { settings, setSettings, getSettings, updateSettings: originalUpdateSettings } = useSettings()

  useEffect(() => {
    onSettingsInitRef.current = setSettings
    getSettingsRef.current = () => settings
  }, [setSettings, settings, onSettingsInitRef, getSettingsRef])

  const getSelected = useCallback(
    key => {
      switch (key) {
        case CONCEPT:
          return conceptSelect.current()

        case PANEL:
          return panelSelect.current()

        default:
          throw createError(
            'Invalid Selection Key',
            `Cannot get selection for unknown key: ${key}`,
            { key }
          )
      }
    },
    [conceptSelect, panelSelect]
  )

  const updateSelected = useCallback(
    ({ concept: conceptName, panel: panelName }) => {
      if (conceptName && conceptName !== conceptSelect.current()) {
        conceptSelect.push(conceptName)
      }

      if (panelName && panelName !== panelSelect.current()) {
        panelSelect.push(panelName)
      }
    },
    [conceptSelect, panelSelect]
  )

  const updateSettings = useCallback(arg => {
    originalUpdateSettings(arg)
    if (onSettingsChangeRef.current) {
      onSettingsChangeRef.current(arg)
    }
  }, [originalUpdateSettings, onSettingsChangeRef])

  const value = useMemo(
    () => ({
      concepts: conceptSelect,
      getSelected,
      getSettings,
      isLoading,
      panels: panelSelect,
      settings,
      setSettings,
      updateSelected,
      updateSettings,
    }),
    [
      conceptSelect,
      getSelected,
      getSettings,
      isLoading,
      panelSelect,
      settings,
      setSettings,
      updateSelected,
      updateSettings,
    ]
  )

  return <SelectedContext.Provider value={value}>{children}</SelectedContext.Provider>
}

export default SelectedProvider