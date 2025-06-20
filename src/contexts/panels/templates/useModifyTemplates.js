import ConfigContext from '@/contexts/config/ConfigContext'
import {
  createConceptTemplate,
  deleteConceptTemplate,
  updateTemplate,
} from '@/lib/api/linkTemplates'
import { use, useCallback } from 'react'
import useExplicitConcepts from './useExplicitConcepts'
import useLoadTemplateData from './useLoadTemplates'
import useTemplatePagination from './useTemplatePagination'

const useModifyTemplates = ({
  filterConcept,
  filterToConcept,
  filterTemplates,
  setCount,
  setTemplateConcepts,
  setDisplayTemplates,
}) => {
  const { apiFns } = use(ConfigContext)
  const loadConceptsList = useExplicitConcepts()
  const loadTemplates = useLoadTemplateData()
  const { limit, offset } = useTemplatePagination()

  const refreshData = useCallback(async () => {
    if (filterConcept || filterToConcept) {
      await filterTemplates(filterConcept, filterToConcept, { limit, offset })
    } else {
      const [newConcepts, { count, templates }] = await Promise.all([
        loadConceptsList(),
        loadTemplates({ limit, offset }),
      ])
      setTemplateConcepts(newConcepts)
      setCount(count)
      setDisplayTemplates(templates)
    }
  }, [
    filterConcept,
    filterToConcept,
    filterTemplates,
    loadConceptsList,
    loadTemplates,
    limit,
    offset,
    setCount,
    setTemplateConcepts,
    setDisplayTemplates,
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
