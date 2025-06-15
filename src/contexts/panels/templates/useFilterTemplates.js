import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'

import {
  getConceptTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

const useFilterTemplates = ({
  setFilterConcept,
  setFilterToConcept,
  setOffset,
  limit,
  loadTemplateData,
  setCount,
  setTemplates,
}) => {
  const { apiFns } = use(ConfigContext)

  const filterAndPaginateTemplates = useCallback(
    async (templates, pageParams) => {
      // Apply pagination to the filtered results
      const start = pageParams.offset
      const end = start + pageParams.limit
      const paginatedTemplates = templates.slice(start, end)

      setCount(templates.length)
      setTemplates(paginatedTemplates)
    },
    [setCount, setTemplates]
  )

  const filterTemplates = useCallback(
    async (concept, toConcept, pageParams) => {
      if (!apiFns) return

      const loadTemplates = async () => {
        if (concept && toConcept) {
          // If both filters are active, get concept templates and filter by toConcept
          const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, concept)
          const filteredTemplates = conceptTemplates.filter(
            template => template.toConcept === toConcept
          )
          await filterAndPaginateTemplates(filteredTemplates, pageParams)
          return
        }

        if (concept) {
          // Get templates for concept
          const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, concept)
          await filterAndPaginateTemplates(conceptTemplates, pageParams)
          return
        }

        if (toConcept) {
          // Get templates for toConcept
          const toConceptTemplates = await apiFns.apiPayload(getToConceptTemplates, toConcept)
          await filterAndPaginateTemplates(toConceptTemplates, pageParams)
          return
        }

        // No filters - use regular paginated endpoint
        const [count, templates] = await Promise.all([
          apiFns.apiResult(getTemplatesCount),
          apiFns.apiPaginated(getTemplates, pageParams),
        ])
        setCount(count)
        setTemplates(templates)
      }

      await loadTemplates()
    },
    [apiFns, filterAndPaginateTemplates, setCount, setTemplates]
  )

  const handleConceptFilter = useCallback(
    conceptName => {
      setFilterConcept(conceptName)
      setOffset(0) // Reset to first page when changing filters
      if (conceptName) {
        filterTemplates(conceptName, null, { limit, offset: 0 })
      } else {
        loadTemplateData({ limit, offset: 0 }).then(({ count, templates }) => {
          setCount(count)
          setTemplates(templates)
        })
      }
    },
    [filterTemplates, loadTemplateData, limit, setFilterConcept, setOffset, setCount, setTemplates]
  )

  const handleToConceptFilter = useCallback(
    toConceptName => {
      setFilterToConcept(toConceptName)
      setOffset(0) // Reset to first page when changing filters
      if (toConceptName) {
        filterTemplates(null, toConceptName, { limit, offset: 0 })
      } else {
        loadTemplateData({ limit, offset: 0 }).then(({ count, templates }) => {
          setCount(count)
          setTemplates(templates)
        })
      }
    },
    [
      filterTemplates,
      loadTemplateData,
      limit,
      setFilterToConcept,
      setOffset,
      setCount,
      setTemplates,
    ]
  )

  return {
    handleConceptFilter,
    handleToConceptFilter,
    filterTemplates,
  }
}

export default useFilterTemplates
