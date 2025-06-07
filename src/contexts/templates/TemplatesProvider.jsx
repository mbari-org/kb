import { use, useCallback, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import TemplatesContext from './TemplatesContext'

import {
  getLinkTemplates,
  getLinkTemplatesCount,
  deleteConceptLinkTemplate,
  updateConceptLinkTemplate,
  createConceptLinkTemplate,
} from '@/lib/api/linkTemplates'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.TEMPLATES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const TemplatesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [count, setCount] = useState(0)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)
  const [templates, setTemplates] = useState([])

  const loadData = useCallback(async () => {
    if (!apiFns) return

    const [count, templates] = await Promise.all([
      apiFns.apiResult(getLinkTemplatesCount),
      apiFns.apiPaginated(getLinkTemplates, { limit, offset }),
    ])

    setCount(count)
    setTemplates(templates)
  }, [apiFns, limit, offset])

  useEffect(() => {
    loadData()
  }, [loadData])

  const nextPage = () => {
    setOffset(prev => prev + limit)
  }

  const prevPage = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }

  const setPageSize = newLimit => {
    setLimit(newLimit)
    setOffset(0) // Reset to first page when changing page size
  }

  const deleteTemplate = useCallback(
    async template => {
      await apiFns.apiPayload(deleteConceptLinkTemplate, template.id)
      await loadData() // Reload data after deletion
    },
    [apiFns, loadData]
  )

  const editTemplate = useCallback(
    async (oldTemplate, newTemplate) => {
      await apiFns.apiPayload(updateConceptLinkTemplate, [oldTemplate.id, newTemplate])
      await loadData() // Reload data after edit
    },
    [apiFns, loadData]
  )

  const addTemplate = useCallback(
    async template => {
      await apiFns.apiPayload(createConceptLinkTemplate, template)
      await loadData() // Reload data after adding
    },
    [apiFns, loadData]
  )

  const value = {
    addTemplate,
    count,
    deleteTemplate,
    editTemplate,
    limit,
    nextPage,
    offset,
    prevPage,
    setPageSize,
    templates,
  }

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export default TemplatesProvider
