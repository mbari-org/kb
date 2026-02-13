import { isJsonEqual } from '@/lib/utils'

const generalStateUpdates = (field, initial, staged) =>
  !isJsonEqual(initial?.[field], staged?.[field])
    ? { [field]: { initial: initial[field], staged: staged[field] } }
    : {}

import { isStateModified } from '@/lib/concept/state/state'
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

const INDEX_FIELDS = ['aliasIndex', 'mediaIndex', 'realizationIndex']

const stateUpdates = (initialState, stagedState) => {
  if (!isStateModified({ initialState, stagedState })) return {}

  const moduleUpdates = {
    ...aliases.stateUpdates(initialState, stagedState),
    ...author.stateUpdates(initialState, stagedState),
    ...children.stateUpdates(initialState, stagedState),
    ...media.stateUpdates(initialState, stagedState),
    ...name.stateUpdates(initialState, stagedState),
    ...parent.stateUpdates(initialState, stagedState),
    ...rank.stateUpdates(initialState, stagedState),
    ...realizations.stateUpdates(initialState, stagedState),
    ...templates.stateUpdates(initialState, stagedState),
    ...value.stateUpdates(initialState, stagedState),
  }

  const indexUpdates = INDEX_FIELDS.reduce(
    (acc, field) => ({ ...acc, ...generalStateUpdates(field, initialState, stagedState) }),
    {}
  )

  return { ...moduleUpdates, ...indexUpdates }
}

const stateUpdatesInfo = (initialState, stagedState) => {
  const forceLoad = false
  const updates = stateUpdates(initialState, stagedState)
  const hasUpdated = field => updates[field] !== undefined
  const initialValue = field => updates[field]?.initial
  const updatedValue = field => updates[field]?.staged
  return { forceLoad, hasUpdated, initialValue, updatedValue }
}

export { generalStateUpdates, stateUpdates, stateUpdatesInfo }
