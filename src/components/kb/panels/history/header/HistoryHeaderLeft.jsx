import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants'

const { CONCEPT } = SELECTED.HISTORY.TYPE

const HistoryHeaderLeft = () => {
  const { selectedType } = use(HistoryContext)
  const { getSelected } = use(SelectedContext)

  const selectedConcept = getSelected('concept')

  if (selectedType !== CONCEPT) return null

  return <ConceptSelect conceptName={selectedConcept} />
}

export default HistoryHeaderLeft
