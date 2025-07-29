import { aliasesState } from '@/lib/kb/state/aliases'
import { childrenState } from '@/lib/kb/state/children'
import { mediaState } from '@/lib/kb/state/media'
import { nameState } from '@/lib/kb/state/name'
import { rankState } from '@/lib/kb/state/rank'
import { realizationsState } from '@/lib/kb/state/realizations'
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
    ...childrenState(concept, pending),
    ...indexState,
    ...mediaState(concept, pending),
    ...nameState(concept),
    ...rankState(concept, pending),
    ...realizationsState(concept, pending),
    ...valueState(concept, 'author'),
    ...valueState(concept, 'parent'),
  }
}

export { initialConceptState, isStateModified }
