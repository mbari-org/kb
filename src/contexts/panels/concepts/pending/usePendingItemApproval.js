import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import { PENDING } from '@/lib/constants'

const { OTHER } = PENDING.APPROVAL

const usePendingItemApproval = item => {
  const { pending } = use(ConceptContext)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  if (!pendingConfirm) {
    return null
  }

  return pendingConfirm.pendingIds.includes(item.id) ? pendingConfirm.approval : OTHER
}

export default usePendingItemApproval
