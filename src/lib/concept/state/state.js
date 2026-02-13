import * as aliases from '@/lib/concept/state/aliases'
import * as author from '@/lib/concept/state/author'
import * as children from '@/lib/concept/state/children'
import * as media from '@/lib/concept/state/media'
import * as name from '@/lib/concept/state/name'
import * as parent from '@/lib/concept/state/parent'
import * as rank from '@/lib/concept/state/rank'
import * as realizations from '@/lib/concept/state/realizations'
import * as templates from '@/lib/concept/state/templates'
import * as value from '@/lib/concept/state/value'

import { CONCEPT } from '@/lib/constants'

const indexState = {
  aliasIndex: 0,
  mediaIndex: 0,
  realizationIndex: 0,
}

let modCheckOrder
const getModCheckOrder = () => {
  if (!modCheckOrder) {
    modCheckOrder = [
      value.anyValueModified,
      author.isModified,
      name.isModified,
      parent.isModified,
      aliases.isModified,
      children.isModified,
      rank.isModified,
      realizations.isModified,
      templates.isModified,
      media.isModified,
    ]
  }
  return modCheckOrder
}

const isStateModified = ({ initialState, stagedState }) => {
  if (!initialState || !stagedState) return false

  for (const isModified of getModCheckOrder()) {
    if (isModified(initialState, stagedState)) {
      return true
    }
  }
  return false
}

const initialConceptState = (concept, pendingConcept) => {
  return {
    ...aliases.initialState(concept, pendingConcept),
    ...author.initialState(concept, pendingConcept),
    ...children.initialState(concept, pendingConcept),
    ...indexState,
    ...media.initialState(concept, pendingConcept),
    ...name.initialState(concept, pendingConcept),
    ...parent.initialState(concept, pendingConcept),
    ...rank.initialState(concept, pendingConcept),
    ...realizations.initialState(concept, pendingConcept),
    ...templates.initialState(concept, pendingConcept),
    ...value.initialState(concept, CONCEPT.FIELD.DELETE, false),
  }
}

export { initialConceptState, isStateModified }
