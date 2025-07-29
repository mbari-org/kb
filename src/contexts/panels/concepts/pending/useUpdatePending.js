import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useRejectPending from './useRejectPending'

import { updatePendingHistoryItem } from '@/lib/api/history'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'

const useUpdatedPending = () => {
  const { concept, pending, resetConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)

  const rejectPending = useRejectPending()

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds } = pendingConfirm

      setProcessing(`${capitalize(approval)} pending changes...`)
      const approvalUpdates = await Promise.all(
        pendingIds.map(pendingId =>
          apiFns.apiPayload(updatePendingHistoryItem, [approval, pendingId])
        )
      )

      if (approval === PENDING.APPROVAL.REJECT) {
        const pendingConcept = pending(PENDING.DATA.CONCEPT)
        const pendingItems = pendingIds.map(pendingId =>
          pendingConcept.find(item => item.id === pendingId)
        )
        await rejectPending(pendingItems, approvalUpdates)
      } else {
        resetConcept(concept)
      }

      setProcessing(false)
    },
    [apiFns, concept, pending, resetConcept, setProcessing, rejectPending]
  )
}

export default useUpdatedPending
