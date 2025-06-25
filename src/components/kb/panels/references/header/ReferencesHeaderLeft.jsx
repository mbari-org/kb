import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants'

const { NAV_HISTORY } = CONCEPT_SELECT.RIGHT_COMPONENT

const { CONCEPT } = SELECTED
const { REFERENCES } = SELECTED.SETTINGS

const ReferencesHeaderLeft = () => {
  const { getSelected, getSettings, updateSelected } = use(SelectedContext)

  const selectedConcept = getSelected(CONCEPT)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)

  const handleConceptSelect = selectedName => {
    if (selectedName) {
      updateSelected({ [CONCEPT]: selectedName })
    }
  }

  return (
    <ConceptSelect
      conceptName={selectedConcept}
      disabled={!byConcept}
      doConceptSelected={handleConceptSelect}
      rightComponent={NAV_HISTORY}
    />
  )
}

export default ReferencesHeaderLeft
