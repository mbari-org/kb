import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/kb/pending/processPendingApproval'

const useHistoryUpdatePending = () => {
  const { apiFns } = use(ConfigContext)
  const { refreshData } = use(PanelDataContext)
  const { getConcept, refreshConcept } = use(TaxonomyContext)
  const { updateSelected } = use(SelectedContext)

  return useCallback(
    async ({ approval, item }) => {
      await processPendingApproval({
        approval,
        deps: {
          apiFns,
          getConcept,
          refreshConcept,
          updateSelected,
          refreshHistory: () => refreshData('pendingHistory'),
        },
        items: [item],
      })

      return true
    },
    [apiFns, getConcept, refreshConcept, refreshData, updateSelected]
  )
}

export default useHistoryUpdatePending
