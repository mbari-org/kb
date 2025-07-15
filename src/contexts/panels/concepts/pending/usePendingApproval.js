import { use, useCallback } from 'react'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { updatePendingHistoryItem } from '@/lib/api/history'

import { PENDING } from '@/lib/constants'

import { capitalize } from '@/lib/utils'

const usePendingApproval = () => {
  const { concept, refreshConcept } = use(ConceptContext)
  const { setProcessing } = use(ConceptModalContext)
  const { apiFns } = use(ConfigContext)
  const { refreshData: refreshPanelData } = use(PanelDataContext)
  const { refreshConcept: refreshTaxonomyConcept } = use(TaxonomyContext)

  const fieldChanged = useCallback(approvalUpdate => {
    switch (approvalUpdate.field) {
      case 'ConceptName':
        if (approvalUpdate.action === 'ADD') return 'aliases'
        return 'name'

      default:
        return null
    }
  }, [])

  return useCallback(
    async confirmPending => {
      const { approval, pendingIds } = confirmPending
      setProcessing(`${capitalize(approval)} pending changes...`)
      const approvalUpdates = await Promise.all(
        pendingIds.map(pendingId =>
          apiFns.apiPayload(updatePendingHistoryItem, [approval, pendingId])
        )
      )
      const { pendingHistory } = await refreshPanelData('pendingHistory')

      if (approval === PENDING.APPROVAL.REJECT) {
        const updatedFields = approvalUpdates.reduce((acc, approvalUpdate) => {
          const field = fieldChanged(approvalUpdate)
          if (field) acc.push(field)
          return acc
        }, [])

        const updatedConcept = await refreshTaxonomyConcept(concept, {
          forceLoad: true,
          hasUpdated: field => updatedFields.includes(field),
        })
        refreshConcept(updatedConcept, pendingHistory)
      } else {
        refreshConcept(concept, pendingHistory)
      }

      setProcessing(false)
    },
    [apiFns, concept, refreshConcept, refreshPanelData, refreshTaxonomyConcept, setProcessing]
  )
}

export default usePendingApproval
