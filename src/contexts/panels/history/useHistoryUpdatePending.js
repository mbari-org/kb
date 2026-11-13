import { useCallback } from 'react'

import useProcessPendingDeps from '@/contexts/common/useProcessPendingDeps'

import { performReassignments, relatedDataCounts } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'
import { isPendingName } from '@/lib/concept/state/name'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const { REASSIGN } = CONFIG.CONCEPT.CHANGE_NAME

const useHistoryUpdatePending = () => {
  const deps = useProcessPendingDeps()

  return useCallback(
    async ({ approval, item, nameChangeType }) => {
      await processPendingApproval({ approval, deps, items: [item] })

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
    [deps]
  )
}

export default useHistoryUpdatePending
