import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useRejectPending from './useRejectPending'

import { updatePendingHistoryItem } from '@/lib/api/history'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'

const useUpdatedPending = () => {
  const { concept, refreshConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { refreshData: refreshPanelData } = use(PanelDataContext)

  const rejectPending = useRejectPending()

  return useCallback(
    async confirmPending => {
      const { approval, pendingItems } = confirmPending
      const pendingIds = pendingItems.map(item => item.id)

      setProcessing(`${capitalize(approval)} pending changes...`)
      const approvalUpdates = await Promise.all(
        pendingIds.map(pendingId =>
          apiFns.apiPayload(updatePendingHistoryItem, [approval, pendingId])
        )
      )

      if (approval === PENDING.APPROVAL.REJECT) {
        await rejectPending(pendingItems, approvalUpdates)
      } else {
        const { pendingHistory } = await refreshPanelData('pendingHistory')
        refreshConcept(concept, pendingHistory)
      }

      setProcessing(false)
    },
    [apiFns, concept, refreshConcept, refreshPanelData, setProcessing, rejectPending]
  )
}

export default useUpdatedPending
