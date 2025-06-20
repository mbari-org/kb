import { use, useCallback, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import {
  getAvailableTemplates,
  getExplicitTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

const useFilterTemplates = ({
  available,
  resetPagination,
  limit,
  loadTemplates,
  setCount,
  setDisplayTemplates,
  setConceptTemplates,
}) => {
  const { apiFns } = use(ConfigContext)

  const [filterConcept, setFilterConcept] = useState(null)
  const [filterToConcept, setFilterToConcept] = useState(null)
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
              available ? getAvailableTemplates : getExplicitTemplates,
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
              available ? getAvailableTemplates : getExplicitTemplates,
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

        // Case 4: No filters - use regular paginated endpoint
        const [count, templates] = await Promise.all([
          apiFns.apiResult(getTemplatesCount),
          apiFns.apiPaginated(getTemplates, pageParams),
        ])
        setCount(count)
        setDisplayTemplates(templates)
        setConceptTemplates([])
        setConceptTemplatesCache([]) // Clear cache when no filters
      }

      await loadTemplates()
    },
    [
      apiFns,
      available,
      filterAndPaginateTemplates,
      setCount,
      setDisplayTemplates,
      setConceptTemplates,
      conceptTemplatesCache,
      filterConcept,
      setConceptTemplatesCache,
    ]
  )

  const handleConceptFilter = useCallback(
    conceptName => {
      setFilterConcept(conceptName)
      resetPagination()
      setConceptTemplates([])
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
          // No filters active - load regular paginated data
          loadTemplates({ limit, offset: 0 }).then(({ count, templates }) => {
            setCount(count)
            setDisplayTemplates(templates)
          })
        }
      }
    },
    [
      filterConcept,
      filterToConcept,
      filterTemplates,
      limit,
      loadTemplates,
      resetPagination,
      setConceptTemplates,
      setConceptTemplatesCache,
      setCount,
      setDisplayTemplates,
    ]
  )

  const handleToConceptFilter = useCallback(
    toConceptName => {
      setFilterToConcept(toConceptName)
      resetPagination()
      setConceptTemplates([])
      if (toConceptName) {
        // Pass current concept filter to avoid unnecessary fetching
        filterTemplates(filterConcept, toConceptName, { limit, offset: 0 })
      } else {
        // If clearing toConcept filter, show all templates for current concept
        if (filterConcept) {
          filterTemplates(filterConcept, null, { limit, offset: 0 })
        } else {
          loadTemplates({ limit, offset: 0 }).then(({ count, templates }) => {
            setCount(count)
            setDisplayTemplates(templates)
          })
        }
      }
    },
    [
      filterConcept,
      filterTemplates,
      limit,
      loadTemplates,
      resetPagination,
      setConceptTemplates,
      setCount,
      setDisplayTemplates,
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
    filterConcept,
    filterTemplates,
    filterToConcept,
    handleConceptFilter,
    handleToConceptFilter,
    refreshCurrentConcept,
  }
}

export default useFilterTemplates
