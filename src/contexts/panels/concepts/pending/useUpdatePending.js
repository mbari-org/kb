import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import AppModalContext from '@/contexts/modal/AppModalContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { updatePendingHistoryItem } from '@/lib/api/history'

import { PENDING } from '@/lib/constants'

const { APPROVAL: _APPROVAL, GROUP } = PENDING

const useUpdatePending = () => {
  const { setProcessing } = use(AppModalContext)
  const { apiFns } = use(ConfigContext)
  const { confirmPending, setConfirmPending, refreshConcept } = use(ConceptContext)
  const { refreshHistory } = use(TaxonomyContext)

  return useCallback(async () => {
    if (!confirmPending) {
      return
    }

    try {
      setProcessing('Updating pending changes...')

      switch (confirmPending.change) {
        case GROUP.ALL: {
          // Handle all pending changes for the concept
          // This would need to get all pending items and update them
          // For now, just close the modal
          break
        }
        default: {
          // Handle individual pending item
          await updatePendingHistoryItem(
            apiFns.apiPayload,
            confirmPending.approval,
            confirmPending.pending
          )
          break
        }
      }

      await refreshHistory('pending')
      refreshConcept()
      setConfirmPending(null)
      setProcessing(null)
    } catch (error) {
      console.error('Error updating pending changes:', error)
      setProcessing(null)
    }
  }, [apiFns, confirmPending, refreshConcept, refreshHistory, setConfirmPending, setProcessing])
}

export default useUpdatePending
