import { useCallback } from 'react'

import {
  getConceptTemplates,
  getTemplates,
  getTemplatesCount,
  getToConceptTemplateCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

export const useFilterTemplates = ({ apiFns, setCount, setTemplates }) => {
  const setConceptTemplates = useCallback(
    async (concept, toConcept, pageParams) => {
      const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, concept)
      const filteredTemplates = toConcept
        ? conceptTemplates.filter(template => template.toConcept === toConcept)
        : conceptTemplates

      // Apply pagination to the filtered results
      const start = pageParams.offset
      const end = start + pageParams.limit
      const paginatedTemplates = filteredTemplates.slice(start, end)

      setCount(filteredTemplates.length)
      setTemplates(paginatedTemplates)
    },
    [apiFns, setCount, setTemplates]
  )

  const setToConceptTemplates = useCallback(
    async (toConcept, pageParams) => {
      const [toConceptTemplateCount, toConceptTemplates] = await Promise.all([
        apiFns.apiPayload(getToConceptTemplateCount, toConcept),
        apiFns.apiPaginated(getToConceptTemplates, [toConcept, pageParams]),
      ])
      setCount(toConceptTemplateCount)
      setTemplates(toConceptTemplates)
    },
    [apiFns, setCount, setTemplates]
  )

  const filterTemplates = useCallback(
    async (concept, toConcept, pageParams) => {
      const loadTemplates = async () => {
        if (concept) {
          setConceptTemplates(concept, toConcept, pageParams)
          return
        }

        if (toConcept) {
          setToConceptTemplates(toConcept, pageParams)
          return
        }

        const [count, templates] = await Promise.all([
          apiFns.apiResult(getTemplatesCount),
          apiFns.apiPaginated(getTemplates, pageParams),
        ])
        setCount(count)
        setTemplates(templates)
      }

      await loadTemplates()
    },
    [apiFns, setConceptTemplates, setToConceptTemplates, setCount, setTemplates]
  )

  return filterTemplates
}
