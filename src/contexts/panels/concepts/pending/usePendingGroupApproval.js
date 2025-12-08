import { use } from 'react'

import ConceptContext from '@/contexts/panels/concepts/ConceptContext'

import group from '@/config/text/panels/concepts/modals/group.json'
import { PENDING } from '@/lib/constants/pending.js'

const { OTHER } = PENDING.APPROVAL

const usePendingGroupApproval = groupValue => {
  const { pending } = use(ConceptContext)
  const pendingConfirm = pending(PENDING.DATA.CONFIRM)

  if (!pendingConfirm) {
    return null
  }

  if (pendingConfirm.group === groupValue || pendingConfirm.group === group.ALL) {
    return pendingConfirm.approval
  }

  return OTHER
}

export default usePendingGroupApproval
