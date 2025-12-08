import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { PENDING } from '@/lib/constants/pending.js'

const { OTHER } = PENDING.APPROVAL

const usePendingGroupApproval = group => {
  const { pending } = use(ConceptContext)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  if (!pendingConfirm) {
    return null
  }

  if (pendingConfirm.group === group || pendingConfirm.group === PENDING.GROUP.ALL) {
    return pendingConfirm.approval
  }

  return OTHER
}

export default usePendingGroupApproval
