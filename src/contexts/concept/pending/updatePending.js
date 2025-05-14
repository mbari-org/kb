import { updatePendingHistory } from '@/lib/kb/api/history'
import { fieldPendingHistory } from '@/lib/kb/model/history'

import { PENDING } from '@/lib/constants'
const { ALL, ALIASES } = PENDING

const updateId = async (config, approval, id) => {
  updatePendingHistory(config, approval, id)
}

const updateIds = async (config, approval, ids) =>
  Promise.all(ids.map(id => updatePendingHistory(config, approval, id)))

const updatePending = async ({ config, confirmPending, pendingHistory }) => {
  switch (confirmPending.pending) {
    case ALL: {
      const pendingIds = pendingHistory.map(pending => pending.id)
      await updateIds(config, confirmPending.approval, pendingIds)
      break
    }

    case ALIASES: {
      const pendingIds = fieldPendingHistory(pendingHistory, 'ConceptName').map(
        pending => pending.id
      )
      await updateIds(config, confirmPending.approval, pendingIds)
      break
    }

    default:
      await updateId(config, confirmPending.approval, confirmPending.pending)
      break
  }
}

export default updatePending
