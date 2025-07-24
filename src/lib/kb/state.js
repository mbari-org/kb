import { aliasesState } from '@/lib/kb/state/aliases'
import { mediaState } from '@/lib/kb/state/media'
import { nameState } from '@/lib/kb/state/name'
import { rankState } from '@/lib/kb/state/rank'
import { realizationsState } from '@/lib/kb/state/realizations'
import { structureState } from '@/lib/kb/state/structure'
import { valueState } from '@/lib/kb/state/value'

import { drop, isJsonEqual } from '@/lib/utils'

const indexState = {
  aliasIndex: 0,
  mediaIndex: 0,
  realizationIndex: 0,
}

const indexStateKeys = Object.keys(indexState)

const isStateModified = ({ initialState, stagedState }) => {
  return !isJsonEqual(drop(initialState, indexStateKeys), drop(stagedState, indexStateKeys))
}

const initialConceptState = (concept, pending) => {
  return {
    ...aliasesState(concept, pending),
    ...valueState(concept, 'author'),
    ...indexState,
    ...mediaState(concept, pending),
    ...nameState(concept),
    ...valueState(concept, 'parent'),
    ...rankState(concept),
    ...realizationsState(concept, pending),
    ...structureState(concept),
  }
}

// export { initialConceptState, isFieldModified, isGroupModified, isItemModified, isStateModified }

export { initialConceptState, isStateModified }
