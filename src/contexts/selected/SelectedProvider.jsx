import { useCallback, useEffect, useMemo, useState } from 'react'

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

  const getSelected = useCallback(
    key => {
      switch (key) {
        case CONCEPT:
          return conceptSelect.current()
        case PANEL:
          return panelSelect.current()
        default:
          throw new Error(`select unknown key: ${key}`)
      }
    },
    [conceptSelect, panelSelect]
  )

  const getSettings = useCallback(
    (key, field) => {
      if (!settings) return undefined
      const keySettings = settings[key]
      return field ? keySettings[field] : keySettings
    },
    [settings]
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

  const updateSettings = useCallback(({ history, references, templates }) => {
    setSettings(prevSettings => {
      if (!prevSettings) return prevSettings

      const updatedSettings = {
        ...prevSettings,
        ...(history && { [HISTORY.KEY]: { ...prevSettings[HISTORY.KEY], ...history } }),
        ...(references && { [REFERENCES.KEY]: { ...prevSettings[REFERENCES.KEY], ...references } }),
        ...(templates && { [TEMPLATES.KEY]: { ...prevSettings[TEMPLATES.KEY], ...templates } }),
      }

      settingsStore.set(updatedSettings)
      return updatedSettings
    })
  }, [])

  // const select = useCallback(
  //   ({ concept: conceptName, history, panel: panelName, references, templates }) => {
  //     updateSelected({ concept: conceptName, panel: panelName })
  //     updateSettings({ history, references, templates })
  //   },
  //   [updateSelected, updateSettings]
  // )

  useEffect(() => {
    const storedSelected = settingsStore.get()

    const history = storedSelected?.[HISTORY.KEY] || { [HISTORY.TYPE]: HISTORY.TYPES.PENDING }
    const references = storedSelected?.[REFERENCES.KEY] || { [REFERENCES.BY_CONCEPT]: false }
    const templates = storedSelected?.[TEMPLATES.KEY] || {
      [TEMPLATES.AVAILABLE]: false,
      [TEMPLATES.FILTERS.KEY]: {},
    }

    const initialSettings = {
      history,
      references,
      templates,
    }

    settingsStore.set(initialSettings)
    setSettings(initialSettings)
  }, [])

  const value = useMemo(
    () => ({
      concepts: conceptSelect,
      getSelected,
      getSettings,
      panels: panelSelect,
      updateSelected,
      updateSettings,
    }),
    [conceptSelect, getSelected, getSettings, panelSelect, updateSelected, updateSettings]
  )

  // Don't render children until settings are loaded
  if (!settings) {
    return null
  }

  return <SelectedContext value={value}>{children}</SelectedContext>
}

export default SelectedProvider
