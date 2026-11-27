import { isPendingName } from '@/lib/concept/state/name'
import { isPendingAdd } from '@/lib/model/history'

const pendingRenameOf = (pendingHistory, name) =>
  pendingHistory.find(item => isPendingName(item) && item.oldValue === name)

const withCurrentChildNames = pendingHistory =>
  pendingHistory.map(item => {
    if (!isPendingAdd(item)) return item
    const rename = pendingRenameOf(pendingHistory, item.newValue)
    return { ...item, newValue: rename ? rename.newValue : item.newValue, recordedName: item.newValue }
  })

export { pendingRenameOf, withCurrentChildNames }
