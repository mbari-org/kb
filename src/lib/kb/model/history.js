import { humanTimestamp, isEmpty, pick } from '@/lib/util'

const fieldPending = (pendingHistory, field) =>
  pendingHistory
    ?.filter(pending => pending.field.toLowerCase() === field.toLowerCase())
    .sort((a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp))

const hasPending = (pendingHistory, field) =>
  field ? !isEmpty(fieldPending(pendingHistory, field)) : !isEmpty(pendingHistory)

const isPendingChild = (pendingHistory, childName) =>
  pendingHistory.some(
    pending =>
      pending.field === 'Concept.child' &&
      ((pending.action === 'ADD' && pending.newValue === childName) ||
        (pending.action === 'DELETE' && pending.oldValue === childName))
  )

const pendingInfo = pending => {
  return [
    ['creator', pending.creatorName],
    ['created', humanTimestamp(pending.creationTimestamp)],
  ]
}

const pendingValues = pendingHistory =>
  pick(pendingHistory, [
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

export { fieldPending, hasPending, isPendingChild, pendingInfo, pendingValues }
