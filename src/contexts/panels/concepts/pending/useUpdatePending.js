import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useRejectPending from './useRejectPending'

import { updatePendingHistoryItem } from '@/lib/api/history'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'

const useUpdatedPending = () => {
  const { concept, resetConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)

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
        resetConcept(concept)
      }

      setProcessing(false)
    },
    [apiFns, concept, resetConcept, setProcessing, rejectPending]
  )
}

export default useUpdatedPending
