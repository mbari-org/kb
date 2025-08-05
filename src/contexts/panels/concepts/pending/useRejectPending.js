import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION, SELECTED } from '@/lib/constants'

const useRejectPending = () => {
  const { concept, resetConcept } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const {
    closestConcept,
    refreshConcept: refreshTaxonomyConcept,
    removeConcept,
  } = use(TaxonomyContext)

  const fieldChanged = useCallback(approvalUpdate => {
    switch (approvalUpdate.field) {
      case 'ConceptName':
        if (approvalUpdate.action === ACTION.ADD) return 'aliases'
        return 'name'

      default:
        return null
    }
  }, [])

  const isAddChild = rejectedItems =>
    rejectedItems.length === 1 &&
    rejectedItems[0].action === ACTION.ADD &&
    rejectedItems[0].field === 'Concept.child'

  return useCallback(
    async (rejectedItems, approvalUpdates) => {
      if (isAddChild(rejectedItems)) {
        const gotoConcept = closestConcept(concept, rejectedItems[0].value)
        removeConcept(concept)
        updateSelected({
          [SELECTED.CONCEPT]: gotoConcept.name,
        })

        return
      }

      const rejectedRename = rejectedItems.find(
        item => item.action === 'REPLACE' && item.field === 'ConceptName'
      )
      if (rejectedRename) {
        updateSelected({
          [SELECTED.CONCEPT]: rejectedRename.value,
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
    [
      concept,
      closestConcept,
      fieldChanged,
      removeConcept,
      refreshTaxonomyConcept,
      resetConcept,
      updateSelected,
    ]
  )
}

export default useRejectPending
