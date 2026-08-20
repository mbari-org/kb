import { use } from 'react'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'

import RealizationsContext from '@/contexts/panels/realizations/RealizationsContext'
import { SELECTED } from '@/lib/constants/selected.js'
import CONFIG from '@/lib/config'

const { REALIZATIONS } = SELECTED.SETTINGS
const { TOOLTIP } = CONFIG.PANELS.REALIZATIONS.PANEL

const RealizationsHeaderRight = () => {
  const { explicitToConcepts, filters, updateFilters } = use(RealizationsContext)
  const selectables = explicitToConcepts.length > 0 ? explicitToConcepts : undefined

  return (
    <KBTooltipTarget placement='left' title={TOOLTIP.FILTER.TO_CONCEPT}>
      <ToConceptSelect
        conceptName={filters[REALIZATIONS.FILTERS.TO_CONCEPT]}
        doConceptSelected={toConcept => updateFilters({ [REALIZATIONS.FILTERS.TO_CONCEPT]: toConcept })}
        selectables={selectables}
      />
    </KBTooltipTarget>
  )
}

export default RealizationsHeaderRight
