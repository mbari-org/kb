import { humanTimestamp, isEmpty, pick } from '@/lib/utils'

const fieldPending = (pending, field) =>
  pending
    ?.filter(pending => pending.field.toLowerCase() === field.toLowerCase())
    .sort((a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp))

const hasPending = (pending, field) =>
  field ? !isEmpty(fieldPending(pending, field)) : !isEmpty(pending)

const pendingChild = (pending, childName) =>
  pending.find(
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

const pendingValues = pending =>
  pick(pending, [
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

export { fieldPending, hasPending, pendingChild, pendingInfo, pendingValues }
