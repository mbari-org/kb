import { useCallback } from 'react'

import dataFilters from '@/contexts/panels/dataFilters'
import { SELECTED } from '@/lib/constants/selected.js'

const PANEL_SETTINGS = {
  [SELECTED.SETTINGS.REALIZATIONS.KEY]: SELECTED.SETTINGS.REALIZATIONS,
  [SELECTED.SETTINGS.REFERENCES.KEY]: SELECTED.SETTINGS.REFERENCES,
  [SELECTED.SETTINGS.TEMPLATES.KEY]: SELECTED.SETTINGS.TEMPLATES,
}

const useUpdateFilters = (panel, updateSettings) => {
  const panelSettings = PANEL_SETTINGS[panel]
  if (!panelSettings) {
    throw new Error(`Unknown panel filters: ${panel}`)
  }

  const { EMPTY_FILTERS } = dataFilters(panel)

  const updateFilters = useCallback(
    updates => {
      if (updates === null) {
        updateSettings({
          [panelSettings.KEY]: {
            [panelSettings.FILTERS.KEY]: { ...EMPTY_FILTERS },
            replaceFilters: true,
          },
        })
        return
      }

      const filterUpdates = {}
      Object.keys(EMPTY_FILTERS).forEach(key => {
        if (updates[key] !== undefined) {
          const value = updates[key]
          filterUpdates[key] = value && value.trim() ? value : ''
        }
      })
      updateSettings({ [panelSettings.KEY]: { [panelSettings.FILTERS.KEY]: filterUpdates } })
    },
    [EMPTY_FILTERS, panelSettings, updateSettings]
  )

  return { updateFilters }
}

export default useUpdateFilters
