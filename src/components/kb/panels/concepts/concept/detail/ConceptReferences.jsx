import { use, useMemo } from 'react'

import ConceptPropertyList from '@/components/kb/panels/concepts/concept/detail/properties/ConceptPropertyList'
import ConceptReference from '@/components/kb/panels/concepts/concept/detail/references/ConceptReference'
import InspectIcon from '@/components/icon/InspectIcon'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import CONFIG from '@/text'

const { REFERENCES } = SELECTED.SETTINGS

const ConceptReferences = () => {
  const { getReferences } = use(PanelDataContext)
  const { getSelected, updateSelected, updateSettings } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const references = getReferences(selectedConcept)

  const conceptReferences = useMemo(
    () =>
      references.map(ref => ({
        ...ref,
        action: CONCEPT_STATE.NO_ACTION,
      })),
    [references]
  )

  const ReferenceComponent = ({ item }) => <ConceptReference reference={item} />

  const linkToReferences = () => {
    updateSelected({ [SELECTED.PANEL]: SELECTED.PANELS.REFERENCES })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
  }

  return (
    <ConceptPropertyList
      items={conceptReferences}
      renderComponent={ReferenceComponent}
      title={CONFIG.PANELS.CONCEPTS.REFERENCES.LABEL}
      actionComponent={() => (
        <InspectIcon
          asDiv={true}
          onClick={linkToReferences}
          tooltip={CONFIG.PANELS.CONCEPTS.REFERENCES.VIEW.TOOLTIP}
        />
      )}
    />
  )
}

export default ConceptReferences
