import { HISTORY_FIELD } from '@/lib/constants/constants'
import { createError } from '@/lib/errors'

import approveAlias from '@/contexts/panels/concepts/pending/approve/approveAlias'
import approveChild from '@/contexts/panels/concepts/pending/approve/approveChild'
import approveMedia from '@/contexts/panels/concepts/pending/approve/approveMedia'
import approveRank from '@/contexts/panels/concepts/pending/approve/approveRank'
import approveRealization from '@/contexts/panels/concepts/pending/approve/approveRealization'
import approveValue from '@/contexts/panels/concepts/pending/approve/approveValue'

const applyApproval = (concept, pendingItem, allItems) => {
  switch (pendingItem.field) {
    case HISTORY_FIELD.ALIAS:
      return approveAlias(concept, pendingItem, allItems)

    case HISTORY_FIELD.CHILD:
      return approveChild(concept, pendingItem, allItems)

    case HISTORY_FIELD.MEDIA:
      return approveMedia(concept, pendingItem, allItems)

    case HISTORY_FIELD.NAME:
      return approveValue(concept, pendingItem, allItems)

    case HISTORY_FIELD.PARENT:
      return approveValue(concept, pendingItem, allItems)

    case HISTORY_FIELD.RANK:
      return approveRank(concept, pendingItem, allItems)

    case HISTORY_FIELD.REALIZATION:
      return approveRealization(concept, pendingItem, allItems)

    default:
      throw createError(
        'Invalid Pending Field',
        `Cannot approve pending change with invalid field: ${pendingItem.field}`,
        { pendingItem }
      )
  }
}

export const applyApprovals = (concept, items) => {
  items.forEach(item => applyApproval(concept, item, items))
  return concept
}

export default applyApprovals
