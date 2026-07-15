import { use, useCallback, useEffect, useMemo, useRef } from 'react'

import TemplatesContext from './TemplatesContext'
import { TemplatesModalProvider } from './modal'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useLoadConceptError from '@/lib/hooks/useLoadConceptError'

import useModifyTemplates from './useModifyTemplates'
import useUpdateFilters from './useUpdateFilters'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants/selected.js'

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

  const selectedPanel = getSelected(SELECTED.PANEL)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const isTemplatesPanelSelected = selectedPanel === SELECTED.PANELS.TEMPLATES
  const isInitialConceptFilterPending =
    isTemplatesPanelSelected && typeof filters[FILTERS.CONCEPT] === 'undefined' && Boolean(selectedConcept)

  const setByAvailable = useCallback(
    bool => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.BY_AVAILABLE]: bool } }),
    [updateSettings]
  )

  const { updateFilters } = useUpdateFilters(filters, updateSettings)

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates()

  useEffect(() => {
    if (isInitialConceptFilterPending) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [isInitialConceptFilterPending, selectedConcept, updateFilters])

  const filteredTemplates = useMemo(() => {
    if (!templates || templates.length === 0) return []
    if (isInitialConceptFilterPending) return []

    const linkName = filters[FILTERS.LINK_NAME]
    const toConcept = filters[FILTERS.TO_CONCEPT]
    const linkValue = filters[FILTERS.LINK_VALUE]
    const concept = filters[FILTERS.CONCEPT]

    if (!concept) {
      return filterTemplates(templates, { linkName, toConcept, linkValue })
    }

    if (!isConceptLoaded(concept)) {
      return []
    }

    const concepts = [concept, ...(byAvailable ? getAncestorNames(concept) : [])]

    return filterTemplates(templates, { concepts, linkName, toConcept, linkValue })
  }, [byAvailable, filters, getAncestorNames, isConceptLoaded, isInitialConceptFilterPending, templates])

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

  const filterString = useCallback(template => {
    if (!template) return '* | * | * | *'

    const concept = template.concept || '*'
    const linkName = template.linkName || '*'
    const toConcept = template.toConcept || '*'
    const linkValue = template.linkValue || '*'

    return `${concept} | ${linkName} | ${toConcept} | ${linkValue}`
  }, [])

  const value = useMemo(
    () => ({
      addTemplate,
      byAvailable,
      deleteTemplate,
      editTemplate,
      explicitConcepts,
      filteredTemplates,
      filters,
      filterString,
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
      filterString,
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
