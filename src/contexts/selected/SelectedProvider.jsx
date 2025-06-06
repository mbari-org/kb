import { use, useEffect, useState } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import settingsStore from '@/lib/store/settingsStore'
import usePanelSelect from '@/contexts/selected/usePanelSelect'
import useSelectedConcept from '@/contexts/selected/useConceptSelect'

import { SELECTED } from '@/lib/constants'

const SelectedProvider = ({ children }) => {
  const { getRoot } = use(TaxonomyContext)

  const [settings, setSettings] = useState(null)

  const conceptSelect = useSelectedConcept()
  const panelSelect = usePanelSelect()

  const getSelected = field => {
    switch (field) {
      case 'concept':
        return conceptSelect.current()
      case 'panel':
        return panelSelect.current()
      default:
        return settings[field]
    }
  }

  const select = ({ byConcept, concept: conceptName, history, panel: panelName }) => {
    const updatedSettings = {
      history: history ? { type: history } : settings?.history,
      byConcept: byConcept !== undefined ? byConcept : settings?.byConcept,
    }
    settingsStore.set(updatedSettings)
    setSettings(updatedSettings)

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
    setSettings(initialValue)
  }, [getRoot])

  if (!settings) {
    return null
  }

  return (
    <SelectedContext value={{ concepts: conceptSelect, getSelected, panels: panelSelect, select }}>
      {children}
    </SelectedContext>
  )
}

export default SelectedProvider
