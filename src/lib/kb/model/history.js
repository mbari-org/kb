import { capitalize, isEmpty, pick } from '@/lib/util'

const fieldPendingHistory = (pendingHistory, field) => {
  const pendingField = capitalize(field)
  return pendingHistory
    ?.filter(pending => pending.field === pendingField)
    .sort((a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp))
}

const hasPendingHistory = (pendingHistory, field) => {
  if (field) {
    return !isEmpty(fieldPendingHistory(pendingHistory, field))
  }
  return !isEmpty(pendingHistory)
}

const pendingValues = pendingHistory =>
  pick(pendingHistory, [
    ['oldValue', 'before'],
    ['newValue', 'after'],
    ['creatorName', 'user'],
    ['creationTimestamp', 'created'],
  ])

export { fieldPendingHistory, hasPendingHistory, pendingValues }
