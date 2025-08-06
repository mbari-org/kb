import { use, useCallback } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import { ACTION, HISTORY_FIELD, SELECTED } from '@/lib/constants'

const conceptFieldForItem = (item, concept) => {
  // HISTORY_FIELD NAME and ALIAS are the same. Check for name before checking for alias.
  if (
    item.field === HISTORY_FIELD.NAME &&
    item.action === ACTION.EDIT &&
    item.newValue !== concept.name
  )
    return 'name'

  if (item.field === HISTORY_FIELD.ALIAS) return 'aliases'
  if (item.field === HISTORY_FIELD.CHILD) return 'children'
  if (item.field === HISTORY_FIELD.MEDIA) return 'media'

  if (item.field === HISTORY_FIELD.PARENT) return 'parent'
}

const useRejectPending = () => {
  const { concept } = use(ConceptContext)
  const { updateSelected } = use(SelectedContext)
  const { closestConcept, refreshConcept, removeConcept } = use(TaxonomyContext)

  const isAddChild = rejectingItems =>
    rejectingItems.length === 1 &&
    rejectingItems[0].action === ACTION.ADD &&
    rejectingItems[0].field === 'Concept.child'

  return useCallback(
    async rejectingItems => {
      if (isAddChild(rejectingItems)) {
        const gotoConcept = closestConcept(concept, rejectingItems[0].value)
        removeConcept(concept.name)
        updateSelected({
          [SELECTED.CONCEPT]: gotoConcept.name,
        })
        // a rejected child will always be the only item, so
        return
      }

      rejectingItems
        .filter(item => item.action === ACTION.ADD && item.field === 'Concept.child')
        .forEach(rejectedChild => {
          removeConcept(rejectedChild.newValue)
        })

      const updatedFields = rejectingItems.map(item => conceptFieldForItem(item, concept))
      console.log('updatedFields:', updatedFields)

      const { concept: updatedConcept } = await refreshConcept(concept, {
        forceLoad: true,
        hasUpdated: field => updatedFields.includes(field),
      })

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
      }

      return updatedConcept
    },
    [concept, closestConcept, refreshConcept, removeConcept, updateSelected]
  )
}

export default useRejectPending
