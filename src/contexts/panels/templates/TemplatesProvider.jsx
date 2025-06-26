import { use, useEffect, useState } from 'react'

import TemplatesContext from './TemplatesContext'

import KBDataContext from '@/contexts/kbData/KBDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useModifyTemplates from './useModifyTemplates'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesProvider = ({ children }) => {
  const { explicitConcepts, templates } = use(KBDataContext)
  const { getSettings, updateSettings } = use(SelectedContext)
  const { getAncestors, loadConcept } = use(TaxonomyContext)

  const [filteredTemplates, setFilteredTemplates] = useState([])

  const templatesSettings = getSettings(TEMPLATES.KEY)
  const { available, concept, toConcept } = templatesSettings

  const setAvailable = bool => updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.AVAILABLE]: bool } })
  const setConcept = conceptName =>
    updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.CONCEPT]: conceptName } })
  const setToConcept = toConceptName =>
    updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.TO_CONCEPT]: toConceptName } })

  const { addTemplate, editTemplate, deleteTemplate } = useModifyTemplates()

  useEffect(() => {
    console.log('concept', concept)
  }, [concept])

  useEffect(() => {
    const ancestors = available ? getAncestors(concept) : []
    const concepts = concept ? [concept, ...ancestors] : null
    const filtered = filterTemplates(templates || [], concepts, toConcept)
    setFilteredTemplates(filtered)
  }, [available, concept, getAncestors, templates, toConcept])

  const value = {
    addTemplate,
    available,
    concept,
    explicitConcepts,
    filteredTemplates,
    toConcept,
    deleteTemplate,
    editTemplate,
    setAvailable,
    setConcept,
    setToConcept,
  }

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

export default TemplatesProvider
