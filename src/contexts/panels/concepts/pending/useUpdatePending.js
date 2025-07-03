import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import { updatePendingHistoryItem } from '@/lib/api/history'

import { capitalize } from '@/lib/utils'

const useUpdatePending = () => {
  const { refreshConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { refreshData: refreshPanelData } = use(PanelDataContext)

  return useCallback(
    async confirmPending => {
      const { approval, pendingIds } = confirmPending
      setProcessing(`${capitalize(approval)} pending changes...`)
      await Promise.all(
        pendingIds.map(pendingId =>
          apiFns.apiPayload(updatePendingHistoryItem, [approval, pendingId])
        )
      )

      const { pendingHistory } = await refreshPanelData('pendingHistory')
      refreshConcept(null, pendingHistory)

      setProcessing(false)
    },
    [apiFns, refreshConcept, refreshPanelData, setProcessing]
  )
}

export default useUpdatePending
