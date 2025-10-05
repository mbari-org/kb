import { use, useCallback, useMemo } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'

import { createError } from '@/lib/errors'
import { SELECTED } from '@/lib/constants'

const { CONCEPT, PANEL } = SELECTED

const SelectedProvider = ({ children }) => {
  const {
    conceptSelect,
    getSettings,
    isLoading,
    panelSelect,
    updateSettings,
  } = use(PreferencesContext)

  const getSelected = useCallback(
    key => {
      if (key === CONCEPT) {
        return conceptSelect.current()
      } else if (key === PANEL) {
        return panelSelect.current()
      } else {
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