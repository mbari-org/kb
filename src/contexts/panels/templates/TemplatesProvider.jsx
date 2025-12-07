import { use, useCallback, useEffect, useMemo, useRef } from 'react'

import TemplatesContext from './TemplatesContext'
import { TemplatesModalProvider } from './modal'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useLoadConceptError from '@/hooks/useLoadConceptError'

import useModifyTemplates from './useModifyTemplates'
import useUpdateFilters from './useUpdateFilters'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/kb/constants/selected.js'

const { TEMPLATES } = SELECTED.SETTINGS
const FILTERS = TEMPLATES.FILTERS

const TemplatesProvider = ({ children }) => {
  const isLoadingConcept = useRef(false)

  const { clearTemplateFilters, explicitConcepts, setClearTemplateFilters, templates } = use(PanelDataContext)
  const { getSelected, getSettings, updateSettings } = use(SelectedContext)
  const { getAncestorNames, isConceptLoaded, loadConcept } = use(TaxonomyContext)

  const handleLoadConceptError = useLoadConceptError()

  const templatesSettings = getSettings(TEMPLATES.KEY)
  const { byAvailable, filters = {} } = templatesSettings

  const setByAvailable = useCallback(
    bool => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.BY_AVAILABLE]: bool } }),
    [updateSettings]
  )

  const { updateFilters } = useUpdateFilters(filters, updateSettings)

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates()

  useEffect(() => {
    if (getSelected(SELECTED.PANEL) === SELECTED.PANELS.TEMPLATES) {
      const selectedConcept = getSelected(SELECTED.CONCEPT)

      if (
        typeof filters[FILTERS.CONCEPT] === 'undefined' &&
        selectedConcept
      ) {
        updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
      }
    }
  }, [filters, getSelected, updateFilters])

  const filteredTemplates = useMemo(() => {
    if (!templates || templates.length === 0) return []

    const linkName = filters[FILTERS.LINK_NAME]
    const toConcept = filters[FILTERS.TO_CONCEPT]
    const linkValue = filters[FILTERS.LINK_VALUE]
    const concept = filters[FILTERS.CONCEPT]

    if (!concept) {
      return filterTemplates(templates, { linkName, toConcept, linkValue })
    }

    const concepts = isConceptLoaded(concept)
      ? [concept, ...(byAvailable ? getAncestorNames(concept) : [])]
      : null

    return filterTemplates(templates, { concepts, linkName, toConcept, linkValue })
  }, [byAvailable, filters, getAncestorNames, isConceptLoaded, templates])

  useEffect(() => {
    const concept = filters[FILTERS.CONCEPT]
    if (!concept) return
    if (isConceptLoaded(concept) || isLoadingConcept.current) return

    isLoadingConcept.current = true
    loadConcept(concept)
      .catch(error => {
        handleLoadConceptError({ ...error, conceptName: concept })
      })
      .finally(() => {
        isLoadingConcept.current = false
      })
  }, [filters, handleLoadConceptError, isConceptLoaded, loadConcept])

  useEffect(() => {
    if (clearTemplateFilters) {
      updateFilters(null)
      setClearTemplateFilters(false)
    }
  }, [clearTemplateFilters, setClearTemplateFilters, updateFilters])

  const value = useMemo(
    () => ({
      addTemplate,
      byAvailable,
      deleteTemplate,
      editTemplate,
      explicitConcepts,
      filteredTemplates,
      filters,
      setByAvailable,
      updateFilters,
    }),
    [
      addTemplate,
      byAvailable,
      deleteTemplate,
      editTemplate,
      explicitConcepts,
      filteredTemplates,
      filters,
      setByAvailable,
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
