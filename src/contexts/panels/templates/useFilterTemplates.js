import { use, useCallback, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { SELECTED } from '@/lib/constants'
import {
  getAvailableTemplates,
  getExplicitTemplates,
  getToConceptTemplates,
} from '@/lib/kb/api/templates'

const { TEMPLATES } = SELECTED.SETTINGS

const useFilterTemplates = ({
  byAvailable,
  filterConcept,
  filterToConcept,
  limit,
  setCount,
  setDisplayTemplates,
  setConceptTemplates,
  updateSelected,
  updateSettings,
  getSettings,
}) => {
  const { apiFns } = use(ConfigContext)
  const { templates: allTemplates } = use(PanelDataContext)

  const [conceptTemplatesCache, setConceptTemplatesCache] = useState([])

  const filterAndPaginateTemplates = useCallback(
    async (templates, pageParams) => {
      setConceptTemplates(templates)

      const start = pageParams.offset
      const end = start + pageParams.limit
      const paginatedTemplates = templates.slice(start, end)

      setCount(templates.length)
      setDisplayTemplates(paginatedTemplates)
    },
    [setCount, setDisplayTemplates, setConceptTemplates]
  )

  const filterTemplates = useCallback(
    async (concept, toConcept, pageParams, force = false) => {
      if (!apiFns) return

      const loadTemplates = async () => {
        // Case 1: Both concept and toConcept filters are active
        if (concept && toConcept) {
          if (!force && conceptTemplatesCache.length > 0 && filterConcept === concept) {
            const filteredTemplates = conceptTemplatesCache.filter(
              template => template.toConcept === toConcept
            )
            await filterAndPaginateTemplates(filteredTemplates, pageParams)
          } else {
            const conceptTemplates = await apiFns.apiPayload(
              byAvailable ? getAvailableTemplates : getExplicitTemplates,
              concept
            )
            setConceptTemplatesCache(conceptTemplates)
            const filteredTemplates = conceptTemplates.filter(
              template => template.toConcept === toConcept
            )
            await filterAndPaginateTemplates(filteredTemplates, pageParams)
          }
          return
        }

        // Case 2: Only concept filter is active
        if (concept) {
          if (!force && conceptTemplatesCache.length > 0 && filterConcept === concept) {
            await filterAndPaginateTemplates(conceptTemplatesCache, pageParams)
          } else {
            const conceptTemplates = await apiFns.apiPayload(
              byAvailable ? getAvailableTemplates : getExplicitTemplates,
              concept
            )
            setConceptTemplatesCache(conceptTemplates)
            await filterAndPaginateTemplates(conceptTemplates, pageParams)
          }
          return
        }

        // Case 3: Only toConcept filter is active
        if (toConcept) {
          const toConceptTemplates = await apiFns.apiPayload(getToConceptTemplates, toConcept)
          await filterAndPaginateTemplates(toConceptTemplates, pageParams)
          return
        }

        // Case 4: No filters - use data from KBDataProvider
        if (allTemplates) {
          setCount(allTemplates.length)
          const start = pageParams.offset
          const end = start + pageParams.limit
          const paginatedTemplates = allTemplates.slice(start, end)
          setDisplayTemplates(paginatedTemplates)
          setConceptTemplates([])
          setConceptTemplatesCache([]) // Clear cache when no filters
        }
      }

      await loadTemplates()
    },
    [
      apiFns,
      byAvailable,
      filterAndPaginateTemplates,
      setCount,
      setDisplayTemplates,
      setConceptTemplates,
      conceptTemplatesCache,
      filterConcept,
      setConceptTemplatesCache,
      allTemplates,
    ]
  )

  const handleConceptFilter = useCallback(
    conceptName => {
      setConceptTemplates([])
      // Store the filter concept in settings
      const newFilters = { ...getSettings(TEMPLATES.KEY, TEMPLATES.FILTERS.KEY) }
      if (conceptName) {
        newFilters[TEMPLATES.FILTERS.CONCEPT] = conceptName
      } else {
        delete newFilters[TEMPLATES.FILTERS.CONCEPT]
      }
      updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.FILTERS.KEY]: newFilters } })
      // Also update the global concept selection
      if (conceptName) {
        updateSelected({ [SELECTED.CONCEPT]: conceptName })
      }
      // Clear cache when concept changes
      if (conceptName !== filterConcept) {
        setConceptTemplatesCache([])
      }
      if (conceptName) {
        filterTemplates(conceptName, filterToConcept, { limit, offset: 0 })
      } else {
        // If concept is deselected, check if toConcept is still active
        if (filterToConcept) {
          filterTemplates(null, filterToConcept, { limit, offset: 0 })
        } else {
          // No filters active - use data from KBDataProvider
          if (allTemplates) {
            setCount(allTemplates.length)
            const start = 0
            const end = start + limit
            const paginatedTemplates = allTemplates.slice(start, end)
            setDisplayTemplates(paginatedTemplates)
          }
        }
      }
    },
    [
      filterConcept,
      filterToConcept,
      filterTemplates,
      limit,
      updateSelected,
      updateSettings,
      getSettings,
      setConceptTemplates,
      setConceptTemplatesCache,
      setCount,
      setDisplayTemplates,
      allTemplates,
    ]
  )

  const handleToConceptFilter = useCallback(
    toConceptName => {
      setConceptTemplates([])
      // Store the filter toConcept in settings
      const newFilters = { ...getSettings(TEMPLATES.KEY, TEMPLATES.FILTERS.KEY) }
      if (toConceptName) {
        newFilters[TEMPLATES.FILTERS.TO_CONCEPT] = toConceptName
      } else {
        delete newFilters[TEMPLATES.FILTERS.TO_CONCEPT]
      }
      updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.FILTERS.KEY]: newFilters } })
      if (toConceptName) {
        // Pass current concept filter to avoid unnecessary fetching
        filterTemplates(filterConcept, toConceptName, { limit, offset: 0 })
      } else {
        // If clearing toConcept filter, show all templates for current concept
        if (filterConcept) {
          filterTemplates(filterConcept, null, { limit, offset: 0 })
        } else {
          // No filters active - use data from KBDataProvider
          if (allTemplates) {
            setCount(allTemplates.length)
            const start = 0
            const end = start + limit
            const paginatedTemplates = allTemplates.slice(start, end)
            setDisplayTemplates(paginatedTemplates)
          }
        }
      }
    },
    [
      filterConcept,
      filterTemplates,
      limit,
      setConceptTemplates,
      setCount,
      setDisplayTemplates,
      allTemplates,
      updateSettings,
      getSettings,
    ]
  )

  const clearCache = useCallback(() => {
    setConceptTemplatesCache([])
  }, [])

  const refreshCurrentConcept = useCallback(() => {
    if (filterConcept) {
      setConceptTemplatesCache([])
      setConceptTemplates([])
      filterTemplates(filterConcept, filterToConcept, { limit, offset: 0 }, true)
    }
  }, [filterConcept, filterToConcept, filterTemplates, limit, setConceptTemplates])

  return {
    clearCache,
    filterTemplates,
    handleConceptFilter,
    handleToConceptFilter,
    refreshCurrentConcept,
  }
}

export default useFilterTemplates
