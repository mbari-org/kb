import { use, useEffect, useRef } from 'react'

import ConceptSelect from '@/components/common/concept/ConceptSelect'
import ConceptSelectNavHistoryAuxiliary from '@/components/common/concept/ConceptSelectNavHistoryAuxiliary'

import SelectedContext from '@/contexts/selected/SelectedContext'

import { SELECTED } from '@/lib/constants/selected.js'

const { CONCEPT, PANEL, PANELS, SETTINGS } = SELECTED
const { REFERENCES } = SETTINGS

const ReferencesHeaderLeft = () => {
  const { concepts, getSelected, getSettings, updateSelected, updateSettings } = use(SelectedContext)

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
    if (selectedName) {
      updateSelected({ [CONCEPT]: selectedName })
      updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: true } })
    } else {
      updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false } })
    }
  }

  const handleClear = () => {
    updateSettings({ [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false } })
  }

  return (
    <ConceptSelect
      conceptName={byConcept ? selectedConcept : ''}
      doConceptSelected={handleConceptSelected}
      auxiliaryComponent={<ConceptSelectNavHistoryAuxiliary concepts={concepts} />}
      onClear={handleClear}
    />
  )
}

export default ReferencesHeaderLeft
