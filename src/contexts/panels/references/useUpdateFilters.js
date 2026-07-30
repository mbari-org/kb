import { useCallback } from 'react'

import { CONCEPT } from '@/lib/constants'
import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES } = SELECTED.SETTINGS
const EMPTY_FILTERS = {
  [REFERENCES.FILTERS.CITATION]: '',
  [REFERENCES.FILTERS.CONCEPT]: '',
  [REFERENCES.FILTERS.CONCEPTS]: '',
  [REFERENCES.FILTERS.EXTENT]: CONCEPT.EXTENT.SOLO,
}

const useUpdateFilters = (filters, updateSettings) => {
  const updateSetting = useCallback(
    updatedFilters => {
      updateSettings({ [REFERENCES.KEY]: { [REFERENCES.FILTERS.KEY]: updatedFilters } })
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

export { EMPTY_FILTERS }
export default useUpdateFilters
