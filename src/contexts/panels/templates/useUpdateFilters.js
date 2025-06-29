import { SELECTED } from '@/lib/constants'
import { useCallback } from 'react'

const { TEMPLATES } = SELECTED.SETTINGS
const FILTERS = TEMPLATES.FILTERS

export default function useUpdateFilters(filters, updateSettings) {
  const updateFilters = useCallback(
    updates => {
      const newFilters = { ...filters }

      // Use the constants for all keys
      if (updates[FILTERS.CONCEPT] !== undefined) {
        if (updates[FILTERS.CONCEPT] && updates[FILTERS.CONCEPT].trim()) {
          newFilters[FILTERS.CONCEPT] = updates[FILTERS.CONCEPT]
        } else {
          delete newFilters[FILTERS.CONCEPT]
        }
      }

      if (updates[FILTERS.TO_CONCEPT] !== undefined) {
        if (updates[FILTERS.TO_CONCEPT] && updates[FILTERS.TO_CONCEPT].trim()) {
          newFilters[FILTERS.TO_CONCEPT] = updates[FILTERS.TO_CONCEPT]
        } else {
          delete newFilters[FILTERS.TO_CONCEPT]
        }
      }

      if (updates[FILTERS.LINK_NAME] !== undefined) {
        if (updates[FILTERS.LINK_NAME] && updates[FILTERS.LINK_NAME].trim()) {
          newFilters[FILTERS.LINK_NAME] = updates[FILTERS.LINK_NAME]
        } else {
          delete newFilters[FILTERS.LINK_NAME]
        }
      }

      if (updates[FILTERS.LINK_VALUE] !== undefined) {
        if (updates[FILTERS.LINK_VALUE] && updates[FILTERS.LINK_VALUE].trim()) {
          newFilters[FILTERS.LINK_VALUE] = updates[FILTERS.LINK_VALUE]
        } else {
          delete newFilters[FILTERS.LINK_VALUE]
        }
      }

      updateSettings({ [TEMPLATES.KEY]: { [FILTERS.KEY]: newFilters } })
    },
    [filters, updateSettings]
  )

  return { updateFilters }
}
