import { useCallback } from 'react'

import { SELECTED } from '@/lib/constants/selected.js'
import { drop, emptyValues } from '@/lib/utils'

const { TEMPLATES } = SELECTED.SETTINGS

const FILTERS = drop(SELECTED.SETTINGS.TEMPLATES.FILTERS, [TEMPLATES.FILTERS.KEY])
const EMPTY_FILTERS = emptyValues(FILTERS)

const useUpdateFilters = (filters, updateSettings) => {
  const updateSetting = useCallback(
    updatedFilters => {
      updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.FILTERS.KEY]: updatedFilters } })
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
      EMPTY_FILTERS.forEach(key => {
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
