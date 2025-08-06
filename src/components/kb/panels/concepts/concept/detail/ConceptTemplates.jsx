import { use, useEffect, useState } from 'react'

import ConceptPropertyPages from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyPages'
import TemplatesAvailableToggle from '@/components/kb/panels/concepts/concept/detail/templates/TemplatesAvailableToggle'
import ConceptPropertiesInspectButton from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertiesInspectButton'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplates = () => {
  const { isLoading, templates } = use(PanelDataContext)
  const { getSelected, getSettings, updateSelected, updateSettings } = use(SelectedContext)
  const { getAncestors } = use(TaxonomyContext)

  const [filteredTemplates, setFilteredTemplates] = useState([])

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const available = getSettings(TEMPLATES.KEY, TEMPLATES.AVAILABLE)

  const renderItem = {
    key: (template, index) => `${template.concept}-${template.linkName}-${index}`,
    content: template => `${template.linkName} | ${template.toConcept} | ${template.linkValue}`,
  }

  const linkToTemplates = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.TEMPLATES })
    updateSettings({
      [TEMPLATES.KEY]: {
        [TEMPLATES.FILTERS.KEY]: { [TEMPLATES.FILTERS.CONCEPT]: selectedConcept },
      },
    })
  }

  useEffect(() => {
    const ancestors = available ? getAncestors(selectedConcept) : []
    const concepts = selectedConcept ? [selectedConcept, ...ancestors] : null

    setFilteredTemplates(filterTemplates(templates, { concepts }))
  }, [available, getAncestors, selectedConcept, templates])

  const tooltip = `View ${available ? 'Available' : 'Explicit'} Templates for this Concept`

  return (
    <ConceptPropertyPages
      isLoading={isLoading}
      items={filteredTemplates}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Templates'
      iconComponent={() => (
        <ConceptPropertiesInspectButton onClick={linkToTemplates} tooltip={tooltip} />
      )}
    >
      <TemplatesAvailableToggle />
    </ConceptPropertyPages>
  )
}

export default ConceptTemplates
