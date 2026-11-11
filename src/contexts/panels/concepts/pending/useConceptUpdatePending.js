import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { PENDING } from '@/lib/constants/pending.js'

import { moveDeleteToLast, isPendingDelete } from '@/lib/model/history'

import CONFIG from '@/lib/config'

const { PROCESSING } = CONFIG

const useConceptUpdatePending = () => {
  const { concept: staleConcept, pending, resetConceptPaths, setConcept } = use(ConceptContext)
  const { withProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { pendingHistory, refreshData, reloadConceptRealizations } = use(PanelDataContext)
  const { concepts: conceptSelection, updateSelected } = use(SelectedContext)
  const { closestConcept, conceptEditsRefresh, getConcept, loadConcept } = use(TaxonomyContext)

  return useCallback(
    async pendingConfirm => {
      const { approval, pendingIds } = pendingConfirm

      const pendingConcept = pending(PENDING.DATA.CONCEPT)
      const pendingParent = pending(PENDING.DATA.PARENT)

      const pendingItems = pendingIds.map(pendingId =>
        [...pendingConcept, ...pendingParent].find(item => item.id === pendingId)
      )

      return withProcessing(
        async () => {
          const deps = {
            apiFns,
            conceptEditsRefresh,
            getConcept,
            loadConcept,
            refreshData,
            reloadConceptRealizations,
            removeSelectedConceptName: conceptSelection.removeName,
            resetConceptPaths,
            updateSelected,
          }

          const deleteItem = pendingItems.find(isPendingDelete)
          const approveDeleteAlone = approval === PENDING.APPROVAL.ACCEPT && deleteItem && pendingItems.length === 1
          const deletedClosestName =
            deleteItem?.oldValue === staleConcept.name
              ? (closestConcept(staleConcept.name)?.name ?? staleConcept.parent)
              : null

          let result
          let isMorePending

          if (approveDeleteAlone) {
            const otherPending = pendingHistory.filter(item => item.concept === deleteItem.oldValue)
            if (otherPending.length > 0) {
              await processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps, items: otherPending })
            }
            result = await processPendingApproval({ approval, deps, items: pendingItems })
            isMorePending = false
          } else {
            const orderedItems = deleteItem ? moveDeleteToLast(pendingItems) : pendingItems
            result = await processPendingApproval({ approval, deps, items: orderedItems })
            isMorePending = pendingConcept.length !== pendingItems.length
          }

          const { concepts, deleted, pendingHistory: updatedPendingHistory, updated } = result

          const conceptName = staleConcept.name
          const optimisticConcept = concepts?.[conceptName]

          if (deleted.includes(conceptName)) {
            updateSelected({ concept: deletedClosestName })
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
    [
      apiFns,
      closestConcept,
      conceptEditsRefresh,
      conceptSelection,
      getConcept,
      loadConcept,
      pending,
      pendingHistory,
      refreshData,
      reloadConceptRealizations,
      resetConceptPaths,
      setConcept,
      staleConcept,
      updateSelected,
      withProcessing,
    ]
  )
}

export default useConceptUpdatePending
