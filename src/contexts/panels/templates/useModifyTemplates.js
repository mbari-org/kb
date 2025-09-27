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
      try {
        await apiFns.apiPayload(deleteConceptTemplate, template.id)
        await refreshData()
      } catch (error) {
        throw new Error(`Failed to delete template: ${error.message}`)
      }
    },
    [apiFns, refreshData]
  )

  const editTemplate = useCallback(
    async (oldTemplate, newTemplate) => {
      try {
        await apiFns.apiPayload(updateTemplate, [oldTemplate.id, newTemplate])
        await refreshData()
      } catch (error) {
        throw new Error(`Failed to update template: ${error.message}`)
      }
    },
    [apiFns, refreshData]
  )

  const addTemplate = useCallback(
    async template => {
      try {
        await apiFns.apiPayload(createConceptTemplate, template)
        await refreshData()
      } catch (error) {
        throw new Error(`Failed to create template: ${error.message}`)
      }
    },
    [apiFns, refreshData]
  )

  return { addTemplate, editTemplate, deleteTemplate }
}

export default useModifyTemplates
