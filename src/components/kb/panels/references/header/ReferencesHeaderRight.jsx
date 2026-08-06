import { use } from 'react'
import ConceptExtent from '@/components/common/concept/ConceptExtent'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import { SELECTED } from '@/lib/constants/selected.js'

const { REFERENCES } = SELECTED.SETTINGS

const ReferencesHeaderRight = () => {
  const { conceptExtent, filters, setConceptExtent } = use(ReferencesContext)
  const conceptName = filters[REFERENCES.FILTERS.CONCEPT]

  if (!conceptName) {
    return null
  }

  return <ConceptExtent initialValue={conceptExtent} onChange={setConceptExtent} />
}

export default ReferencesHeaderRight
