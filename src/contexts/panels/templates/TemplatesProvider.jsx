import { use, useCallback, useEffect, useMemo, useRef } from 'react'

import TemplatesContext from './TemplatesContext'
import { TemplatesModalProvider } from './modal'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useLoadConceptError from '@/lib/hooks/useLoadConceptError'

import useModifyTemplates from './useModifyTemplates'
import dataFilters from '@/contexts/panels/dataFilters'
import useUpdateFilters from '@/contexts/panels/useUpdateFilters'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { SELECTED } from '@/lib/constants/selected.js'
import { matchingTemplateString } from '@/lib/model/templates'

const { TEMPLATES } = SELECTED.SETTINGS
const FILTERS = TEMPLATES.FILTERS
const { DEFAULT_FILTERS } = dataFilters(TEMPLATES.KEY)

const TemplatesProvider = ({ children }) => {
  const isLoadingConcept = useRef(false)

  const { clearTemplateFilters, explicitConcepts, pendingHistory, setClearTemplateFilters, templates } =
    use(PanelDataContext)
  const { getSelected } = use(SelectedContext)
  const { getSettings, updateSettings } = use(SelectedSettingsContext)
  const { getAncestorNames, getNames, isConceptLoaded, loadConcept } = use(TaxonomyContext)

  const handleLoadConceptError = useLoadConceptError()

  const templatesSettings = getSettings(TEMPLATES.KEY) || {}
  const byAvailable = templatesSettings[TEMPLATES.BY_AVAILABLE]
  const filters = templatesSettings[FILTERS.KEY] || DEFAULT_FILTERS

  const selectedPanel = getSelected(SELECTED.PANEL)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const isTemplatesPanelSelected = selectedPanel === SELECTED.PANELS.TEMPLATES
  const isInitialConceptFilterPending =
    isTemplatesPanelSelected && typeof filters[FILTERS.CONCEPT] === 'undefined' && Boolean(selectedConcept)

  const setByAvailable = useCallback(
    bool => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.BY_AVAILABLE]: bool } }),
    [updateSettings]
  )

  const { updateFilters } = useUpdateFilters(TEMPLATES.KEY, updateSettings)

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates()

  const getPendingTemplateAction = useCallback(
    template => {
      const pendingItem = pendingHistory.find(
        item =>
          item.field === HISTORY_FIELD.TEMPLATE &&
          item.concept === template.concept &&
          matchingTemplateString(template, item.action === ACTION.DELETE ? item.oldValue : item.newValue)
      )
      return pendingItem?.action ?? null
    },
    [pendingHistory]
  )

  useEffect(() => {
    if (isInitialConceptFilterPending) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [isInitialConceptFilterPending, selectedConcept, updateFilters])

  const filteredTemplates = useMemo(() => {
    if (!templates || templates.length === 0) return []
    if (isInitialConceptFilterPending) return []

    const concept = filters[FILTERS.CONCEPT]
    const linkName = filters[FILTERS.LINK_NAME]
    const toConcept = filters[FILTERS.TO_CONCEPT]
    const linkValue = filters[FILTERS.LINK_VALUE]

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
    let concept = filters[FILTERS.CONCEPT]
    if (!concept) return

    if (!getNames().includes(concept)) {
      updateFilters({ [FILTERS.CONCEPT]: '' })
      return
    }

    if (isConceptLoaded(concept) || isLoadingConcept.current) return

    isLoadingConcept.current = true
    loadConcept(concept)
      .catch(error => {
        handleLoadConceptError({ ...error, conceptName: concept })
      })
      .finally(() => {
        isLoadingConcept.current = false
      })
  }, [filters, getNames, handleLoadConceptError, isConceptLoaded, loadConcept, updateFilters])

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
      getPendingTemplateAction,
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
      getPendingTemplateAction,
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
