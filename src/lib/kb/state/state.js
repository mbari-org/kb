import { aliasesState } from '@/lib/kb/state/aliases'
import { authorState } from '@/lib/kb/state/author'
import { childrenState } from '@/lib/kb/state/children'
import { mediaState } from '@/lib/kb/state/media'
import { nameState } from '@/lib/kb/state/name'
import { parentState } from '@/lib/kb/state/parent'
import { rankState } from '@/lib/kb/state/rank'
import { realizationsState } from '@/lib/kb/state/realizations'
import { templatesState } from '@/lib/kb/state/templates'
import { valueState } from '@/lib/kb/state/value'

import { CONCEPT_FIELD } from '@/lib/constants'

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
    ...valueState(concept, CONCEPT_FIELD.DELETE, false),
  }
}

export { initialConceptState, isStateModified }
