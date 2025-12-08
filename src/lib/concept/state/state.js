import { aliasesState } from '@/lib/concept/state/aliases'
import { authorState } from '@/lib/concept/state/author'
import { childrenState } from '@/lib/concept/state/children'
import { mediaState } from '@/lib/concept/state/media'
import { nameState } from '@/lib/concept/state/name'
import { parentState } from '@/lib/concept/state/parent'
import { rankState } from '@/lib/concept/state/rank'
import { realizationsState } from '@/lib/concept/state/realizations'
import { templatesState } from '@/lib/concept/state/templates'
import { valueState } from '@/lib/concept/state/value'

import { CONCEPT } from '@/lib/constants'

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
    ...authorState(concept, pendingConcept),
    ...childrenState(concept, pendingConcept),
    ...indexState,
    ...mediaState(concept, pendingConcept),
    ...nameState(concept, pendingConcept),
    ...parentState(concept, pendingConcept),
    ...rankState(concept, pendingConcept),
    ...realizationsState(concept, pendingConcept),
    ...templatesState(concept, pendingConcept),
    ...valueState(concept, CONCEPT.FIELD.DELETE, false),
  }
}

export { initialConceptState, isStateModified }
