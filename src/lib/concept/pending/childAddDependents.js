import { isPendingName } from '@/lib/concept/state/name'
import { pendingRenameOf } from '@/lib/concept/pending/pendingNames'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { PENDING } from '@/lib/constants/pending.js'
import { isPendingAdd } from '@/lib/model/history'

const childAddDependents = (add, pendingHistory) => {
  const rename = pendingRenameOf(pendingHistory, add.recordedName)
  return pendingHistory.filter(
    item =>
      (item.field === HISTORY_FIELD.PARENT && item.action === ACTION.EDIT && item.concept === add.newValue) ||
      item === rename
  )
}

const renamedChildAdds = (rename, pendingHistory) =>
  pendingHistory.filter(item => isPendingAdd(item) && item.recordedName === rename.oldValue)

const withNewDependents = (items, dependents) => {
  const selectedIds = new Set(items.map(item => item.id))
  return [...dependents.filter(item => !selectedIds.has(item.id)), ...items]
}

const withDependents = (approval, items, pendingHistory) => {
  switch (approval) {
    case PENDING.APPROVAL.REJECT:
      return withNewDependents(
        items,
        items.filter(isPendingAdd).flatMap(add => childAddDependents(add, pendingHistory))
      )
    case PENDING.APPROVAL.ACCEPT:
      return withNewDependents(
        items,
        items.filter(isPendingName).flatMap(rename => renamedChildAdds(rename, pendingHistory))
      )
    default:
      return items
  }
}

export { childAddDependents, withDependents }
