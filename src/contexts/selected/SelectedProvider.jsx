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
      case SELECTED.CONCEPT:
        return conceptSelect.current()
      case SELECTED.PANEL:
        return panelSelect.current()
      case SELECTED.SETTINGS.REFERENCES.BY_CONCEPT:
        return settings?.references?.byConcept || false
      default:
        return settings[field]
    }
  }

  const select = ({ byConcept, concept: conceptName, history, panel: panelName, references }) => {
    const updatedSettings = {
      history: history ? { type: history } : settings?.history,
      references: {
        ...settings?.references,
        ...(references || {}),
        ...(byConcept !== undefined ? { byConcept } : {}),
      },
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

    const byConcept = storedSelected?.references?.byConcept || storedSelected?.byConcept || false
    const history = storedSelected?.history || { type: SELECTED.HISTORY.TYPE.PENDING }

    const initialValue = {
      history,
      references: { byConcept },
    }

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
