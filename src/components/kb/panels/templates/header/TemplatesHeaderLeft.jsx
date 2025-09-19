import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'

import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants'

const { TEMPLATES } = SELECTED.SETTINGS

const TemplatesHeaderLeft = () => {
  const { updateSelected } = use(SelectedContext)
  const { getNames } = use(TaxonomyContext)
  const { available, explicitConcepts, filters, updateFilters } = use(TemplatesContext)

  const selectables = available ? getNames() : explicitConcepts

  const doConceptSelected = conceptName => {
    if (conceptName) {
      updateSelected({ [SELECTED.CONCEPT]: conceptName })
      updateFilters({ [TEMPLATES.FILTERS.CONCEPT]: conceptName })
    } else {
      updateFilters({ [TEMPLATES.FILTERS.CONCEPT]: '' })
    }
  }

  return (
    <ConceptSelect
      conceptName={filters[TEMPLATES.FILTERS.CONCEPT]}
      doConceptSelected={doConceptSelected}
      selectables={selectables}
      tooltip={<TemplatesConceptAvailableTooltip />}
      updateConceptSelected={true}
    />
  )
}

export default TemplatesHeaderLeft
