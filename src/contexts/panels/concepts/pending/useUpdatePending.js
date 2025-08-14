import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useRejectPending from './useRejectPending'

import { updatePendingItem } from '@/lib/api/history'

import { capitalize } from '@/lib/utils'

import { PENDING } from '@/lib/constants'

const useUpdatedPending = () => {
  const { concept: staleConcept, pending, resetConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { updateSelected } = use(SelectedContext)
  const { refreshConcept } = use(TaxonomyContext)

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
          apiFns.apiPayload(updatePendingItem, [approval, pendingItem.id])
        )
      )

      // CxTmp until server is updated
      // await sleep(1000)

      const freshConcept =
        approval === PENDING.APPROVAL.REJECT ? await rejectPending(pendingItems) : staleConcept

      const { concept: updatedConcept } = await refreshConcept(freshConcept, staleConcept)

      await resetConcept(updatedConcept)

      updateSelected({ concept: updatedConcept.name })

      setProcessing(false)

      return pendingConcept.length !== pendingItems.length
    },
    [
      pending,
      setProcessing,
      rejectPending,
      staleConcept,
      refreshConcept,
      resetConcept,
      updateSelected,
      apiFns,
    ]
  )
}

export default useUpdatedPending
