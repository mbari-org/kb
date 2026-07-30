import { use, useEffect, useRef } from 'react'

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

const ReferencesHeaderLeft = () => {
  const { concepts, getSelected, getSettings, updateSettings } = use(SelectedContext)
  const { filters, updateFilters } = use(ReferencesContext)

  const byConcept = getSettings(REFERENCES.KEY, REFERENCES.BY_CONCEPT)

  const selectedConcept = getSelected(CONCEPT)
  const selectedPanel = getSelected(PANEL)

  const prevSelectedPanelRef = useRef(selectedPanel)

  useEffect(() => {
    const wasReferencesPanel = prevSelectedPanelRef.current === PANELS.REFERENCES
    const isReferencesPanel = selectedPanel === PANELS.REFERENCES

    if (!wasReferencesPanel && isReferencesPanel && selectedConcept && !byConcept) {
      updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
    }

    prevSelectedPanelRef.current = selectedPanel
  }, [byConcept, selectedConcept, selectedPanel, updateSettings])

  const handleConceptSelected = selectedName => {
    updateFilters({ [REFERENCES.FILTERS.CONCEPT]: selectedName || '' })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: !!selectedName } })
  }

  const handleClear = () => {
    updateFilters({ [REFERENCES.FILTERS.CONCEPT]: '' })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false } })
  }

  return (
    <KBTooltipTarget placement='bottom' title={TOOLTIP.FILTERS.CONCEPT}>
      <ConceptSelect
        auxiliaryComponent={<ConceptNavAuxiliary concepts={concepts} />}
        conceptName={byConcept ? filters[REFERENCES.FILTERS.CONCEPT] || '' : ''}
        doConceptSelected={handleConceptSelected}
        onClear={handleClear}
        updateConceptSelected={false}
      />
    </KBTooltipTarget>
  )
}

export default ReferencesHeaderLeft
