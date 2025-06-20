import { use, useCallback, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import {
  getConceptTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

const useFilterTemplates = ({
  resetPagination,
  limit,
  loadTemplateData,
  setCount,
  setTemplates,
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
      setTemplates(paginatedTemplates)
    },
    [setCount, setTemplates, setConceptTemplates]
  )

  const filterTemplates = useCallback(
    async (concept, toConcept, pageParams) => {
      if (!apiFns) return

      const loadTemplates = async () => {
        // Case 1: Both concept and toConcept filters are active
        if (concept && toConcept) {
          // Check if we already have the concept templates cached
          if (conceptTemplatesCache.length > 0 && filterConcept === concept) {
            // Use cached concept templates and filter by toConcept
            const filteredTemplates = conceptTemplatesCache.filter(
              template => template.toConcept === toConcept
            )
            await filterAndPaginateTemplates(filteredTemplates, pageParams)
          } else {
            // Fetch concept templates and cache them
            const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, concept)
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
          // Check if we already have the concept templates cached
          if (conceptTemplatesCache.length > 0 && filterConcept === concept) {
            await filterAndPaginateTemplates(conceptTemplatesCache, pageParams)
          } else {
            // Fetch concept templates and cache them
            const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, concept)
            setConceptTemplatesCache(conceptTemplates)
            await filterAndPaginateTemplates(conceptTemplates, pageParams)
          }
          return
        }

        // Case 3: Only toConcept filter is active
        if (toConcept) {
          // No cached concept templates when only toConcept is active, so fetch toConcept templates
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
        setTemplates(templates)
        setConceptTemplates([])
        setConceptTemplatesCache([]) // Clear cache when no filters
      }

      await loadTemplates()
    },
    [
      apiFns,
      filterAndPaginateTemplates,
      setCount,
      setTemplates,
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
          loadTemplateData({ limit, offset: 0 }).then(({ count, templates }) => {
            setCount(count)
            setTemplates(templates)
          })
        }
      }
    },
    [
      filterConcept,
      filterToConcept,
      filterTemplates,
      limit,
      loadTemplateData,
      resetPagination,
      setConceptTemplates,
      setConceptTemplatesCache,
      setCount,
      setTemplates,
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
          loadTemplateData({ limit, offset: 0 }).then(({ count, templates }) => {
            setCount(count)
            setTemplates(templates)
          })
        }
      }
    },
    [
      filterConcept,
      filterTemplates,
      limit,
      loadTemplateData,
      resetPagination,
      setConceptTemplates,
      setCount,
      setTemplates,
    ]
  )

  return {
    filterConcept,
    filterTemplates,
    filterToConcept,
    handleConceptFilter,
    handleToConceptFilter,
  }
}

export default useFilterTemplates
