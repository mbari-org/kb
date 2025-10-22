import { use, useCallback, useMemo } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'

import { createError } from '@/lib/errors'
import { SELECTED } from '@/lib/constants'

const { CONCEPT, PANEL } = SELECTED

const SelectedProvider = ({ children }) => {
  const { selectedValues } = use(PreferencesContext)
  const {
    conceptSelect,
    getSettings,
    isLoading,
    panelSelect,
    updateSettings,
  } = selectedValues

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

  // CxNote conceptSelect, getSettings, isLoading, panelSelect, updateSettings are pass through from PreferencesProvider
  //  as selectedValues and exported here since they are "selected" values, but due to component hierarchy, they are
  //  required to be maintained at the PreferencesProvider level.

  const value = useMemo(
    () => ({
      concepts: conceptSelect,
      getSelected,
      getSettings,
      isLoading,
      panels: panelSelect,
      updateSelected,
      updateSettings,
    }),
    [conceptSelect, getSelected, getSettings, isLoading, panelSelect, updateSelected, updateSettings]
  )

  return <SelectedContext.Provider value={value}>{children}</SelectedContext.Provider>
}

export default SelectedProvider