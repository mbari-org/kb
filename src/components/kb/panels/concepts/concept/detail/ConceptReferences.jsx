import { use, useMemo } from 'react'

import CollapsibleConceptPropertiesSection from '@/components/kb/panels/concepts/concept/detail/common/CollapsibleConceptPropertiesSection'
import InspectIcon from '@/components/common/InspectIcon'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const { REFERENCES } = SELECTED.SETTINGS

const ConceptReferences = () => {
  const { references } = use(PanelDataContext)
  const { getSelected, updateSelected, updateSettings } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  const conceptReferences = useMemo(() => {
    return references.filter(reference => reference.concepts.includes(selectedConcept))
  }, [references, selectedConcept])

  const renderItem = {
    key: (reference, index) => reference.doi || index,
    content: reference => reference.doi,
  }

  const linkToReferences = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.REFERENCES })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
  }

  return (
    <CollapsibleConceptPropertiesSection
      items={conceptReferences}
      onInspect={linkToReferences}
      onInspectTooltip='View References for this Concept'
      renderItem={renderItem}
      title='References DOI'
      IconComponent={InspectIcon}
    />
  )
}

export default ConceptReferences
