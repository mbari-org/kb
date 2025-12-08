import { use } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import KBInfoIcon from '@/components/icon/KBInfoIcon'
import TemplatesConceptAvailableTooltip from '@/components/kb/panels/templates/TemplatesConceptAvailableTooltip'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import { SELECTED } from '@/lib/constants/selected.js'

const { TEMPLATES } = SELECTED.SETTINGS
const { FILTERS } = TEMPLATES

const TemplatesHeaderLeft = () => {
  const { updateSelected, updateSettings } = use(SelectedContext)
  const { getNames } = use(TaxonomyContext)
  const { byAvailable, explicitConcepts, filters, updateFilters } = use(TemplatesContext)

  const selectables = byAvailable ? getNames() : explicitConcepts

  const handleConceptSelected = conceptName => {
    if (conceptName) {
      updateSelected({ [SELECTED.CONCEPT]: conceptName })
      updateFilters({ [FILTERS.CONCEPT]: conceptName })
    } else {
      updateFilters({ [FILTERS.CONCEPT]: '' })
      updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.BY_AVAILABLE]: false } })
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
      conceptName={filters[FILTERS.CONCEPT]}
      doConceptSelected={handleConceptSelected}
      leftComponent={infoIcon}
      selectables={selectables}
      updateConceptSelected={true}
    />
  )
}

export default TemplatesHeaderLeft
