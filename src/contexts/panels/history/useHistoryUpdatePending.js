import { useCallback } from 'react'

import useProcessPendingDeps from '@/contexts/common/useProcessPendingDeps'

import processPendingApproval from '@/lib/concept/pending/processPendingApproval'

const useHistoryUpdatePending = () => {
  const deps = useProcessPendingDeps()

  return useCallback(
    async ({ approval, item }) => {
      await processPendingApproval({ approval, deps, items: [item] })

      return true
    },
    [deps]
  )
}

export default useHistoryUpdatePending
