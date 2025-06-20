import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants'

const { CONCEPT } = SELECTED.SETTINGS.HISTORY.TYPES
const { NAV_HISTORY } = CONCEPT_SELECT.RIGHT_COMPONENT

const HistoryHeaderLeft = () => {
  const { selectedType } = use(HistoryContext)
  const { getSelected } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  if (selectedType !== CONCEPT) return null

  return <ConceptSelect conceptName={selectedConcept} rightComponent={NAV_HISTORY} />
}

export default HistoryHeaderLeft
