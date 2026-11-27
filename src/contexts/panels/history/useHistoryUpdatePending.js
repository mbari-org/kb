import { use, useCallback } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import useProcessPendingDeps from '@/contexts/common/useProcessPendingDeps'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'

import { performReassignments, relatedDataCounts } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import { implicitDeleteRejects, withDependents } from '@/lib/concept/pending/childAddDependents'
import orderPendingBatch from '@/lib/concept/pending/orderPendingBatch'
import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { isRenameRejectBlocked } from '@/lib/concept/pending/renameRejectBlocked'
import { isPendingName } from '@/lib/concept/state/name'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const useHistoryUpdatePending = () => {
  const { showBoundary } = useErrorBoundary()
  const deps = useProcessPendingDeps()
  const { pendingHistory } = use(PanelDataContext)

  return useCallback(
    async ({ approval, item, nameChangeType }) => {
      const implicitRejects = implicitDeleteRejects(approval, [item], pendingHistory)
      try {
        if (implicitRejects.length > 0) {
          await processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps, items: implicitRejects })
        }
        await processPendingApproval({
          approval,
          deps,
          items: orderPendingBatch(approval, withDependents(approval, [item], pendingHistory)),
        })
      } catch (error) {
        if (isRenameRejectBlocked(error)) throw error
        showBoundary(error)
        return false
      }

      if (approval === PENDING.APPROVAL.ACCEPT && nameChangeType === REASSIGN && isPendingName(item)) {
        const counts = await relatedDataCounts({
          apiFns: deps.apiFns,
          concept: { name: item.newValue },
          getReferences: deps.getReferences,
          renamedFrom: item.oldValue,
        })
        await performReassignments(item.oldValue, item.newValue, counts)
      }

      return true
    },
    [deps, pendingHistory, showBoundary]
  )
}

export default useHistoryUpdatePending
