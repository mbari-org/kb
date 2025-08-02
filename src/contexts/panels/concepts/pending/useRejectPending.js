import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION, SELECTED } from '@/lib/constants'

const useRejectPending = () => {
  const { concept, resetConcept } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { refreshConcept: refreshTaxonomyConcept } = use(TaxonomyContext)

  const fieldChanged = useCallback(approvalUpdate => {
    switch (approvalUpdate.field) {
      case 'ConceptName':
        if (approvalUpdate.action === ACTION.ADD) return 'aliases'
        return 'name'

      default:
        return null
    }
  }, [])

  const isAddChild = pendingItems =>
    pendingItems.length === 1 &&
    pendingItems[0].action === ACTION.ADD &&
    pendingItems[0].field === 'Concept.child'

  const pendingRenameConcept = pendingItems =>
    pendingItems.find(item => item.action === 'REPLACE' && item.field === 'ConceptName')

  return useCallback(
    async (pendingItems, approvalUpdates) => {
      if (isAddChild(pendingItems)) {
        // updateSelected({
        //   [SELECTED.REMOVE_CONCEPT]: concept.name,
        // })
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

      const { concept: updatedConcept } = await refreshTaxonomyConcept(concept, {
        forceLoad: true,
        hasUpdated: field => updatedFields.includes(field),
      })
      resetConcept(updatedConcept)
    },
    [concept, fieldChanged, refreshTaxonomyConcept, resetConcept, updateSelected]
  )
}

export default useRejectPending
