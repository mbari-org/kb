import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'
import ConfigContext from '@/contexts/config/ConfigContext'
import ModalContext from '@/contexts/modal/ModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { PENDING, PROCESSING } from '@/lib/constants'
import { updatePendingHistory } from '@/lib/kb/api/history'
import { fieldPending } from '@/lib/kb/model/history'

import useConceptPending from '@/contexts/concept/pending/useConceptPending'

const { ALL, ALIASES } = PENDING
const { UPDATING } = PROCESSING

const useUpdatePending = () => {
  const { config } = use(ConfigContext)
  const { concept, confirmPending, refreshConcept, setConfirmPending } = use(ConceptContext)
  const { setProcessing } = use(ModalContext)
  const { refreshConceptHistory } = use(TaxonomyContext)

  const conceptPending = useConceptPending(concept)

  const updateId = useCallback(
    async (approval, id) => {
      await updatePendingHistory(config, approval, id)
    },
    [config]
  )

  const updateIds = useCallback(
    async (approval, ids) => Promise.all(ids.map(id => updatePendingHistory(config, approval, id))),
    [config]
  )

  const updatePending = useCallback(async () => {
    setProcessing(UPDATING)
    try {
      switch (confirmPending.pending) {
        case ALL: {
          const pendingIds = conceptPending.map(pending => pending.id)
          await updateIds(confirmPending.approval, pendingIds)
          break
        }

        case ALIASES: {
          const pendingIds = fieldPending(conceptPending, 'ConceptName').map(pending => pending.id)
          await updateIds(confirmPending.approval, pendingIds)
          break
        }

        default:
          await updateId(confirmPending.approval, confirmPending.pending)
          break
      }

      const refreshedConcept = await refreshConceptHistory(concept.name)
      setConfirmPending(null)
      setProcessing(null)
      refreshConcept(refreshedConcept)
    } catch (error) {
      setProcessing(null)
      console.error('Error confirming pending changes:', error)
    }
  }, [
    concept.name,
    conceptPending,
    confirmPending.approval,
    confirmPending.pending,
    refreshConcept,
    refreshConceptHistory,
    setConfirmPending,
    setProcessing,
    updateId,
    updateIds,
  ])

  return updatePending
}

export default useUpdatePending
