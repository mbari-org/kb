import ConfigContext from '@/contexts/config/ConfigContext'
import {
  createConceptTemplate,
  deleteConceptTemplate,
  updateTemplate,
} from '@/lib/api/linkTemplates'
import { use, useCallback } from 'react'

const useModifyTemplates = ({
  filterConcept,
  filterToConcept,
  filterTemplates,
  setCount,
  setDisplayTemplates,
  refreshKBData,
  allTemplates,
  limit,
  offset,
}) => {
  const { apiFns } = use(ConfigContext)

  const refreshData = useCallback(async () => {
    if (filterConcept || filterToConcept) {
      await filterTemplates(filterConcept, filterToConcept, { limit, offset })
    } else {
      // Refresh KBDataProvider data and update local state
      await refreshKBData()

      // Update local state with fresh data from KBDataProvider
      if (allTemplates) {
        setCount(allTemplates.length)
        const start = offset
        const end = start + limit
        const paginatedTemplates = allTemplates.slice(start, end)
        setDisplayTemplates(paginatedTemplates)
      }
    }
  }, [
    filterConcept,
    filterToConcept,
    filterTemplates,
    limit,
    offset,
    setCount,
    setDisplayTemplates,
    refreshKBData,
    allTemplates,
  ])

  const deleteTemplate = useCallback(
    async template => {
      await apiFns.apiPayload(deleteConceptTemplate, template.id)
      await refreshData()
    },
    [apiFns, refreshData]
  )

  const editTemplate = useCallback(
    async (oldTemplate, newTemplate) => {
      await apiFns.apiPayload(updateTemplate, [oldTemplate.id, newTemplate])
      await refreshData()
    },
    [apiFns, refreshData]
  )

  const addTemplate = useCallback(
    async template => {
      await apiFns.apiPayload(createConceptTemplate, template)
      await refreshData()
    },
    [apiFns, refreshData]
  )

  return { addTemplate, editTemplate, deleteTemplate }
}

export default useModifyTemplates
