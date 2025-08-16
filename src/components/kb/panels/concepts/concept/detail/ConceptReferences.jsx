import { use, useMemo } from 'react'

import ConceptPropertyPages from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyPages'
import InspectIcon from '@/components/common/icon/InspectIcon'

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

  const tooltip = 'View References for this Concept'

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
