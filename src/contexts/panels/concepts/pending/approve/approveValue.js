import { HISTORY_FIELD } from '@/lib/constants'
import { createError } from '@/lib/errors'

const approveValue = (concept, item) => {
  switch (item.field) {
    case HISTORY_FIELD.NAME: {
      concept.name = item.newValue
      break
    }

    case HISTORY_FIELD.PARENT: {
      concept.parent = item.newValue
      break
    }

    default:
      throw createError(
        'Invalid Pending Field',
        `Cannot approve change with invalid field: ${item.field}`,
        { item }
      )
  }
}

export default approveValue
