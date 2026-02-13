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

const stateField = module => ({
  initialState: (concept, pendingConcept) =>
    module.initialState(concept, pendingConcept),
  isModified: (initialState, stagedState) =>
    module.isModified(initialState, stagedState),
})

const STATE_FIELDS = [
  {
    initialState: (concept, _pendingConcept) =>
      value.initialState(concept, CONCEPT.FIELD.DELETE, false),
    isModified: (initialState, stagedState) =>
      value.isModified(initialState, stagedState),
  },
  stateField(author),
  stateField(name),
  stateField(parent),
  stateField(aliases),
  stateField(children),
  stateField(rank),
  stateField(realizations),
  stateField(templates),
  stateField(media),
]

const isStateModified = ({ initialState, stagedState }) => {
  if (!initialState || !stagedState) return false
  return STATE_FIELDS.some(({ isModified }) => isModified(initialState, stagedState))
}

const initialConceptState = (concept, pendingConcept) => {
  const state = { ...indexState }
  for (const { initialState } of STATE_FIELDS) {
    Object.assign(state, initialState(concept, pendingConcept))
  }
  return state
}

export { initialConceptState, isStateModified }
