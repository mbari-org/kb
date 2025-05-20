import { humanTimestamp, isEmpty, pick } from '@/lib/util'

const fieldPending = (pendingHistory, field) => {
  return pendingHistory
    ?.filter(pending => pending.field.toLowerCase() === field.toLowerCase())
    .sort((a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp))
}

const hasPending = (pendingHistory, field) => {
  if (field) {
    return !isEmpty(fieldPending(pendingHistory, field))
  }
  return !isEmpty(pendingHistory)
}

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

export { fieldPending, hasPending, pendingInfo, pendingValues }
