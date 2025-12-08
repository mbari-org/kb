import { isPendingChild } from '@/lib/concept/state/children'
import { isPendingName } from '@/lib/concept/state/name'

import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { PENDING } from '@/lib/constants/pending.js'

import { capitalize, humanTimestamp, isEmpty, pick } from '@/lib/utils'

const hasPending = (pending, field) =>
  field ? !isEmpty(pendingItems(pending, field)) : !isEmpty(pending)

const pendingItems = (pendingConcept, field) => {
  if (!pendingConcept) return []

  return pendingConcept
    ?.filter(pendingItem => pendingItem.field.toLowerCase() === field.toLowerCase())
    .sort((a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp))
}

const pendingChild = (pendingConcept, childName) => {
  return pendingConcept?.find(
    pendingItem =>
      pendingItem.field === HISTORY_FIELD.CHILD &&
      ((pendingItem.action === ACTION.ADD && pendingItem.newValue === childName) ||
        (pendingItem.action === ACTION.DELETE && pendingItem.oldValue === childName))
  )
}

const hasPendingStructure = (pending, conceptName) => {
  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  const hasPendingName = pendingConcept.some(isPendingName)
  const hasPendingParent = pendingParent.some(
    pendingItem =>
      pendingItem.action === ACTION.DELETE &&
      pendingItem.field === HISTORY_FIELD.CHILD &&
      pendingItem.oldValue === conceptName
  )

  const hasPendingChildren = pendingConcept.some(isPendingChild)

  return {
    any: hasPendingName || hasPendingChildren || hasPendingParent,
    children: hasPendingChildren,
    name: hasPendingName,
    parent: hasPendingParent,
  }
}

const pendingActionText = action => {
  const actionText = action !== 'REPLACE' ? action : 'Edit'
  return capitalize(actionText)
}

const pendingInfo = pendingItem => {
  return [
    ['creator', pendingItem.creatorName],
    ['created', humanTimestamp(pendingItem.creationTimestamp)],
  ]
}

const pendingValues = pendingItem =>
  pick(pendingItem, [
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

export {
  hasPending,
  hasPendingStructure,
  pendingActionText,
  pendingChild,
  pendingInfo,
  pendingItems,
  pendingValues,
}

