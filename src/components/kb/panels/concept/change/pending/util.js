import { fieldPendingHistory } from '@/lib/kb/model/history'
import { humanTimestamp } from '@/lib/util'

const pendingChange = pendingHistory => field => fieldPendingHistory(pendingHistory, field)

const pendingValues = pending => {
  return [
    ['creator', pending.creatorName],
    ['created', humanTimestamp(pending.creationTimestamp)],
  ]
}

export { pendingChange, pendingValues }
