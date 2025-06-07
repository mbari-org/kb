import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { updatePendingHistoryItem } from '@/lib/api/history'
import { PENDING, PROCESSING } from '@/lib/constants'
import { fieldPending } from '@/lib/kb/model/history'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'
import useUpdateAssociatedData from '@/contexts/concept/pending/useUpdateAssociatedData'

import { isEmpty } from '@/lib/util'

const { ALL, ALIASES, APPROVAL } = PENDING
const { UPDATING } = PROCESSING

const useUpdatePending = () => {
  const { config } = use(ConfigContext)
  const { concept, confirmPending, refreshConcept, setConfirmPending } = use(ConceptContext)
  const { setProcessing } = use(ModalContext)
  const { refreshHistory } = use(TaxonomyContext)

  const conceptPending = useConceptPending(concept.name)
  const parentPending = useConceptPending(concept.parent)

  const pendingActions = isEmpty(conceptPending) ? parentPending : conceptPending

  const updateNameAssociatedData = useUpdateAssociatedData(pendingActions)

  const updateId = useCallback(
    async (approval, id) => {
      await updatePendingHistoryItem(config, approval, id)
      if (approval === APPROVAL.ACCEPT) {
        await updateNameAssociatedData(id)
      }
    },
    [config, updateNameAssociatedData]
  )

  const updateIds = useCallback(
    async (approval, ids) =>
      Promise.all(ids.map(id => updatePendingHistoryItem(config, approval, id))),
    [config]
  )

  const updatePending = useCallback(async () => {
    if (!confirmPending) {
      return
    }

    setProcessing(UPDATING)
    try {
      switch (confirmPending.pending) {
        case ALL: {
          const pendingIds = pendingActions.map(pending => pending.id)
          await updateIds(confirmPending.approval, pendingIds)
          break
        }

        case ALIASES: {
          const pendingIds = fieldPending(pendingActions, 'ConceptName').map(pending => pending.id)
          await updateIds(confirmPending.approval, pendingIds)
          break
        }

        default:
          await updateId(confirmPending.approval, confirmPending.pending)
          break
      }

      await refreshHistory('pending')
      refreshConcept()
      setConfirmPending(null)
      setProcessing(null)
    } catch (error) {
      setProcessing(null)
      console.error('Error confirming pending changes:', error)
    }
  }, [
    confirmPending,
    pendingActions,
    refreshConcept,
    refreshHistory,
    setConfirmPending,
    setProcessing,
    updateId,
    updateIds,
  ])

  return updatePending
}

export default useUpdatePending
