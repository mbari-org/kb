import { useEffect, useState } from 'react'

import TemplatesContext from './TemplatesContext'

import useFilterTemplates from './useFilterTemplates'
import useLoadTemplateData from './useLoadTemplateData'
import useTemplateConcepts from './useTemplateConcepts'
import useTemplatePagination from './useTemplatePagination'
import useModifyTemplates from './useModifyTemplates'

const TemplatesProvider = ({ children }) => {
  const { count, limit, offset, nextPage, prevPage, setCount, setPageSize, resetPagination } =
    useTemplatePagination()

  const [templates, setTemplates] = useState([])
  const [conceptTemplates, setConceptTemplates] = useState([])
  const [selectableConcepts, setSelectableConcepts] = useState([])

  const loadConceptsList = useTemplateConcepts()
  const loadTemplateData = useLoadTemplateData()

  const {
    filterConcept,
    filterToConcept,
    filterTemplates,
    handleConceptFilter,
    handleToConceptFilter,
  } = useFilterTemplates({
    limit,
    loadTemplateData,
    resetPagination,
    setCount,
    setConceptTemplates,
    setTemplates,
  })

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates({
    filterConcept,
    filterToConcept,
    filterTemplates,
    setCount,
    setSelectableConcepts,
    setTemplates,
  })

  useEffect(() => {
    const loadConcepts = async () => {
      const concepts = await loadConceptsList()
      setSelectableConcepts(concepts)
    }
    loadConcepts()
  }, [loadConceptsList])

  useEffect(() => {
    if (filterConcept || filterToConcept) {
      if (conceptTemplates.length > 0) {
        const start = offset
        const end = start + limit
        const paginatedTemplates = conceptTemplates.slice(start, end)
        setTemplates(paginatedTemplates)
      } else {
        filterTemplates(filterConcept, filterToConcept, { limit, offset })
      }
    } else {
      loadTemplateData({ limit, offset }).then(({ count, templates }) => {
        setCount(count)
        setTemplates(templates)
      })
    }
  }, [
    filterConcept,
    filterToConcept,
    filterTemplates,
    limit,
    loadTemplateData,
    offset,
    conceptTemplates,
    setCount,
  ])

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
