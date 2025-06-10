import { use, useCallback, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import TemplatesContext from './TemplatesContext'
import { useFilterTemplates } from './useFilterTemplates'

import {
  createConceptTemplate,
  deleteConceptTemplate,
  getTemplates,
  getTemplatesCount,
  updateTemplate,
} from '@/lib/api/linkTemplates'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.TEMPLATES.DEFAULT_LIMIT

const TemplatesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [count, setCount] = useState(0)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(0)

  const [filterConcept, setFilterConcept] = useState(null)
  const [filterToConcept, setFilterToConcept] = useState(null)

  const [templates, setTemplates] = useState([])

  const filterTemplates = useFilterTemplates({
    apiFns,
    setCount,
    setTemplates,
  })

  const handleConceptFilter = useCallback(
    conceptName => {
      setFilterConcept(conceptName)
      setOffset(0) // Reset to first page when changing filters
      filterTemplates(conceptName, filterToConcept, { limit, offset: 0 })
    },
    [filterTemplates, filterToConcept, limit]
  )

  const handleToConceptFilter = useCallback(
    toConceptName => {
      setFilterToConcept(toConceptName)
      setOffset(0) // Reset to first page when changing filters
      filterTemplates(filterConcept, toConceptName, { limit, offset: 0 })
    },
    [filterTemplates, filterConcept, limit]
  )

  const loadData = useCallback(async () => {
    if (!apiFns) return

    // If we have any filters active, use filterTemplates instead
    if (filterConcept || filterToConcept) {
      filterTemplates(filterConcept, filterToConcept, { limit, offset })
      return
    }

    const [count, templates] = await Promise.all([
      apiFns.apiResult(getTemplatesCount),
      apiFns.apiPaginated(getTemplates, { limit, offset }),
    ])

    setCount(count)
    setTemplates(templates)
  }, [apiFns, limit, offset, filterConcept, filterToConcept, filterTemplates])

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
      await apiFns.apiPayload(deleteConceptTemplate, template.id)
      await loadData() // Reload data after deletion
    },
    [apiFns, loadData]
  )

  const editTemplate = useCallback(
    async (oldTemplate, newTemplate) => {
      await apiFns.apiPayload(updateTemplate, [oldTemplate.id, newTemplate])
      await loadData() // Reload data after edit
    },
    [apiFns, loadData]
  )

  const addTemplate = useCallback(
    async template => {
      await apiFns.apiPayload(createConceptTemplate, template)
      await loadData() // Reload data after adding
    },
    [apiFns, loadData]
  )

  const value = {
    addTemplate,
    count,
    deleteTemplate,
    editTemplate,
    filterConcept,
    filterToConcept,
    handleConceptFilter,
    handleToConceptFilter,
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
