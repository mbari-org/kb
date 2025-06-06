import { use, useEffect, useState } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import settingsStore from '@/lib/store/settingsStore'
import usePanelSelect from '@/contexts/selected/usePanelSelect'
import useSelectedConcept from '@/contexts/selected/useConceptSelect'

import { SELECTED } from '@/lib/constants'

const SelectedProvider = ({ children }) => {
  const { getRoot } = use(TaxonomyContext)

  const [selected, setSelected] = useState(null)

  const conceptSelect = useSelectedConcept()
  const panelSelect = usePanelSelect()

  const getSelected = field => {
    switch (field) {
      case 'concept':
        return conceptSelect.current()
      case 'panel':
        return panelSelect.current()
      default:
        return selected[field]
    }
  }

  const select = ({ byConcept, concept: conceptName, history, panel: panelName }) => {
    const updated = {
      history: history ? { type: history } : selected?.history,
      byConcept: byConcept !== undefined ? byConcept : selected?.byConcept,
    }
    settingsStore.set(updated)
    setSelected(updated)

    if (conceptName) {
      conceptSelect.push(conceptName)
    }

    if (panelName) {
      panelSelect.push(panelName)
    }
  }

  useEffect(() => {
    const storedSelected = settingsStore.get()

    const byConcept = storedSelected?.byConcept || false
    const history = storedSelected?.history || { type: SELECTED.HISTORY.TYPE.PENDING }

    const initialValue = { history, byConcept }

    settingsStore.set(initialValue)
    setSelected(initialValue)
  }, [getRoot])

  if (!selected) {
    return null
  }

  return (
    <SelectedContext value={{ concepts: conceptSelect, getSelected, panels: panelSelect, select }}>
      {children}
    </SelectedContext>
  )
}

export default SelectedProvider
