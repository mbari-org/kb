import { use, useMemo } from 'react'

import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import usePreferences from '@/contexts/selected/usePreferences'
import useSelected from '@/contexts/selected/useSelected'
import useSettings from '@/contexts/selected/useSettings'

const SelectedProvider = ({ children }) => {
  const { createPreferences, getPreferences, updatePreferences, user } = use(UserContext)
  use(TaxonomyContext)

  const {
    currentConcept,
    currentPanel,
    conceptSelect,
    panelSelect,
    getSelected,
    updateSelected,
  } = useSelected()

  const { settings, setSettings, getSettings, updateSettings } = useSettings()

  const { isLoading } = usePreferences({
    conceptSelect,
    createPreferences,
    currentConcept,
    currentPanel,
    getPreferences,
    panelSelect,
    setSettings,
    settings,
    updatePreferences,
    user,
  })

  const value = useMemo(
    () => ({
      concepts: conceptSelect,
      getSelected,
      getSettings,
      isLoading,
      panels: panelSelect,
      updateSelected,
      updateSettings,
    }),
    [conceptSelect, getSelected, getSettings, isLoading, panelSelect, updateSelected, updateSettings]
  )

  return <SelectedContext.Provider value={value}>{children}</SelectedContext.Provider>
}

export default SelectedProvider