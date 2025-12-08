import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import group from '@/config/text/panels/concepts/modals/group.json'
import { PENDING } from '@/lib/constants/pending.js'

const { APPROVAL } = PENDING

const usePendingItemApproval = item => {
  const { pending } = use(ConceptContext)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  if (!pendingConfirm) {
    return null
  }

  if (pendingConfirm.group === group.ALL) {
    return pendingConfirm.approval
  }

  return pendingConfirm.pendingIds.includes(item.id) ? pendingConfirm.approval : APPROVAL.OTHER
}

export default usePendingItemApproval
