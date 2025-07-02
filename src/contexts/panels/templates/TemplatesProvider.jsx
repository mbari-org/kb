import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import TemplatesContext from './TemplatesContext'
import TemplatesModalProvider from './TemplatesModalProvider'

import PanelDataContext from '@/contexts/panels/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useLoadConceptError from '@/hooks/useLoadConceptError'

import useModifyTemplates from './useModifyTemplates'
import useUpdateFilters from './useUpdateFilters'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesProvider = ({ children }) => {
  const isLoadingConcept = useRef(false)

  const { explicitConcepts, templates } = use(PanelDataContext)
  const { getSettings, updateSettings } = use(SelectedContext)
  const { getAncestors, isConceptLoaded, loadConcept } = use(TaxonomyContext)

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

  // Set available to false when concept is null
  useEffect(() => {
    const concept = filters[TEMPLATES.FILTERS.CONCEPT]
    if (!concept && available) {
      setAvailable(false)
    }
  }, [filters, available, setAvailable])

  useEffect(() => {
    if (!filters[TEMPLATES.FILTERS.CONCEPT]) {
      const filtered = filterTemplates(templates || [], {
        toConcept: filters[TEMPLATES.FILTERS.TO_CONCEPT],
        linkName: filters[TEMPLATES.FILTERS.LINK_NAME] || '',
        linkValue: filters[TEMPLATES.FILTERS.LINK_VALUE] || '',
      })
      setFilteredTemplates(filtered)
      return
    }

    const updateFilteredTemplates = () => {
      const ancestors = available ? getAncestors(filters[TEMPLATES.FILTERS.CONCEPT]) : []
      const allConcepts = filters[TEMPLATES.FILTERS.CONCEPT]
        ? [filters[TEMPLATES.FILTERS.CONCEPT], ...ancestors]
        : null
      const filtered = filterTemplates(templates || [], {
        concepts: allConcepts,
        toConcept: filters[TEMPLATES.FILTERS.TO_CONCEPT],
        linkName: filters[TEMPLATES.FILTERS.LINK_NAME] || '',
        linkValue: filters[TEMPLATES.FILTERS.LINK_VALUE] || '',
      })
      setFilteredTemplates(filtered)
    }

    if (isConceptLoaded(filters[TEMPLATES.FILTERS.CONCEPT])) {
      updateFilteredTemplates()
    } else if (!isLoadingConcept.current) {
      isLoadingConcept.current = true
      loadConcept(filters[TEMPLATES.FILTERS.CONCEPT])
        .then(updateFilteredTemplates)
        .catch(error => {
          handleLoadConceptError({ ...error, conceptName: filters[TEMPLATES.FILTERS.CONCEPT] })
        })
        .finally(() => {
          isLoadingConcept.current = false
        })
    }
  }, [
    available,
    filters,
    getAncestors,
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
      explicitConcepts,
      filteredTemplates,
      filters,
      deleteTemplate,
      editTemplate,
      setAvailable,
      updateFilters,
    ]
  )

  return (
    <TemplatesContext value={value}>
      <TemplatesModalProvider>
        {children}
      </TemplatesModalProvider>
    </TemplatesContext>
  )
}

export default TemplatesProvider
