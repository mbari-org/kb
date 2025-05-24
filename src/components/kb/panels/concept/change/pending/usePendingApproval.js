import { use, useMemo } from 'react'

import ConceptContext from '@/contexts/concept/ConceptContext'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

const usePendingApproval = predicate => {
  const { confirmPending } = use(ConceptContext)

  const pendingApproval = useMemo(() => {
    if (!confirmPending) {
      return null
    }

    if (confirmPending?.change === PENDING.GROUP.ALL) {
      return confirmPending.approval
    }

    if (predicate(confirmPending.pending)) {
      return confirmPending.approval
    }

    return OTHER
  }, [confirmPending, predicate])

  return pendingApproval
}

export default usePendingApproval
