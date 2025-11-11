import { HISTORY_FIELD } from '@/lib/constants/constants'
import { createError } from '@/lib/errors'

import rejectAlias from '@/contexts/panels/concepts/pending/reject/rejectAlias'
import rejectChild from '@/contexts/panels/concepts/pending/reject/rejectChild'
import rejectMedia from '@/contexts/panels/concepts/pending/reject/rejectMedia'
import rejectRank from '@/contexts/panels/concepts/pending/reject/rejectRank'
import rejectRealization from '@/contexts/panels/concepts/pending/reject/rejectRealization'
import rejectValue from '@/contexts/panels/concepts/pending/reject/rejectValue'

const applyReject = (concept, pendingItem, allItems) => {
  switch (pendingItem.field) {
    case HISTORY_FIELD.ALIAS:
      return rejectAlias(concept, pendingItem, allItems)

    case HISTORY_FIELD.CHILD:
      return rejectChild(concept, pendingItem, allItems)

    case HISTORY_FIELD.MEDIA:
      return rejectMedia(concept, pendingItem, allItems)

    case HISTORY_FIELD.NAME:
      return rejectValue(concept, pendingItem, allItems)

    case HISTORY_FIELD.PARENT:
      return rejectValue(concept, pendingItem, allItems)

    case HISTORY_FIELD.RANK:
      return rejectRank(concept, pendingItem, allItems)

    case HISTORY_FIELD.REALIZATION:
      return rejectRealization(concept, pendingItem, allItems)

    default:
      throw createError(
        'Invalid Pending Field',
        `Cannot reject pending change with invalid field: ${pendingItem.field}`,
        { pendingItem }
      )
  }
}

export const applyRejects = (concept, items) => {
  items.forEach(item => applyReject(concept, item, items))
  return concept
}

export default applyRejects
