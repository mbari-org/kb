import { use } from 'react'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'
import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import { SELECTED } from '@/lib/constants/selected.js'

const { REALIZATIONS } = SELECTED.SETTINGS

const RealizationsHeaderRight = () => {
  const { filters, updateFilters } = use(RealizationsContext)

  return (
    <ToConceptSelect
      conceptName={filters[REALIZATIONS.FILTERS.TO_CONCEPT]}
      doConceptSelected={toConcept => updateFilters({ [REALIZATIONS.FILTERS.TO_CONCEPT]: toConcept })}
    />
  )
}

export default RealizationsHeaderRight
