import { HISTORY_FIELD } from '@/lib/constants/historyField.js'
import { CONCEPT } from '@/lib/constants.js'

const rejectValue = (concept, pendingItem) => {
  let field
  switch (pendingItem.field) {
    case HISTORY_FIELD.NAME:
      field = CONCEPT.FIELD.NAME
      break

    case HISTORY_FIELD.PARENT:
      field = CONCEPT.FIELD.PARENT
      break

    default:
      throw new Error(`Invalid reject pending value field: ${pendingItem.field}`)
  }

  concept[field] = pendingItem.oldValue
}

export default rejectValue
