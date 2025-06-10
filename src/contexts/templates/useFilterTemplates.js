import { useCallback } from 'react'

import {
  getConceptTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

export const useFilterTemplates = ({ apiFns, setCount, setTemplates }) => {
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

  return filterTemplates
}
