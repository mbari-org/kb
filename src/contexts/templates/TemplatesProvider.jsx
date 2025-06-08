import { use, useCallback, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import TemplatesContext from './TemplatesContext'

import {
  getConceptTemplates,
  getToConceptTemplateCount,
  getToConceptTemplates,
} from '@/lib/api/linkTemplates'

import {
  createConceptTemplate,
  deleteConceptTemplate,
  getTemplates,
  getTemplatesCount,
  updateTemplate,
} from '@/lib/api/linkTemplates'

import { PAGINATION } from '@/lib/constants'

const DEFAULT_LIMIT = PAGINATION.TEMPLATES.DEFAULT_LIMIT
const DEFAULT_OFFSET = 0

const TemplatesProvider = ({ children }) => {
  const { apiFns } = use(ConfigContext)

  const [count, setCount] = useState(0)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [offset, setOffset] = useState(DEFAULT_OFFSET)

  const [filterConcept, setFilterConcept] = useState(null)
  const [filterToConcept, setFilterToConcept] = useState(null)

  const [templates, setTemplates] = useState([])

  const filterTemplates = useCallback(
    async (concept, toConcept) => {
      if (concept && toConcept) {
        const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, concept)
        const toConceptTemplates = conceptTemplates.filter(
          template => template.toConcept === toConcept
        )
        setTemplates(toConceptTemplates)
        setCount(toConceptTemplates.length)
      } else if (concept) {
        const conceptTemplates = await apiFns.apiPayload(getConceptTemplates, concept)
        setTemplates(conceptTemplates)
        setCount(conceptTemplates.length)
      } else if (toConcept) {
        const [toConceptTemplates, toConceptTemplateCount] = await Promise.all([
          apiFns.apiPayload(getToConceptTemplates, toConcept),
          apiFns.apiPayload(getToConceptTemplateCount, toConcept),
        ])
        setCount(toConceptTemplateCount)
        setTemplates(toConceptTemplates)
      } else {
        const [count, templates] = await Promise.all([
          apiFns.apiResult(getTemplatesCount),
          apiFns.apiPaginated(getTemplates, { limit, offset }),
        ])
        setCount(count)
        setTemplates(templates)
      }
    },
    [apiFns, limit, offset]
  )

  const handleConceptFilter = useCallback(
    conceptName => {
      setFilterConcept(conceptName)
      filterTemplates(conceptName, filterToConcept)
    },
    [filterTemplates, filterToConcept]
  )

  const handleToConceptFilter = useCallback(
    toConceptName => {
      setFilterToConcept(toConceptName)
      filterTemplates(filterConcept, toConceptName)
    },
    [filterTemplates, filterConcept]
  )

  const loadData = useCallback(async () => {
    if (!apiFns) return

    const [count, templates] = await Promise.all([
      apiFns.apiResult(getTemplatesCount),
      apiFns.apiPaginated(getTemplates, { limit, offset }),
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
