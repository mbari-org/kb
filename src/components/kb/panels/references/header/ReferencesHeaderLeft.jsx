import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT_SELECT } from '@/lib/constants'

const { NAV_HISTORY } = CONCEPT_SELECT.RIGHT_COMPONENT

const ReferencesHeaderLeft = () => {
  const { getSelected, select } = use(SelectedContext)

  const selectedConcept = getSelected('concept')
  const byConcept = getSelected('byConcept')

  const handleConceptSelect = (_event, selectedName) => {
    if (selectedName) {
      select({ concept: selectedName })
    }
  }

  return (
    <ConceptSelect
      conceptName={selectedConcept}
      disabled={!byConcept}
      handleConceptSelect={handleConceptSelect}
      rightComponent={NAV_HISTORY}
    />
  )
}

export default ReferencesHeaderLeft
