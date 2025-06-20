import { useEffect, useState } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'

import settingsStore from '@/lib/store/settingsStore'
import usePanelSelect from '@/contexts/selected/usePanelSelect'
import useConceptSelect from '@/contexts/selected/useConceptSelect'

import { SELECTED } from '@/lib/constants'

const { CONCEPT, PANEL } = SELECTED
const { HISTORY, REFERENCES, TEMPLATES } = SELECTED.SETTINGS

const SelectedProvider = ({ children }) => {
  const [settings, setSettings] = useState(null)

  const conceptSelect = useConceptSelect()
  const panelSelect = usePanelSelect()

  const getSelected = field => {
    switch (field) {
      case CONCEPT:
        return conceptSelect.current()
      case PANEL:
        return panelSelect.current()
      case REFERENCES.BY_CONCEPT:
        return settings?.references?.byConcept || false
      case TEMPLATES.AVAILABLE:
        return settings?.templates?.available || false
      default:
        return settings[field]
    }
  }

  const select = ({ concept: conceptName, history, panel: panelName, references, templates }) => {
    const updatedSettings = {
      ...settings,
      ...(history && { [HISTORY.KEY]: { ...settings?.history, ...history } }),
      ...(references && { [REFERENCES.KEY]: { ...settings?.references, ...references } }),
      ...(templates && { [TEMPLATES.KEY]: { ...settings?.templates, ...templates } }),
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
