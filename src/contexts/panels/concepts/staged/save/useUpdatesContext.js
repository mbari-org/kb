import { use } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import UserContext from '@/contexts/user/UserContext'

const useUpdatesContext = () => {
  const { apiFns } = use(ConfigContext)
  const { concept: staleConcept } = use(ConceptContext)
  const { getReferences, refreshData: refreshPanelData } = use(PanelDataContext)
  const { getPreferences, updatePreferences, user } = use(UserContext)

  return { apiFns, getPreferences, getReferences, refreshPanelData, staleConcept, updatePreferences, user }
}

export default useUpdatesContext
