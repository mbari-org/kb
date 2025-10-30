import { use } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import UserContext from '@/contexts/user/UserContext'
import SelectedContext from '@/contexts/selected/SelectedContext'

const useUpdatesContext = () => {
  const { apiFns } = use(ConfigContext)
  const { concept: staleConcept, stagedState } = use(ConceptContext)
  const { getReferences, refreshData: refreshPanelData } = use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { getPreferences, user } = use(UserContext)
  const { getSettings } = use(SelectedContext)

  return {
    apiFns,
    getPreferences,
    getReferences,
    getSettings,
    reassignmentData: stagedState?.reassignmentData,
    refreshPanelData,
    savePreferences,
    staleConcept,
    user,
  }
}

export default useUpdatesContext
