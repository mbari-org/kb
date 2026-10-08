import { use } from 'react'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import CONFIG from '@/lib/config'
import { SELECTED } from '@/lib/constants/selected.js'

const { TOOLTIP } = CONFIG.PANELS.TEMPLATES.PANEL

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesHeaderRight = () => {
  const { filters, updateFilters } = use(TemplatesContext)

  return (
    <ToConceptSelect
      conceptName={filters[TEMPLATES.FILTERS.TO_CONCEPT]}
      doConceptSelected={toConcept => updateFilters({ [TEMPLATES.FILTERS.TO_CONCEPT]: toConcept })}
      selectorTooltip={{ placement: 'bottom', title: TOOLTIP.FILTER.TO_CONCEPT }}
    />
  )
}

export default TemplatesHeaderRight
