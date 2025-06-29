import { use } from 'react'

import ToConceptSelect from '@/components/common/concept/ToConceptSelect'

import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesHeaderRight = () => {
  const { filters, updateFilters } = use(TemplatesContext)

  return (
    <ToConceptSelect
      conceptName={filters[TEMPLATES.FILTERS.TO_CONCEPT]}
      doConceptSelected={toConcept => updateFilters({ [TEMPLATES.FILTERS.TO_CONCEPT]: toConcept })}
    />
  )
}

export default TemplatesHeaderRight
