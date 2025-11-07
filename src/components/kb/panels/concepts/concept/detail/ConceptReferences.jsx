import { use } from 'react'

import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import InspectIcon from '@/components/icon/InspectIcon'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const { REFERENCES } = SELECTED.SETTINGS

const ConceptReferences = () => {
  const { getReferences } = use(PanelDataContext)
  const { getSelected, updateSelected, updateSettings } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const conceptReferences = getReferences(selectedConcept)

  const ReferenceComponent = ({ item }) => item.doi

  const linkToReferences = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.REFERENCES })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
  }

  const tooltip = 'View References for this Concept'

  return (
    <ConceptPropertyList
      items={conceptReferences}
      renderComponent={ReferenceComponent}
      title='References DOI'
      actionComponent={() => (
        <InspectIcon onClick={linkToReferences} tooltip={tooltip} asDiv={true} />
      )}
    />
  )
}

export default ConceptReferences
