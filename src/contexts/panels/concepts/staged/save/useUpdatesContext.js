import { use } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptStagedContext from '@/contexts/panels/concepts/ConceptStagedContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedSettingsContext from '@/contexts/selected/SelectedSettingsContext'
import UserContext from '@/contexts/user/UserContext'

const useUpdatesContext = () => {
  const { concept: staleConcept } = use(ConceptContext)
  const { stagedState } = use(ConceptStagedContext)
  const { apiFns } = use(ConfigContext)
  const { getReferences, refreshData: refreshPanelData } = use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { getSettings } = use(SelectedSettingsContext)
  const { getPreferences, isAdmin, user } = use(UserContext)

  return {
    apiFns,
    getPreferences,
    getReferences,
    getSettings,
    isAdmin,
    reassignmentData: stagedState?.reassignmentData,
    refreshPanelData,
    savePreferences,
    staleConcept,
    user,
  }
}

export default useUpdatesContext
