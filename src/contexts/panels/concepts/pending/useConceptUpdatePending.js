import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useProcessPendingDeps from '@/contexts/common/useProcessPendingDeps'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { PENDING } from '@/lib/constants/pending.js'

import { isPendingAdd, isPendingDelete, moveAddToFirst, moveAddToLast, moveDeleteToLast } from '@/lib/model/history'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const useConceptUpdatePending = () => {
  const { concept: staleConcept, pending, setConcept } = use(ConceptContext)
  const { withProcessing } = use(ConceptModalContext)
  const { closestConcept } = use(TaxonomyContext)
  const deps = useProcessPendingDeps()

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds } = pendingConfirm
      const { getConcept, updateSelected } = deps

      const pendingConcept = pending(PENDING.DATA.CONCEPT)
      const pendingParent = pending(PENDING.DATA.PARENT)

      const pendingItems = pendingIds.map(pendingId =>
        [...pendingConcept, ...pendingParent].find(item => item.id === pendingId)
      )

      return withProcessing(
        async () => {
          const addItem = pendingItems.find(isPendingAdd)
          const deleteItem = pendingItems.find(isPendingDelete)

          const isCurrentConcept = deleteItem?.oldValue === staleConcept.name || addItem?.newValue === staleConcept.name
          const removedClosestName = isCurrentConcept
            ? (closestConcept(staleConcept.name)?.name ?? staleConcept.parent)
            : null

          let orderedItems = approval === PENDING.APPROVAL.REJECT ? [...pendingItems].reverse() : pendingItems
          if (addItem) {
            orderedItems = approval === PENDING.APPROVAL.ACCEPT ? moveAddToFirst(orderedItems) : moveAddToLast(orderedItems)
          }
          if (deleteItem) {
            orderedItems = moveDeleteToLast(orderedItems)
          }

          const result = await processPendingApproval({ approval, deps, items: orderedItems })
          const isMorePending = pendingConcept.length !== pendingItems.length

          const { concepts, pendingHistory: updatedPendingHistory, removed, updated } = result

          const conceptName = staleConcept.name
          const optimisticConcept = concepts?.[conceptName]

          if (removed.includes(conceptName)) {
            updateSelected({ concept: removedClosestName })
          } else if (optimisticConcept) {
            await setConcept(optimisticConcept, updatedPendingHistory)
          } else if (updated.includes(conceptName)) {
            const refreshedConcept = getConcept(conceptName)
            if (refreshedConcept) {
              await setConcept(refreshedConcept, updatedPendingHistory)
            }
          } else if (!getConcept(conceptName)) {
            updateSelected({ concept: staleConcept.parent })
          }

          return isMorePending
        },
        PROCESSING.UPDATE,
        `${PROCESSING.ARG.PENDING}: ${approval}`
      )
    },
    [closestConcept, deps, pending, setConcept, staleConcept, withProcessing]
  )
}

export default useConceptUpdatePending
