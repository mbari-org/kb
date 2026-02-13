import { aliasesState, isModified as isAliasesModified } from '@/lib/concept/state/aliases'
import { authorState, isModified as isAuthorModified } from '@/lib/concept/state/author'
import { childrenState, isModified as isChildrenModified } from '@/lib/concept/state/children'
import { isModified as isMediaModified, mediaState } from '@/lib/concept/state/media'
import { isModified as isNameModified, nameState } from '@/lib/concept/state/name'
import { isModified as isParentModified, parentState } from '@/lib/concept/state/parent'
import { isModified as isRankModified, rankState } from '@/lib/concept/state/rank'
import {
  isModified as isRealizationsModified,
  realizationsState,
} from '@/lib/concept/state/realizations'
import { isModified as isTemplatesModified, templatesState } from '@/lib/concept/state/templates'
import { anyValueModified, valueState } from '@/lib/concept/state/value'

import { CONCEPT } from '@/lib/constants'

const indexState = {
  aliasIndex: 0,
  mediaIndex: 0,
  realizationIndex: 0,
}

const MOD_CHECK_ORDER = [
  anyValueModified,
  isAuthorModified,
  isNameModified,
  isParentModified,
  isAliasesModified,
  isChildrenModified,
  isRankModified,
  isRealizationsModified,
  isTemplatesModified,
  isMediaModified,
]

const isStateModified = ({ initialState, stagedState }) => {
  if (!initialState || !stagedState) return false

  for (const isModified of MOD_CHECK_ORDER) {
    if (isModified(initialState, stagedState)) {
      return true
    }
  }
  return false
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
