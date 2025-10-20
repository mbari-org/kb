import { use } from 'react'

import ConceptPropertyPages from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyPages'
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

  const renderItem = {
    key: (reference, index) => reference.doi || index,
    content: reference => reference.doi,
  }

  const linkToReferences = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.REFERENCES })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
  }

  const tooltip = 'Go to References for this Concept'

  return (
    <ConceptPropertyPages
      items={conceptReferences}
      renderItem={renderItem}
      title='References DOI'
      iconComponent={() => (
        <InspectIcon onClick={linkToReferences} tooltip={tooltip} asDiv={true} />
      )}
    />
  )
}

export default ConceptReferences
