import { useCallback } from 'react'

import { EMPTY_FILTERS } from '@/contexts/panels/realizations/constants'
import { SELECTED } from '@/lib/constants/selected.js'

const { REALIZATIONS } = SELECTED.SETTINGS

const useUpdateFilters = (filters, updateSettings) => {
  const updateSetting = useCallback(
    updatedFilters => {
      updateSettings({ [REALIZATIONS.KEY]: { [REALIZATIONS.FILTERS.KEY]: updatedFilters } })
    },
    [updateSettings]
  )

  const updateFilters = useCallback(
    updates => {
      if (updates === null) {
        updateSetting(EMPTY_FILTERS)
        return
      }

      const updatedFilters = { ...filters }
      Object.keys(EMPTY_FILTERS).forEach(key => {
        if (updates[key] !== undefined) {
          const value = updates[key]
          updatedFilters[key] = value && value.trim() ? value : ''
        }
      })
      updateSetting(updatedFilters)
    },
    [filters, updateSetting]
  )

  return { updateFilters }
}

export default useUpdateFilters
