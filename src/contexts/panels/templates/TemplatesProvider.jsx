import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import TemplatesContext from './TemplatesContext'
import { TemplatesModalProvider } from './modal'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useLoadConceptError from '@/hooks/useLoadConceptError'

import useModifyTemplates from './useModifyTemplates'
import useUpdateFilters from './useUpdateFilters'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const FILTERS = TEMPLATES.FILTERS

const TemplatesProvider = ({ children }) => {
  const isLoadingConcept = useRef(false)

  const { explicitConcepts, templates } = use(PanelDataContext)
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)
  const { getAncestorNames, isConceptLoaded, loadConcept } = use(TaxonomyContext)

  const handleLoadConceptError = useLoadConceptError()

  const [filteredTemplates, setFilteredTemplates] = useState([])

  const templatesSettings = getSettings(TEMPLATES.KEY)
  const { available, filters = {} } = templatesSettings

  const setAvailable = useCallback(
    bool => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.AVAILABLE]: bool } }),
    [updateSettings]
  )

  const { updateFilters } = useUpdateFilters(filters, updateSettings)

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates()

  useEffect(() => {
    if (getSelected(SELECTED.PANEL) === SELECTED.PANELS.TEMPLATES) {
      const selectedConcept = getSelected(SELECTED.CONCEPT)

      if (selectedConcept && selectedConcept !== filters[FILTERS.CONCEPT]) {
        updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
      }
    }
  }, [filters, getSelected, updateFilters])

  useEffect(() => {
    if (!filters[FILTERS.CONCEPT]) {
      const filtered = filterTemplates(templates, {
        linkName: filters[FILTERS.LINK_NAME],
        toConcept: filters[FILTERS.TO_CONCEPT],
        linkValue: filters[FILTERS.LINK_VALUE],
      })
      setFilteredTemplates(filtered)
      return
    }

    const updateFilteredTemplates = () => {
      const ancestorNames = available ? getAncestorNames(filters[FILTERS.CONCEPT]) : []
      const allConcepts = filters[FILTERS.CONCEPT]
        ? [filters[TEMPLATES.FILTERS.CONCEPT], ...ancestorNames]
        : null
      const filtered = filterTemplates(templates, {
        concepts: allConcepts,
        linkName: filters[FILTERS.LINK_NAME],
        toConcept: filters[FILTERS.TO_CONCEPT],
        linkValue: filters[FILTERS.LINK_VALUE],
      })
      setFilteredTemplates(filtered)
    }

    if (isConceptLoaded(filters[FILTERS.CONCEPT])) {
      updateFilteredTemplates()
    } else if (!isLoadingConcept.current) {
      isLoadingConcept.current = true
      loadConcept(filters[FILTERS.CONCEPT])
        .then(updateFilteredTemplates)
        .catch(error => {
          handleLoadConceptError({ ...error, conceptName: filters[FILTERS.CONCEPT] })
        })
        .finally(() => {
          isLoadingConcept.current = false
        })
    }
  }, [
    available,
    filters,
    getAncestorNames,
    handleLoadConceptError,
    isConceptLoaded,
    loadConcept,
    templates,
  ])

  const value = useMemo(
    () => ({
      addTemplate,
      available,
      explicitConcepts,
      filteredTemplates,
      filters,
      deleteTemplate,
      editTemplate,
      setAvailable,
      updateFilters,
    }),
    [
      addTemplate,
      available,
      deleteTemplate,
      editTemplate,
      explicitConcepts,
      filteredTemplates,
      filters,
      setAvailable,
      updateFilters,
    ]
  )

  return (
    <TemplatesContext value={value}>
      <TemplatesModalProvider>{children}</TemplatesModalProvider>
    </TemplatesContext>
  )
}

export default TemplatesProvider
