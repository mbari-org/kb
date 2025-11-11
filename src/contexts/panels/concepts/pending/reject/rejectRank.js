import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { pendingChange as rankPendingChange } from '@/lib/kb/state/rank'

const rejectRank = (concept, pendingItem, rejecting) => {
  const change = rankPendingChange([{ field: HISTORY_FIELD.RANK, ...pendingItem }, ...rejecting])
  if (!change) return

  concept.rankLevel = change.old.level
  concept.rankName = change.old.name
}

export default rejectRank
