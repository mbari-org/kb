import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import KBInfoIcon from '@/components/icon/KBInfoIcon'
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

  const infoIcon = (
    <KBInfoIcon
      tooltip={<TemplatesConceptAvailableTooltip />}
      placement='top'
      size={16}
      sx={{ mb: 1 }}
    />
  )

  return (
    <ConceptSelect
      conceptName={filters[TEMPLATES.FILTERS.CONCEPT]}
      doConceptSelected={doConceptSelected}
      leftComponent={infoIcon}
      selectables={selectables}
      updateConceptSelected={true}
    />
  )
}

export default TemplatesHeaderLeft
