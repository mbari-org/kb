import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import SelectedContext from '@/contexts/selected/SelectedContext'

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
    />
  )
}

export default ReferencesHeaderLeft
