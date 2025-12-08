import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'
import { CONCEPT as CONCEPT_CONSTANTS } from '@/lib/constants'

const { NAV_HISTORY } = CONCEPT_CONSTANTS.SELECT.RIGHT_COMPONENT

const { CONCEPT, SETTINGS } = SELECTED
const { REFERENCES } = SETTINGS

const ReferencesHeaderLeft = () => {
  const { getSelected, getSettings, updateSelected, updateSettings } = use(SelectedContext)

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = byConcept ? getSelected(CONCEPT) : ''

  const handleConceptSelected = selectedName => {
    if (selectedName) {
      updateSelected({ [CONCEPT]: selectedName })
      updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
    } else {
      updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false } })
    }
  }

  const handleClear = () => {
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false } })
  }

  return (
    <ConceptSelect
      conceptName={selectedConcept}
      doConceptSelected={handleConceptSelected}
      onClear={handleClear}
      rightComponent={NAV_HISTORY}
    />
  )
}

export default ReferencesHeaderLeft
