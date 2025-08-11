import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'

import useRejectPending from './useRejectPending'

import { updatePendingHistoryItem } from '@/lib/api/history'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'

import { sleep } from '@/lib/utils'

const useUpdatedPending = () => {
  const { concept, pending, resetConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)

  const rejectPending = useRejectPending()

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds: propIds, pendingItems: propItems } = pendingConfirm

      const pendingConcept = pending(PENDING.DATA.CONCEPT)

      const pendingItems = propItems
        ? propItems
        : propIds.map(pendingId => pendingConcept.find(item => item.id === pendingId))

      setProcessing(`${capitalize(approval)} pending changes...`)

      await Promise.all(
        pendingItems.map(pendingItem =>
          apiFns.apiPayload(updatePendingHistoryItem, [approval, pendingItem.id])
        )
      )

      // CxInc Tmp Fix until server is updated
      await sleep(1000)

      approval === PENDING.APPROVAL.REJECT
        ? await rejectPending(pendingItems)
        : await resetConcept(concept)

      setProcessing(false)

      return pendingConcept.length !== pendingItems.length
    },
    [apiFns, concept, pending, rejectPending, resetConcept, setProcessing]
  )
}

export default useUpdatedPending
