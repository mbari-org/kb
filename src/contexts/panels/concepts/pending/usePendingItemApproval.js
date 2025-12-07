import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { PENDING } from '@/lib/kb/constants/pending.js'

const { APPROVAL, GROUP } = PENDING

const usePendingItemApproval = item => {
  const { pending } = use(ConceptContext)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  if (!pendingConfirm) {
    return null
  }

  if (pendingConfirm.group === GROUP.ALL) {
    return pendingConfirm.approval
  }

  return pendingConfirm.pendingIds.includes(item.id) ? pendingConfirm.approval : APPROVAL.OTHER
}

export default usePendingItemApproval
