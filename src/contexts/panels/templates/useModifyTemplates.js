import { use, useCallback } from 'react'

import {
  createConceptTemplate,
  deleteConceptTemplate,
  updateTemplate,
} from '@/lib/api/linkTemplates'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

const useModifyTemplates = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)

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
