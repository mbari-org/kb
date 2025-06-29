import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesHeaderLeft = () => {
  const { getNames } = use(TaxonomyContext)
  const { available, explicitConcepts, filters, updateFilters } = use(TemplatesContext)

  const selectables = available ? getNames() : explicitConcepts

  return (
    <ConceptSelect
      conceptName={filters[TEMPLATES.FILTERS.CONCEPT]}
      doConceptSelected={conceptName => updateFilters({ [TEMPLATES.FILTERS.CONCEPT]: conceptName })}
      selectables={selectables}
      tooltip={<TemplatesConceptAvailableTooltip />}
      updateConceptSelected={true}
    />
  )
}

export default TemplatesHeaderLeft
