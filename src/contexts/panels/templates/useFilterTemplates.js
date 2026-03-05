import { use, useCallback, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import {
  getAvailableTemplates,
  getExplicitTemplates,
  getToConceptTemplates,
} from '@/lib/api/templates'
import { SELECTED } from '@/lib/constants/selected.js'

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

  const updateTemplateFilterSetting = useCallback(
    (filterKey, filterValue) => {
      const newFilters = { ...getSettings(TEMPLATES.KEY, TEMPLATES.FILTERS.KEY) }
      if (filterValue) {
        newFilters[filterKey] = filterValue
      } else {
        delete newFilters[filterKey]
      }
      updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.FILTERS.KEY]: newFilters } })
    },
    [getSettings, updateSettings]
  )

  const showAllTemplatesFirstPage = useCallback(() => {
    if (allTemplates) {
      setCount(allTemplates.length)
      const start = 0
      const end = start + limit
      const paginatedTemplates = allTemplates.slice(start, end)
      setDisplayTemplates(paginatedTemplates)
    }
  }, [allTemplates, limit, setCount, setDisplayTemplates])

  const applyTemplateFilters = useCallback(
    (concept, toConcept) => {
      if (concept || toConcept) {
        filterTemplates(concept, toConcept, { limit, offset: 0 })
      } else {
        showAllTemplatesFirstPage()
      }
    },
    [filterTemplates, limit, showAllTemplatesFirstPage]
  )

  const initializeTemplateFilterUpdate = useCallback(
    (filterKey, filterValue, concept, toConcept) => {
      setConceptTemplates([])
      updateTemplateFilterSetting(filterKey, filterValue)
      const nextConcept = concept || null
      const nextToConcept = toConcept || null
      return { nextConcept, nextToConcept }
    },
    [setConceptTemplates, updateTemplateFilterSetting]
  )

  const handleConceptFilter = useCallback(
    conceptName => {
      const hasConcept = Boolean(conceptName)
      const changedConcept = conceptName !== filterConcept
      const { nextConcept, nextToConcept } = initializeTemplateFilterUpdate(
        TEMPLATES.FILTERS.CONCEPT,
        conceptName,
        conceptName,
        filterToConcept
      )

      if (hasConcept) {
        updateSelected({ [SELECTED.CONCEPT]: conceptName })
      }

      if (changedConcept) {
        setConceptTemplatesCache([])
      }
      applyTemplateFilters(nextConcept, nextToConcept)
    },
    [
      applyTemplateFilters,
      filterConcept,
      filterToConcept,
      initializeTemplateFilterUpdate,
      setConceptTemplatesCache,
      updateSelected,
    ]
  )

  const handleToConceptFilter = useCallback(
    toConceptName => {
      const { nextConcept, nextToConcept } = initializeTemplateFilterUpdate(
        TEMPLATES.FILTERS.TO_CONCEPT,
        toConceptName,
        filterConcept,
        toConceptName
      )

      applyTemplateFilters(nextConcept, nextToConcept)
    },
    [
      applyTemplateFilters,
      filterConcept,
      initializeTemplateFilterUpdate,
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
