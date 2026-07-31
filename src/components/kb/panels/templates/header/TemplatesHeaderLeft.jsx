import { use, useEffect } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'
import TemplatesConceptSelectAuxiliary from '@/components/kb/panels/templates/header/TemplatesConceptSelectAuxiliary'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'
import TemplatesContext from '@/contexts/panels/templates/TemplatesContext'

import CONFIG from '@/lib/config'
import { SELECTED } from '@/lib/constants/selected.js'

const { TOOLTIP } = CONFIG.PANELS.TEMPLATES.PANEL

const { SETTINGS } = SELECTED
const { TEMPLATES } = SETTINGS
const { FILTERS } = TEMPLATES

const TemplatesHeaderLeft = () => {
  const { getSelected, updateSelected, updateSettings } = use(SelectedContext)
  const { getNames } = use(TaxonomyContext)
  const { byAvailable, explicitConcepts, filters, updateFilters } = use(TemplatesContext)

  const selectables = byAvailable ? getNames() : explicitConcepts

  const selectedConcept = getSelected(SELECTED.CONCEPT)
  const selectedPanel = getSelected(SELECTED.PANEL)

  const filtersConcept = filters[FILTERS.CONCEPT]

  useEffect(() => {
    const isTemplatesPanel = selectedPanel === SELECTED.PANELS.TEMPLATES
    if (filtersConcept === '' && isTemplatesPanel) return

    if (selectedConcept && selectedConcept !== filtersConcept) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [filtersConcept, selectedConcept, selectedPanel, updateFilters])

  const handleConceptSelected = conceptName => {
    if (conceptName) {
      updateSelected({ [SELECTED.CONCEPT]: conceptName })
      updateFilters({ [FILTERS.CONCEPT]: conceptName })
    } else {
      updateSelected({ [SELECTED.CONCEPT]: null })
      updateFilters({ [FILTERS.CONCEPT]: '' })
      updateSettings({ [TEMPLATES.KEY]: { [TEMPLATES.BY_AVAILABLE]: false } })
    }
  }

  return (
    <KBTooltipTarget placement='bottom' title={TOOLTIP.FILTER.CONCEPT}>
      <ConceptSelect
        auxiliaryComponent={<TemplatesConceptSelectAuxiliary />}
        conceptName={filters[FILTERS.CONCEPT]}
        doConceptSelected={handleConceptSelected}
        selectables={selectables}
        updateConceptSelected={true}
      />
    </KBTooltipTarget>
  )
}

export default TemplatesHeaderLeft
