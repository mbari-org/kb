import { use, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useProcessPendingDeps from '@/contexts/common/useProcessPendingDeps'

import {
  performReassignments,
  relatedDataCounts,
} from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import { childAddDependents, implicitDeleteRejects, withDependents } from '@/lib/concept/pending/childAddDependents'
import orderPendingBatch from '@/lib/concept/pending/orderPendingBatch'
import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { isRenameRejectBlocked } from '@/lib/concept/pending/renameRejectBlocked'
import { isPendingName } from '@/lib/concept/state/name'
import { PENDING } from '@/lib/constants/pending.js'

import { isPendingAdd, isPendingDelete } from '@/lib/model/history'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG
const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const useConceptUpdatePending = () => {
  const { concept: staleConcept, pending, setConcept } = use(ConceptContext)
  const { withProcessing } = use(ConceptModalContext)
  const { closestConcept, isDescendant } = use(TaxonomyContext)
  const { pendingHistory } = use(PanelDataContext)
  const { showBoundary } = useErrorBoundary()
  const deps = useProcessPendingDeps()

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds, nameChangeType } = pendingConfirm
      const { apiFns, getConcept, getReferences, updateSelected } = deps

      const pendingConcept = pending(PENDING.DATA.CONCEPT)
      const pendingParent = pending(PENDING.DATA.PARENT)

      const selectedItems = pendingIds.map(pendingId =>
        [...pendingConcept, ...pendingParent].find(item => item.id === pendingId)
      )
      const implicitRejects = implicitDeleteRejects(approval, selectedItems, pendingHistory)
      const implicitRejectIds = new Set(implicitRejects.map(item => item.id))
      const pendingItems = withDependents(
        approval,
        selectedItems.filter(item => !implicitRejectIds.has(item.id)),
        pendingHistory
      )

      return withProcessing(
        async () => {
          if (approval === PENDING.APPROVAL.ACCEPT && implicitRejects.length > 0) {
            await processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps, items: implicitRejects })
          }

          const addItem = pendingItems.find(isPendingAdd)
          const deleteItem = pendingItems.find(isPendingDelete)

          const isCurrentConcept = deleteItem?.oldValue === staleConcept.name || addItem?.newValue === staleConcept.name
          const removedClosestName = isCurrentConcept
            ? (closestConcept(staleConcept.name)?.name ?? staleConcept.parent)
            : null

          let orderedItems = orderPendingBatch(approval, pendingItems)

          if (approval === PENDING.APPROVAL.REJECT && addItem) {
            const rejectedAdds = orderedItems.filter(isPendingAdd)
            const dependentIds = new Set(
              rejectedAdds.flatMap(add => childAddDependents(add, pendingHistory)).map(item => item.id)
            )
            const inRejectedBranch = item =>
              rejectedAdds.some(
                add =>
                  item.id !== add.id &&
                  !dependentIds.has(item.id) &&
                  (item.concept === add.newValue || isDescendant(add.newValue, item.concept))
              )
            const prunedConceptNames = [...new Set(orderedItems.filter(inRejectedBranch).map(item => item.concept))]
            prunedConceptNames.forEach(name => deps.removeSelectedConceptName(name))
            orderedItems = orderedItems.filter(item => !inRejectedBranch(item))
          }

          if (approval === PENDING.APPROVAL.REJECT) {
            orderedItems = [...implicitRejects, ...orderedItems]
          }

          const result = await processPendingApproval({ approval, deps, items: orderedItems })
          const isMorePending = pendingConcept.length !== pendingItems.length

          if (approval === PENDING.APPROVAL.ACCEPT && nameChangeType === REASSIGN) {
            const renameItem = pendingItems.find(isPendingName)
            if (renameItem) {
              const counts = await relatedDataCounts({
                apiFns,
                concept: { name: renameItem.newValue },
                getReferences,
                renamedFrom: renameItem.oldValue,
              })
              await performReassignments(renameItem.oldValue, renameItem.newValue, counts)
            }
          }

          const { concepts, pendingHistory: updatedPendingHistory, removed, updated } = result

          const conceptName = staleConcept.name
          const optimisticConcept = concepts?.[conceptName]
          const viewedName = optimisticConcept?.name ?? conceptName

          if (removed.includes(viewedName)) {
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

          return !removed.includes(viewedName) && isMorePending
        },
        PROCESSING.UPDATE,
        `${PROCESSING.ARG.PENDING}: ${approval}`,
        { delayMs: 0 }
      ).catch(error => {
        if (isRenameRejectBlocked(error)) throw error
        showBoundary(error)
        return undefined
      })
    },
    [closestConcept, deps, isDescendant, pending, pendingHistory, setConcept, showBoundary, staleConcept, withProcessing]
  )
}

export default useConceptUpdatePending
