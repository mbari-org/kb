import { use, useMemo } from 'react'

import ConceptPropertyPages from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyPages'
import ConceptTemplatesAvailableToggle from '@/components/kb/panels/concepts/concept/detail/templates/ConceptTemplatesAvailableToggle'
import InspectIcon from '@/components/icon/InspectIcon'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { filterTemplates } from '@/components/kb/panels/templates/utils'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const ConceptTemplates = () => {
  const { isLoading, templates } = use(PanelDataContext)
  const { getSelected, getSettings, updateSelected, updateSettings } = use(SelectedContext)
  const { getAncestorNames } = use(TaxonomyContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const byAvailable = getSettings(TEMPLATES.KEY, TEMPLATES.BY_AVAILABLE)

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

  const filteredTemplates = useMemo(() => {
    const ancestorNames = byAvailable ? getAncestorNames(selectedConcept) : []
    const concepts = selectedConcept ? [selectedConcept, ...ancestorNames] : null
    return filterTemplates(templates, { concepts })
  }, [byAvailable, getAncestorNames, selectedConcept, templates])

  const tooltip = `Go to ${byAvailable ? 'Available' : 'Explicit'} Templates for this Concept`

  return (
    <ConceptPropertyPages
      iconComponent={() => <InspectIcon asDiv={true} onClick={linkToTemplates} tooltip={tooltip} />}
      isLoading={isLoading}
      items={filteredTemplates}
      loadingText='Loading templates...'
      renderItem={renderItem}
      title='Templates'
    >
      <ConceptTemplatesAvailableToggle />
    </ConceptPropertyPages>
  )
}

export default ConceptTemplates
