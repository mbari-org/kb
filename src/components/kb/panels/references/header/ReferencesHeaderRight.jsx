import { use } from 'react'
import ConceptExtent from '@/components/common/concept/ConceptExtent'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES } = SELECTED.SETTINGS

const ReferencesHeaderRight = () => {
  const { conceptExtent, filters, setConceptExtent } = use(ReferencesContext)
  const { getSelected, getSettings } = use(SelectedContext)
  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)
  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const conceptName = byConcept ? filters[REFERENCES.FILTERS.CONCEPT] || selectedConcept : null

  if (!conceptName) {
    return null
  }

  return <ConceptExtent initialValue={conceptExtent} onChange={setConceptExtent} />
}

export default ReferencesHeaderRight
