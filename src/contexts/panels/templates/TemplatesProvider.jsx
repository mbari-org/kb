import { use, useEffect, useState, useRef } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import KBDataContext from '@/contexts/KBDataContext'
import TemplatesContext from './TemplatesContext'

import useFilterTemplates from './useFilterTemplates'
import useTemplatePagination from './useTemplatePagination'
import useModifyTemplates from './useModifyTemplates'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesProvider = ({ children }) => {
  const { getSelected, select } = use(SelectedContext)
  const {
    templates: allTemplates,
    templateConcepts,
    isLoading: kbDataLoading,
    refreshData,
  } = use(KBDataContext)

  const { count, limit, offset, nextPage, prevPage, setCount, setPageSize, resetPagination } =
    useTemplatePagination()

  // Templates for the current selected Concept
  const [conceptTemplates, setConceptTemplates] = useState([])

  // Templates displayed in the table
  const [displayTemplates, setDisplayTemplates] = useState([])

  // Flag to track if initial data has been loaded
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  const available = getSelected(TEMPLATES.AVAILABLE)
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
    resetPagination,
    select,
    setCount,
    setConceptTemplates,
    setDisplayTemplates,
  })

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates({
    filterConcept,
    filterToConcept,
    filterTemplates,
    setCount,
    setDisplayTemplates,
    refreshKBData: refreshData,
    allTemplates,
    limit,
    offset,
  })

  // Check for stored filter concept on mount
  useEffect(() => {
    const storedFilterConcept = getSelected(TEMPLATES.CONCEPT)
    if (storedFilterConcept && !filterConcept) {
      handleConceptFilter(storedFilterConcept)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Watch for changes in available setting and clear filterConcept if needed
  useEffect(() => {
    const prevAvailable = prevAvailableRef.current

    // If available changed and there's a filterConcept
    if (prevAvailable !== available && filterConcept) {
      // Check if the current filterConcept is in the templateConcepts array
      if (!templateConcepts.includes(filterConcept)) {
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
    templateConcepts,
    handleConceptFilter,
    refreshCurrentConcept,
  ])

  // Load initial data from KBDataProvider when templates are available
  useEffect(() => {
    if (!kbDataLoading && allTemplates && !initialDataLoaded) {
      setInitialDataLoaded(true)

      if (filterConcept || filterToConcept) {
        // If there are filters, let the filter logic handle it
        if (conceptTemplates.length > 0) {
          const start = offset
          const end = start + limit
          const paginatedTemplates = conceptTemplates.slice(start, end)
          setDisplayTemplates(paginatedTemplates)
        } else {
          filterTemplates(filterConcept, filterToConcept, { limit, offset })
        }
      } else {
        // No filters - use data from KBDataProvider
        setCount(allTemplates.length)
        const start = offset
        const end = start + limit
        const paginatedTemplates = allTemplates.slice(start, end)
        setDisplayTemplates(paginatedTemplates)
      }
    }
  }, [
    kbDataLoading,
    allTemplates,
    initialDataLoaded,
    filterConcept,
    filterToConcept,
    conceptTemplates,
    offset,
    limit,
    filterTemplates,
    setCount,
  ])

  // Handle pagination changes when no filters are active
  useEffect(() => {
    if (initialDataLoaded && !filterConcept && !filterToConcept && allTemplates) {
      const start = offset
      const end = start + limit
      const paginatedTemplates = allTemplates.slice(start, end)
      setDisplayTemplates(paginatedTemplates)
    }
  }, [initialDataLoaded, filterConcept, filterToConcept, allTemplates, offset, limit])

  // Handle filtered data changes
  useEffect(() => {
    if (initialDataLoaded && (filterConcept || filterToConcept)) {
      if (conceptTemplates.length > 0) {
        const start = offset
        const end = start + limit
        const paginatedTemplates = conceptTemplates.slice(start, end)
        setDisplayTemplates(paginatedTemplates)
      } else {
        filterTemplates(filterConcept, filterToConcept, { limit, offset })
      }
    }
    // Disable the dependency check because including conceptTemplates results in an infinite
    // re-render loop. Fortunately the checks on filterConcepts and filterToConcepts sufficiently
    // "cover" the missing conceptTemplates dependency.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterConcept, filterToConcept, filterTemplates, limit, offset, initialDataLoaded])

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
    templateConcepts,
    displayTemplates,
  }

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export default TemplatesProvider
