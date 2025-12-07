import { HISTORY_FIELD } from '@/lib/kb/constants/historyField.js'
import { CONCEPT_STATE } from '@/lib/kb/constants/conceptState.js'

const isPendingAuthor = pendingItem =>
  pendingItem.field === HISTORY_FIELD.NAME && pendingItem.action === CONCEPT_STATE.AUTHOR

// CxNote the server does not support a pending author field. This implementation is to normalize
// the field to that of the other staged state fields.

const authorState = (concept, pendingConcept) => {
  const { author } = concept

  const stateAuthor = {
    action: CONCEPT_STATE.NO_ACTION,
    value: author || '',
  }

  const pendingAuthor = pendingConcept?.find?.(isPendingAuthor)
  if (pendingAuthor) {
    return {
      author: {
        action: 'Edit Pending',
        historyId: pendingAuthor.id,
        value: pendingAuthor.newValue,
      },
    }
  }

  return { author: stateAuthor }
}

const editAuthor = (state, update) => {
  const { value } = update
  return {
    ...state,
    author: {
      ...state.author,
      action: CONCEPT_STATE.AUTHOR,
      value,
    },
  }
}

const resetAuthor = (state, update) => {
  return {
    ...state,
    author: update.author,
  }
}

export { authorState, editAuthor, resetAuthor }
