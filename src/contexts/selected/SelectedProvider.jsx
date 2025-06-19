import { useEffect, useState } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'

import settingsStore from '@/lib/store/settingsStore'
import usePanelSelect from '@/contexts/selected/usePanelSelect'
import useConceptSelect from '@/contexts/selected/useConceptSelect'

import { SELECTED } from '@/lib/constants'

const SelectedProvider = ({ children }) => {
  const [settings, setSettings] = useState(null)

  const conceptSelect = useConceptSelect()
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

    if (conceptName && conceptName !== conceptSelect.current()) {
      conceptSelect.push(conceptName)
    }

    if (panelName && panelName !== panelSelect.current()) {
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
  }, [])

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
