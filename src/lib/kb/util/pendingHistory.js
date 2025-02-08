import { capitalize, isEmpty } from "@/lib/util"

const getFieldPendingHistory = (pendingHistory, field) => {
  const pendingField = capitalize(field)
  return pendingHistory
    ?.filter(pending => pending.field === pendingField)
    .sort(
      (a, b) => new Date(a.creationTimestamp) - new Date(b.creationTimestamp)
    )?.[0]
}

const hasPendingHistory = (pendingHistory, field) => {
  if (field) {
    return !isEmpty(getFieldPendingHistory(pendingHistory, field))
  }
  return !isEmpty(pendingHistory)
}

export { getFieldPendingHistory, hasPendingHistory }
