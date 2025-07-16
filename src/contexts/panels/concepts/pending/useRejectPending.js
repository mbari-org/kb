import { use, useCallback } from 'react'

import PanelDataContext from '@/contexts/panelData/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { SELECTED } from '@/lib/constants'

const useRejectPending = () => {
  const { concept, refreshConcept } = use(ConceptContext)
  const { refreshData: refreshPanelData } = use(PanelDataContext)
  const { updateSelected } = use(SelectedContext)
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

  const isAddChild = pendingItems =>
    pendingItems.length === 1 &&
    pendingItems[0].action === 'ADD' &&
    pendingItems[0].field === 'Concept.child'

  const pendingRenameConcept = pendingItems =>
    pendingItems.find(item => item.action === 'REPLACE' && item.field === 'ConceptName')

  return useCallback(
    async (pendingItems, approvalUpdates) => {
      const { pendingHistory } = await refreshPanelData('pendingHistory')

      if (isAddChild(pendingItems)) {
        updateSelected({
          [SELECTED.CONCEPT]: concept.parent,
          [SELECTED.REMOVE_CONCEPT]: concept.name,
        })
        return
      }

      const pendingRename = pendingRenameConcept(pendingItems)
      if (pendingRename) {
        updateSelected({
          [SELECTED.CONCEPT]: pendingRename.value,
        })
        return
      }

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
    },
    [
      concept,
      fieldChanged,
      refreshConcept,
      refreshPanelData,
      refreshTaxonomyConcept,
      updateSelected,
    ]
  )
}

export default useRejectPending
