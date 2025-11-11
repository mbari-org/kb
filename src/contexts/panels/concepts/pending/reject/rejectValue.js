import { CONCEPT_FIELD, HISTORY_FIELD } from '@/lib/constants/constants'

const rejectValue = (concept, pendingItem) => {
  let field
  switch (pendingItem.field) {
    case HISTORY_FIELD.NAME:
      field = CONCEPT_FIELD.NAME
      break

    case HISTORY_FIELD.PARENT:
      field = CONCEPT_FIELD.PARENT
      break

    default:
      throw new Error(`Invalid reject pending value field: ${pendingItem.field}`)
  }

  concept[field] = pendingItem.oldValue
}

export default rejectValue
