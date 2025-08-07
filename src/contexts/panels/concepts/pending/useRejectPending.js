import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION, HISTORY_FIELD, SELECTED } from '@/lib/constants'

const useRejectPending = () => {
  const { concept, resetConcept } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { closestConcept, refreshConcept, removeConcept } = use(TaxonomyContext)

  const isAddChild = rejectingItems =>
    rejectingItems.length === 1 &&
    rejectingItems[0].action === ACTION.ADD &&
    rejectingItems[0].field === HISTORY_FIELD.CHILD

  return useCallback(
    async rejectingItems => {
      if (isAddChild(rejectingItems)) {
        const gotoConcept = closestConcept(concept, rejectingItems[0].value)
        removeConcept(concept.name)
        updateSelected({
          [SELECTED.CONCEPT]: gotoConcept.name,
        })
        // a rejected child will always be the only item
        return
      }

      const { concept: freshConcept } = await refreshConcept(concept)

      const rejectedChildren = rejectingItems.filter(
        item => item.action === ACTION.ADD && item.field === HISTORY_FIELD.CHILD
      )
      if (rejectedChildren.length > 0) {
        throw new Error('Not implemented: remove rejected children', {
          cause: rejectedChildren,
        })
      }

      const rejectedRename = rejectingItems.find(
        item =>
          item.field === HISTORY_FIELD.NAME &&
          item.action === ACTION.EDIT &&
          item.newValue !== concept.name
      )
      if (rejectedRename) {
        updateSelected({
          [SELECTED.CONCEPT]: rejectedRename.oldValue,
        })
      } else {
        await resetConcept(freshConcept)
      }

      return freshConcept
    },
    [concept, closestConcept, refreshConcept, removeConcept, resetConcept, updateSelected]
  )
}

export default useRejectPending
