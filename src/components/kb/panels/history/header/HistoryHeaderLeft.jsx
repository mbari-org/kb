import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { CONCEPT_SELECT, SELECTED } from '@/lib/constants/constants'

const { HISTORY } = SELECTED.SETTINGS
const { NAV_HISTORY } = CONCEPT_SELECT.RIGHT_COMPONENT

const HistoryHeaderLeft = () => {
  const { pageState, selectedType } = use(HistoryContext)
  const { getSelected, updateSettings } = use(SelectedContext)

  const handleClear = () => {
    updateSettings({ [HISTORY.KEY]: { [HISTORY.TYPE]: pageState.lastHistoryType } })
  }

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  if (selectedType !== HISTORY.TYPES.CONCEPT) return null

  return <ConceptSelect conceptName={selectedConcept} onClear={handleClear} rightComponent={NAV_HISTORY} />
}

export default HistoryHeaderLeft
