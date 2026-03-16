import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as value from '@/lib/concept/state/value'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { MEDIA_ITEM } = CONCEPT_STATE

const baseStagedState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

const initialState = { ...baseStagedState }

describe('conceptStateReducer value', () => {
  it('verifies isModified when deleteConcept differs', () => {
    const stagedState = {
      ...baseStagedState,
      deleteConcept: true,
    }

    expect(value.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies isModified is false when deleteConcept is same', () => {
    expect(value.isModified(initialState, initialState)).toBe(false)
    expect(isStateModified({ initialState, stagedState: initialState })).toBe(false)

    const bothTrue = { ...baseStagedState, deleteConcept: true }
    expect(value.isModified(bothTrue, bothTrue)).toBe(false)
  })

  it('verifies stateUpdates from value matches when deleteConcept modified', () => {
    const stagedState = {
      ...baseStagedState,
      deleteConcept: true,
    }

    const valueStateUpdates = value.stateUpdates(initialState, stagedState)
    expect(valueStateUpdates).toEqual({
      deleteConcept: {
        initial: false,
        staged: true,
      },
    })

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.deleteConcept).toBeDefined()
    expect(fullStateUpdates.deleteConcept.initial).toBe(false)
    expect(fullStateUpdates.deleteConcept.staged).toBe(true)
  })

  it('verifies stateUpdates returns empty when deleteConcept is same', () => {
    const valueStateUpdates = value.stateUpdates(initialState, initialState)
    expect(valueStateUpdates).toEqual({})
  })

  it('MEDIA_ITEM.INDEX updates mediaIndex via editValue', () => {
    const stagedState = conceptStateReducer(baseStagedState, {
      type: MEDIA_ITEM.INDEX,
      update: { field: 'mediaIndex', value: 2 },
      initialState,
    })

    expect(stagedState.mediaIndex).toBe(2)
    expect(value.isModified(initialState, stagedState)).toBe(false)
  })

  it('full flow: deleteConcept differs, verify stateUpdates and isModified, then match initial', () => {
    const stagedState = {
      ...baseStagedState,
      deleteConcept: true,
    }

    expect(value.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = value.stateUpdates(initialState, stagedState)
    expect(updates.deleteConcept.initial).toBe(false)
    expect(updates.deleteConcept.staged).toBe(true)

    const resetStagedState = { ...baseStagedState, deleteConcept: false }
    expect(value.isModified(initialState, resetStagedState)).toBe(false)
    expect(value.stateUpdates(initialState, resetStagedState)).toEqual({})
  })
})
