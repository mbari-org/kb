import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import TemplatesContext from './TemplatesContext'

import KBDataContext from '@/contexts/kbData/KBDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useLoadConceptError from '@/hooks/useLoadConceptError'

import useModifyTemplates from './useModifyTemplates'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesProvider = ({ children }) => {
  const isLoadingConcept = useRef(false)

  const { explicitConcepts, templates } = use(KBDataContext)
  const { getSettings, updateSettings } = use(SelectedContext)
  const { getAncestors, isConceptLoaded, loadConcept } = use(TaxonomyContext)

  const handleLoadConceptError = useLoadConceptError()

  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [linkFilter, setLinkFilter] = useState({ linkName: '', linkValue: '' })

  const templatesSettings = getSettings(TEMPLATES.KEY)
  const { available, concept, toConcept } = templatesSettings

  const setAvailable = useCallback(
    bool => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.AVAILABLE]: bool } }),
    [updateSettings]
  )
  const setConcept = useCallback(
    conceptName => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.CONCEPT]: conceptName } }),
    [updateSettings]
  )
  const setToConcept = useCallback(
    toConceptName => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.TO_CONCEPT]: toConceptName } }),
    [updateSettings]
  )

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates()

  const updateLinkFilter = useCallback(
    (key, filterValue) => setLinkFilter(prevFilter => ({ ...prevFilter, [key]: filterValue })),
    []
  )

  useEffect(() => {
    if (!concept) {
      const filtered = filterTemplates(templates || [], {
        linkName: linkFilter.linkName,
        linkValue: linkFilter.linkValue,
      })
      setFilteredTemplates(filtered)
      return
    }

    const updateFilteredTemplates = () => {
      const ancestors = available ? getAncestors(concept) : []
      const concepts = concept ? [concept, ...ancestors] : null
      const filtered = filterTemplates(templates || [], {
        concepts,
        toConcept,
        linkName: linkFilter.linkName,
        linkValue: linkFilter.linkValue,
      })
      setFilteredTemplates(filtered)
    }

    if (isConceptLoaded(concept)) {
      updateFilteredTemplates()
    } else if (!isLoadingConcept.current) {
      isLoadingConcept.current = true
      loadConcept(concept)
        .then(updateFilteredTemplates)
        .catch(error => {
          handleLoadConceptError({ ...error, conceptName: concept })
        })
        .finally(() => {
          isLoadingConcept.current = false
        })
    }
  }, [
    available,
    concept,
    getAncestors,
    handleLoadConceptError,
    isConceptLoaded,
    loadConcept,
    templates,
    toConcept,
    linkFilter,
  ])

  const value = useMemo(
    () => ({
      addTemplate,
      available,
      concept,
      explicitConcepts,
      filteredTemplates,
      linkFilter,
      toConcept,
      deleteTemplate,
      editTemplate,
      setAvailable,
      setConcept,
      setToConcept,
      updateLinkFilter,
    }),
    [
      addTemplate,
      available,
      concept,
      explicitConcepts,
      filteredTemplates,
      linkFilter,
      toConcept,
      deleteTemplate,
      editTemplate,
      setAvailable,
      setConcept,
      setToConcept,
      updateLinkFilter,
    ]
  )

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export default TemplatesProvider
