import { useCallback, useState } from 'react'

import { SELECTED } from '@/lib/constants/selected.js'

const { HISTORY, REALIZATIONS, REFERENCES, TEMPLATES } = SELECTED.SETTINGS

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
        updatedSettings[REFERENCES.KEY] = {
          ...prevSettings[REFERENCES.KEY],
          ...references,
        }
      }
      if (realizations) {
        updatedSettings[REALIZATIONS.KEY] = {
          ...prevSettings[REALIZATIONS.KEY],
          ...realizations,
        }
      }

      if (templates) {
        updatedSettings[TEMPLATES.KEY] = {
          ...prevSettings[TEMPLATES.KEY],
          ...templates,
        }
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