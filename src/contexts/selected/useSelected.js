import { useCallback, useState } from 'react'

import useConceptSelection from '@/contexts/selected/useConceptSelection'
import usePanelSelection from '@/contexts/selected/usePanelSelection'

import { createError } from '@/lib/errors'

import { SELECTED } from '@/lib/constants/selected.js'

const { CONCEPT, PANEL } = SELECTED

const useSelected = () => {
  const [currentConcept, setCurrentConcept] = useState(null)
  const [currentPanel, setCurrentPanel] = useState(null)

  const conceptSelection = useConceptSelection(setCurrentConcept)
  const panelSelection = usePanelSelection(setCurrentPanel)

  const getSelected = useCallback(
    key => {
      if (key === CONCEPT) {
        return conceptSelection.current()
      } else if (key === PANEL) {
        return panelSelection.current()
      } else {
        throw createError('Invalid Selection Key', `Cannot get selection for unknown key: ${key}`, { key })
      }
    },
    [conceptSelection, panelSelection]
  )

  const updateSelected = useCallback(
    ({ concept: conceptName, panel: panelName }) => {
      if (conceptName && conceptName !== conceptSelection.current()) {
        conceptSelection.push(conceptName)
      }

      if (panelName && panelName !== panelSelection.current()) {
        panelSelection.push(panelName)
      }
    },
    [conceptSelection, panelSelection]
  )

  return {
    conceptSelection,
    currentConcept,
    currentPanel,
    getSelected,
    panelSelection,
    updateSelected,
  }
}

export default useSelected
