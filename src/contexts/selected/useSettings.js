import { useCallback, useState } from 'react'

import { SELECTED } from '@/lib/constants/selected.js'

const { HISTORY, REALIZATIONS, REFERENCES, TEMPLATES } = SELECTED.SETTINGS

const mergePanelSettings = (prevPanelSettings = {}, nextPanelSettings = {}, filtersKey) => {
  const { replaceFilters = false, ...panelUpdates } = nextPanelSettings
  const updatedPanelSettings = {
    ...prevPanelSettings,
    ...panelUpdates,
  }

  if (Object.hasOwn(panelUpdates, filtersKey)) {
    updatedPanelSettings[filtersKey] = replaceFilters
      ? panelUpdates[filtersKey]
      : {
          ...(prevPanelSettings[filtersKey] || {}),
          ...panelUpdates[filtersKey],
        }
  }

  return updatedPanelSettings
}

const useSettings = () => {
  const [settings, setSettings] = useState({
    [HISTORY.KEY]: { [HISTORY.TYPE]: HISTORY.TYPES.PENDING },
    [REFERENCES.KEY]: { [REFERENCES.FILTERS.KEY]: {} },
    [TEMPLATES.KEY]: {
      [TEMPLATES.BY_AVAILABLE]: false,
      [TEMPLATES.FILTERS.KEY]: {},
    },
    [REALIZATIONS.KEY]: {
      [REALIZATIONS.FILTERS.KEY]: {},
    },
  })

  const getSettings = useCallback(
    (key, field) => {
      const keySettings = settings[key]
      return field ? keySettings?.[field] : keySettings
    },
    [settings]
  )

  const updateSettings = useCallback(({ history, realizations, references, templates }) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings }

      if (history) {
        updatedSettings[HISTORY.KEY] = {
          ...prevSettings[HISTORY.KEY],
          ...history,
        }
      }

      if (references) {
        updatedSettings[REFERENCES.KEY] = mergePanelSettings(
          prevSettings[REFERENCES.KEY],
          references,
          REFERENCES.FILTERS.KEY
        )
      }
      if (realizations) {
        updatedSettings[REALIZATIONS.KEY] = mergePanelSettings(
          prevSettings[REALIZATIONS.KEY],
          realizations,
          REALIZATIONS.FILTERS.KEY
        )
      }

      if (templates) {
        updatedSettings[TEMPLATES.KEY] = mergePanelSettings(
          prevSettings[TEMPLATES.KEY],
          templates,
          TEMPLATES.FILTERS.KEY
        )
      }

      return updatedSettings
    })
  }, [])

  return {
    getSettings,
    setSettings,
    settings,
    updateSettings,
  }
}

export default useSettings