import { use, useEffect, useRef } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ConceptNavAuxiliary from '@/components/common/concept/ConceptNavAuxiliary'

import SelectedContext from '@/contexts/selected/SelectedContext'
import CONFIG from '@/text'

import { SELECTED } from '@/lib/constants/selected.js'
const { CONCEPT, PANEL, SETTINGS } = SELECTED
const { REFERENCES } = SETTINGS
const REALIZATIONS_PANEL = CONFIG.PANELS.REALIZATIONS.PANEL.NAME

const RealizationsHeaderLeft = () => {
  const { concepts, getSelected, updateSelected, updateSettings } = use(SelectedContext)
  const selectedConcept = getSelected(CONCEPT)
  const selectedPanel = getSelected(PANEL)
  const prevSelectedPanelRef = useRef(selectedPanel)

  useEffect(() => {
    const wasRealizationsPanel = prevSelectedPanelRef.current === REALIZATIONS_PANEL
    const isRealizationsPanel = selectedPanel === REALIZATIONS_PANEL

    if (!wasRealizationsPanel && isRealizationsPanel) {
      updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false } })
    }

    prevSelectedPanelRef.current = selectedPanel
  }, [selectedPanel, updateSettings])

  const handleConceptSelected = selectedName => {
    !!selectedName && updateSelected({ [CONCEPT]: selectedName })
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: !!selectedName } })
  }

  const handleClear = () => {
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false } })
  }

  return (
    <ConceptSelect
      conceptName={selectedConcept}
      doConceptSelected={handleConceptSelected}
      auxiliaryComponent={<ConceptNavAuxiliary concepts={concepts} />}
      onClear={handleClear}
    />
  )
}

export default RealizationsHeaderLeft