import { use } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import PreferencesContext from '@/contexts/preferences/PreferencesContext'
import UserContext from '@/contexts/user/UserContext'

const useUpdatesContext = () => {
  const { apiFns } = use(ConfigContext)
  const { concept: staleConcept, stagedState } = use(ConceptContext)
  const { getReferences, refreshData: refreshPanelData } = use(PanelDataContext)
  const { savePreferences } = use(PreferencesContext)
  const { getPreferences, user } = use(UserContext)

  return {
    apiFns,
    getPreferences,
    getReferences,
    reassignmentData: stagedState?.reassignmentData,
    refreshPanelData,
    savePreferences,
    staleConcept,
    user,
  }
}

export default useUpdatesContext
