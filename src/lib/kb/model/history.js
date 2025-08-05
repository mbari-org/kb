import { isPendingName } from '@/lib/kb/state/name'

import { ACTION, PENDING } from '@/lib/constants'

import { humanTimestamp, isEmpty, pick } from '@/lib/utils'

const hasPending = (pending, field) =>
  field ? !isEmpty(fieldPending(pending, field)) : !isEmpty(pending)

const fieldPending = (pendingConcept, field) => {
  if (!pendingConcept) return []

  return pendingConcept
    ?.filter(pendingItem => pendingItem.field.toLowerCase() === field.toLowerCase())
    .sort((a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp))
}

const pendingChild = (pendingConcept, childName) => {
  return pendingConcept?.find(
    pendingItem =>
      pendingItem.field === 'Concept.child' &&
      ((pendingItem.action === ACTION.ADD && pendingItem.newValue === childName) ||
        (pendingItem.action === ACTION.DELETE && pendingItem.oldValue === childName))
  )
}

const hasPendingStructure = pending => {
  const pendingConcept = pending(PENDING.DATA.CONCEPT)
  const pendingParent = pending(PENDING.DATA.PARENT)

  const pendingNames = fieldPending(pendingConcept, 'ConceptName')
  const hasPendingName = pendingNames.some(isPendingName)
  const hasPendingParent = !isEmpty(pendingParent)

  const hasPendingChildren = pendingConcept.some(
    pendingItem => pendingItem.field === 'Concept.child'
  )

  return {
    any: hasPendingName || hasPendingChildren || hasPendingParent,
    children: hasPendingChildren,
    name: hasPendingName,
    parent: hasPendingParent,
  }
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

export { fieldPending, hasPending, hasPendingStructure, pendingChild, pendingInfo, pendingValues }
