import { useCallback, useState } from 'react'

import useConceptSelect from '@/contexts/selected/useConceptSelect'
import usePanelSelect from '@/contexts/selected/usePanelSelect'

import { createError } from '@/lib/errors'

import { SELECTED } from '@/constants/selected.js'

const { CONCEPT, PANEL } = SELECTED

const useSelected = () => {
  const [currentConcept, setCurrentConcept] = useState(null)
  const [currentPanel, setCurrentPanel] = useState(null)

  const conceptSelect = useConceptSelect(setCurrentConcept)
  const panelSelect = usePanelSelect(setCurrentPanel)

  const getSelected = useCallback(
    key => {
      if (key === CONCEPT) {
        return conceptSelect.current()
      } else if (key === PANEL) {
        return panelSelect.current()
      } else {
        throw createError(
          'Invalid Selection Key',
          `Cannot get selection for unknown key: ${key}`,
          { key }
        )
      }
    },
    [conceptSelect, panelSelect]
  )

  const updateSelected = useCallback(
    ({ concept: conceptName, panel: panelName }) => {
      if (conceptName && conceptName !== conceptSelect.current()) {
        conceptSelect.push(conceptName)
      }

      if (panelName && panelName !== panelSelect.current()) {
        panelSelect.push(panelName)
      }
    },
    [conceptSelect, panelSelect]
  )

  return {
    conceptSelect,
    currentConcept,
    currentPanel,
    getSelected,
    panelSelect,
    updateSelected,
  }
}

export default useSelected