import { use } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import UserContext from '@/contexts/user/UserContext'

const useUpdatesContext = () => {
  const { concept: staleConcept, stagedState } = use(ConceptContext)
  const { apiFns } = use(ConfigContext)
  const { getReferences, refreshData: refreshPanelData } = use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { getSettings } = use(SelectedContext)
  const { getPreferences, user } = use(UserContext)

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
