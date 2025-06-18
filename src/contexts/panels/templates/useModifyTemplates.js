import ConfigContext from '@/contexts/config/ConfigContext'
import {
  createConceptTemplate,
  deleteConceptTemplate,
  updateTemplate,
} from '@/lib/api/linkTemplates'
import { use, useCallback } from 'react'
import useLoadTemplateData from './useLoadTemplateData'
import useTemplateConcepts from './useTemplateConcepts'
import useTemplatePagination from './useTemplatePagination'

const useModifyTemplates = ({
  filterConcept,
  filterToConcept,
  filterTemplates,
  setCount,
  setSelectableConcepts,
  setTemplates,
}) => {
  const { apiFns } = use(ConfigContext)
  const loadConceptsList = useTemplateConcepts()
  const loadTemplateData = useLoadTemplateData()
  const { limit, offset } = useTemplatePagination()

  const refreshData = useCallback(async () => {
    if (filterConcept || filterToConcept) {
      await filterTemplates(filterConcept, filterToConcept, { limit, offset })
    } else {
      const [newConcepts, { count, templates }] = await Promise.all([
        loadConceptsList(),
        loadTemplateData({ limit, offset }),
      ])
      setSelectableConcepts(newConcepts)
      setCount(count)
      setTemplates(templates)
    }
  }, [
    filterConcept,
    filterToConcept,
    filterTemplates,
    loadConceptsList,
    loadTemplateData,
    limit,
    offset,
    setCount,
    setSelectableConcepts,
    setTemplates,
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
