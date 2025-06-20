import { use, useEffect, useState, useRef } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TemplatesContext from './TemplatesContext'

import useFilterTemplates from './useFilterTemplates'
import useLoadTemplates from './useLoadTemplates'
import useExplicitConcepts from './useExplicitConcepts'
import useTemplatePagination from './useTemplatePagination'
import useModifyTemplates from './useModifyTemplates'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesProvider = ({ children }) => {
  const { getSelected, select } = use(SelectedContext)

  const { count, limit, offset, nextPage, prevPage, setCount, setPageSize, resetPagination } =
    useTemplatePagination()

  // Templates for the current selected Concept
  const [conceptTemplates, setConceptTemplates] = useState([])

  // Templates displayed in the table
  const [displayTemplates, setDisplayTemplates] = useState([])

  // Concepts with explicit Templates defined
  const [explicitConcepts, setExplicitConcepts] = useState([])

  const loadExplicitConcepts = useExplicitConcepts()
  const loadTemplates = useLoadTemplates()

  const available = getSelected(TEMPLATES.KEY)[TEMPLATES.AVAILABLE]
  const setAvailable = bool => {
    select({ [TEMPLATES.KEY]: { [TEMPLATES.AVAILABLE]: bool } })
  }

  // Track previous available value to detect changes
  const prevAvailableRef = useRef(available)

  const {
    filterConcept,
    filterToConcept,
    filterTemplates,
    handleConceptFilter,
    handleToConceptFilter,
    refreshCurrentConcept,
  } = useFilterTemplates({
    available,
    limit,
    loadTemplates,
    resetPagination,
    setCount,
    setConceptTemplates,
    setDisplayTemplates,
  })

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates({
    filterConcept,
    filterToConcept,
    filterTemplates,
    setCount,
    setExplicitConcepts,
    setDisplayTemplates,
  })

  useEffect(() => {
    const loadConcepts = async () => {
      const concepts = await loadExplicitConcepts()
      setExplicitConcepts(concepts)
    }
    loadConcepts()
  }, [loadExplicitConcepts])

  // Watch for changes in available setting and clear filterConcept if needed
  useEffect(() => {
    const prevAvailable = prevAvailableRef.current

    // If available changed and there's a filterConcept
    if (prevAvailable !== available && filterConcept) {
      // Check if the current filterConcept is in the explicitConcepts array
      if (!explicitConcepts.includes(filterConcept)) {
        // Clear the filterConcept since it's not in the explicit concepts list
        handleConceptFilter(null)
      } else {
        // The concept exists in both modes, so we need to re-fetch templates
        // with the new API endpoint (available vs explicit)
        // Force a refresh of the current concept with the new available value
        refreshCurrentConcept()
      }
    }

    // Update the previous value
    prevAvailableRef.current = available
  }, [
    available,
    filterConcept,
    filterToConcept,
    explicitConcepts,
    handleConceptFilter,
    refreshCurrentConcept,
  ])

  useEffect(() => {
    if (filterConcept || filterToConcept) {
      if (conceptTemplates.length > 0) {
        const start = offset
        const end = start + limit
        const paginatedTemplates = conceptTemplates.slice(start, end)
        setDisplayTemplates(paginatedTemplates)
      } else {
        filterTemplates(filterConcept, filterToConcept, { limit, offset })
      }
    } else {
      loadTemplates({ limit, offset }).then(({ count, templates }) => {
        setCount(count)
        setDisplayTemplates(templates)
      })
    }
    // Disable the dependency check because including conceptTemplates results in an infinite
    // re-render loop. Fortunately the checks on filterConcepts and filterToConcepts sufficiently
    // "cover" the missing conceptTemplates dependency.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterConcept, filterToConcept, filterTemplates, limit, loadTemplates, offset, setCount])

  const value = {
    addTemplate,
    available,
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
    setAvailable,
    setPageSize,
    explicitConcepts,
    displayTemplates,
  }

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export default TemplatesProvider
