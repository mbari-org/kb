import { useCallback, useState } from 'react'

import { SELECTED } from '@/lib/constants'

const { HISTORY, REFERENCES, TEMPLATES } = SELECTED.SETTINGS

const useSettings = () => {
  const [settings, setSettings] = useState({
    [HISTORY.KEY]: { [HISTORY.TYPE]: HISTORY.TYPES.PENDING },
    [REFERENCES.KEY]: { [REFERENCES.BY_CONCEPT]: false },
    [TEMPLATES.KEY]: {
      [TEMPLATES.BY_AVAILABLE]: false,
      [TEMPLATES.FILTERS.KEY]: {},
    },
  })

  const getSettings = useCallback(
    (key, field) => {
      const keySettings = settings[key]
      return field ? keySettings?.[field] : keySettings
    },
    [settings]
  )

  const updateSettings = useCallback(({ history, references, templates }) => {
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