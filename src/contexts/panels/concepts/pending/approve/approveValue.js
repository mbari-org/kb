import { HISTORY_FIELD } from '@/lib/constants'

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
      throw new Error(`Invalid approval pending value field: ${item.field}`)
  }
}

export default approveValue
