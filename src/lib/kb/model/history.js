import { capitalize, isEmpty } from '@/lib/util'

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

export { fieldPendingHistory, hasPendingHistory }
