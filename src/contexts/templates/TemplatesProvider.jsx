import { use, useCallback, useEffect, useState } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import TemplatesContext from './TemplatesContext'

import useFilterTemplates from './useFilterTemplates'
import useLoadTemplateData from './useLoadTemplateData'
import useTemplateConcepts from './useTemplateConcepts'

import {
  createConceptTemplate,
  deleteConceptTemplate,
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
  const [selectableConcepts, setSelectableConcepts] = useState([])

  const loadConceptsList = useTemplateConcepts()
  const loadTemplateData = useLoadTemplateData()
  const { filterTemplates, handleConceptFilter, handleToConceptFilter } = useFilterTemplates({
    count,
    limit,
    loadTemplateData,
    setCount,
    setFilterConcept,
    setFilterToConcept,
    setOffset,
    setTemplates,
  })

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
      const [newConcepts, { count, templates }] = await Promise.all([
        loadConceptsList(),
        loadTemplateData({ limit, offset }),
      ])
      setSelectableConcepts(newConcepts)
      setCount(count)
      setTemplates(templates)
    },
    [apiFns, loadConceptsList, loadTemplateData, limit, offset]
  )

  const editTemplate = useCallback(
    async (oldTemplate, newTemplate) => {
      await apiFns.apiPayload(updateTemplate, [oldTemplate.id, newTemplate])
      const [newConcepts, { count, templates }] = await Promise.all([
        loadConceptsList(),
        loadTemplateData({ limit, offset }),
      ])
      setSelectableConcepts(newConcepts)
      setCount(count)
      setTemplates(templates)
    },
    [apiFns, loadConceptsList, loadTemplateData, limit, offset]
  )

  const addTemplate = useCallback(
    async template => {
      await apiFns.apiPayload(createConceptTemplate, template)
      const [newConcepts, { count, templates }] = await Promise.all([
        loadConceptsList(),
        loadTemplateData({ limit, offset }),
      ])
      setSelectableConcepts(newConcepts)
      setCount(count)
      setTemplates(templates)
    },
    [apiFns, loadConceptsList, loadTemplateData, limit, offset]
  )

  useEffect(() => {
    const loadConcepts = async () => {
      const concepts = await loadConceptsList()
      setSelectableConcepts(concepts)
    }
    loadConcepts()
  }, [loadConceptsList])

  useEffect(() => {
    if (filterConcept || filterToConcept) {
      filterTemplates(filterConcept, filterToConcept, { limit, offset })
    } else {
      loadTemplateData({ limit, offset }).then(({ count, templates }) => {
        setCount(count)
        setTemplates(templates)
      })
    }
  }, [filterConcept, filterToConcept, filterTemplates, limit, loadTemplateData, offset])

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
    selectableConcepts,
    setPageSize,
    templates,
  }

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export default TemplatesProvider
