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

const initialConceptState = (concept, pendingConcept) => {
  return {
    ...aliasesState(concept, pendingConcept),
    ...childrenState(concept, pendingConcept),
    ...indexState,
    ...mediaState(concept, pendingConcept),
    ...nameState(concept, pendingConcept),
    ...rankState(concept, pendingConcept),
    ...realizationsState(concept, pendingConcept),
    ...valueState(concept, 'author'),
    ...valueState(concept, 'parent'),
  }
}

export { initialConceptState, isStateModified }
