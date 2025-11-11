import { SELECTED } from '@/lib/constants/selected.js'
import { useCallback } from 'react'

const { TEMPLATES } = SELECTED.SETTINGS
const { CONCEPT, TO_CONCEPT, LINK_NAME, LINK_VALUE } = TEMPLATES.FILTERS

const FILTERS = [CONCEPT, TO_CONCEPT, LINK_NAME, LINK_VALUE]

const EMPTY_FILTERS = FILTERS.reduce((acc, key) => {
  acc[key] = ''
  return acc
}, {})

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
      FILTERS.forEach(key => {
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
