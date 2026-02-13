import { use, useState } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import HistoryContext from '@/contexts/panels/history/HistoryContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT } from '@/lib/constants'

const { HISTORY } = SELECTED.SETTINGS
const { NAV_HISTORY } = CONCEPT.SELECT.RIGHT_COMPONENT

const HistoryHeaderLeft = () => {
  const { selectedType } = use(HistoryContext)
  const { getSelected, updateSelected } = use(SelectedContext)

  const selectedConcept = getSelected(SELECTED.CONCEPT)

  const [draft, setDraft] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const inputValue = isEditing ? draft : selectedConcept || ''

  if (selectedType !== HISTORY.TYPES.CONCEPT) return null

  const handleInputBlur = () => {
    setIsEditing(false)
    setDraft('')
  }

  const handleInputChange = (_event, value) => {
    setIsEditing(true)
    setDraft(value)
  }

  const handleConceptSelected = conceptName => {
    if (!conceptName) return true
    setIsEditing(false)
    setDraft('')
    updateSelected({ [SELECTED.CONCEPT]: conceptName })
    return true
  }

  return (
    <ConceptSelect
      conceptName={selectedConcept}
      doConceptSelected={handleConceptSelected}
      ignoreClearSelection={true}
      inputValue={inputValue}
      onInputBlur={handleInputBlur}
      onInputChange={handleInputChange}
      rightComponent={NAV_HISTORY}
      updateConceptSelected={false}
    />
  )
}

export default HistoryHeaderLeft
