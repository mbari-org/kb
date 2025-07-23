import { aliasesState } from '@/lib/kb/state/aliases'
import { mediaState } from '@/lib/kb/state/media'
import { rankState } from '@/lib/kb/state/rank'
import { realizationsState } from '@/lib/kb/state/realizations'
import { structureState } from '@/lib/kb/state/structure'

import { isJsonEqual } from '@/lib/utils'

const authorState = concept => {
  const { author } = concept
  return {
    author,
  }
}

const indexState = {
  aliasIndex: 0,
  mediaIndex: 0,
  realizationIndex: 0,
}

// const isFieldModified = (stagedState, initialState, field) => {
//   const editingField = stagedState[field]
//   const initialField = initialState[field]
//   return !isJsonEqual(editingField, initialField)
// }

// const isGroupModified = (stagedState, initialState, group) => {
//   const editingGroup = stagedState[group]
//   const initialGroup = initialState[group]
//   return !isJsonEqual(editingGroup, initialGroup)
// }

// const isItemModified = (stagedState, initialState, field, index) => {
//   const editingItem = stagedState[field][index]
//   const initialItem = initialState[field][index]
//   return editingItem !== initialItem
// }

const isStateModified = ({ initialState, stagedState }) => {
  return !!initialState && !isJsonEqual(initialState, stagedState)
}

const initialConceptState = (concept, pending) => {
  return {
    ...aliasesState(concept, pending),
    ...authorState(concept),
    ...indexState,
    ...mediaState(concept, pending),
    ...rankState(concept),
    ...realizationsState(concept, pending),
    ...structureState(concept),
  }
}

// export { initialConceptState, isFieldModified, isGroupModified, isItemModified, isStateModified }

export { initialConceptState, isStateModified }
