import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'

const useHistoryUpdatePending = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)
  const { conceptEditsRefresh, getConcept } = use(TaxonomyContext)
  const { updateSelected } = use(SelectedContext)

  return useCallback(
    async ({ approval, item }) => {
      await processPendingApproval({
        approval,
        deps: {
          apiFns,
          conceptEditsRefresh,
          getConcept,
          updateSelected,
          refreshHistory: () => refreshData('pendingHistory'),
        },
        items: [item],
      })

      return true
    },
    [apiFns, conceptEditsRefresh, getConcept, refreshData, updateSelected]
  )
}

export default useHistoryUpdatePending
