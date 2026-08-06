import { use, useEffect } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ConceptNavAuxiliary from '@/components/common/concept/ConceptNavAuxiliary'
import KBTooltipTarget from '@/components/common/tooltip/KBTooltipTarget'
import ReferencesContext from '@/contexts/panels/references/ReferencesContext'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'

import CONFIG from '@/lib/config'

const TOOLTIP = CONFIG.PANELS.REFERENCES.PANEL.TOOLTIP

const { CONCEPT, PANEL, PANELS, SETTINGS } = SELECTED
const { REFERENCES } = SETTINGS
const { FILTERS } = REFERENCES

const ReferencesHeaderLeft = () => {
  const { concepts, getSelected, updateSelected } = use(SelectedContext)
  const { filters, updateFilters } = use(ReferencesContext)

  const selectedConcept = getSelected(CONCEPT)
  const selectedPanel = getSelected(PANEL)

  const filtersConcept = filters[FILTERS.CONCEPT]

  useEffect(() => {
    const isReferencesPanel = selectedPanel === PANELS.REFERENCES
    if (filtersConcept === '' && isReferencesPanel) return

    if (selectedConcept && selectedConcept !== filtersConcept) {
      updateFilters({ [FILTERS.CONCEPT]: selectedConcept })
    }
  }, [filtersConcept, selectedConcept, selectedPanel, updateFilters])

  const handleConceptSelected = conceptName => {
    updateSelected({ [CONCEPT]: conceptName })
    updateFilters({ [FILTERS.CONCEPT]: conceptName })
  }

  const handleClear = () => {
    updateFilters({ [FILTERS.CONCEPT]: '' })
  }

  return (
    <KBTooltipTarget placement='bottom' title={TOOLTIP.FILTERS.CONCEPT}>
      <ConceptSelect
        auxiliaryComponent={<ConceptNavAuxiliary concepts={concepts} />}
        conceptName={filters[FILTERS.CONCEPT] || ''}
        doConceptSelected={handleConceptSelected}
        onClear={handleClear}
      />
    </KBTooltipTarget>
  )
}

export default ReferencesHeaderLeft
