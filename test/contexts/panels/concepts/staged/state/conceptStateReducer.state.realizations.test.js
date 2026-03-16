import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as realizations from '@/lib/concept/state/realizations'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { REALIZATION } = CONCEPT_STATE

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

describe('conceptStateReducer realizations', () => {
  it('adds a realization and verifies isModified', () => {
    const realizationItem = {
      linkName: 'sameAs',
      toConcept: 'Other',
      linkValue: 'x',
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: REALIZATION.ADD,
      update: { realizationItem },
      initialState,
    })

    expect(stagedState.realizations).toHaveLength(1)
    expect(stagedState.realizations[0]).toMatchObject({
      linkName: 'sameAs',
      toConcept: 'Other',
      linkValue: 'x',
      action: REALIZATION.ADD,
      index: 0,
    })

    expect(realizations.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies stateUpdates from realizations matches reducer output', () => {
    const realizationItem = {
      linkName: 'sameAs',
      toConcept: 'Staged Concept',
      linkValue: 'v1',
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: REALIZATION.ADD,
      update: { realizationItem },
      initialState,
    })

    const realizationsStateUpdates = realizations.stateUpdates(initialState, stagedState)
    expect(realizationsStateUpdates).toEqual({
      realizations: {
        initial: [],
        staged: stagedState.realizations,
      },
    })

    expect(realizationsStateUpdates.realizations.initial).toEqual([])
    expect(realizationsStateUpdates.realizations.staged).toHaveLength(1)
    expect(realizationsStateUpdates.realizations.staged[0]).toMatchObject({
      linkName: 'sameAs',
      toConcept: 'Staged Concept',
      linkValue: 'v1',
      action: REALIZATION.ADD,
      index: 0,
    })

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.realizations).toBeDefined()
    expect(fullStateUpdates.realizations.initial).toEqual([])
    expect(fullStateUpdates.realizations.staged).toEqual(stagedState.realizations)
  })

  it('edits the added realization and verifies new staged values', () => {
    const realizationItem = {
      linkName: 'sameAs',
      toConcept: 'Original',
      linkValue: 'v',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: REALIZATION.ADD,
      update: { realizationItem },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: REALIZATION.EDIT,
      update: {
        realizationIndex: 0,
        realizationItem: { toConcept: 'Edited', linkValue: 'v2' },
      },
      initialState,
    })

    expect(stagedState.realizations).toHaveLength(1)
    expect(stagedState.realizations[0]).toMatchObject({
      toConcept: 'Edited',
      linkValue: 'v2',
      action: REALIZATION.ADD,
    })

    const realizationsStateUpdates = realizations.stateUpdates(initialState, stagedState)
    expect(realizationsStateUpdates.realizations.staged[0].toConcept).toBe('Edited')
    expect(realizationsStateUpdates.realizations.staged[0].linkValue).toBe('v2')
  })

  it('deletes the added realization and verifies isModified is false', () => {
    const realizationItem = {
      linkName: 'sameAs',
      toConcept: 'To Be Deleted',
      linkValue: '',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: REALIZATION.ADD,
      update: { realizationItem },
      initialState,
    })

    expect(stagedState.realizations).toHaveLength(1)
    expect(realizations.isModified(initialState, stagedState)).toBe(true)

    stagedState = conceptStateReducer(stagedState, {
      type: REALIZATION.DELETE,
      update: { realizationIndex: 0 },
      initialState,
    })

    expect(stagedState.realizations).toHaveLength(0)
    expect(realizations.isModified(initialState, stagedState)).toBe(false)
    expect(isStateModified({ initialState, stagedState })).toBe(false)

    const realizationsStateUpdates = realizations.stateUpdates(initialState, stagedState)
    expect(realizationsStateUpdates).toEqual({})
  })

  it('full flow: add, verify stateUpdates, edit, verify, delete, verify isModified false', () => {
    const realizationItem = {
      linkName: 'sameAs',
      toConcept: 'Dingo',
      linkValue: 'x',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: REALIZATION.ADD,
      update: { realizationItem },
      initialState,
    })

    expect(stagedState.realizations).toHaveLength(1)
    expect(stagedState.realizations[0].toConcept).toBe('Dingo')
    expect(stagedState.realizations[0].linkValue).toBe('x')
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = realizations.stateUpdates(initialState, stagedState)
    expect(updates.realizations.initial).toEqual([])
    expect(updates.realizations.staged[0]).toMatchObject({
      toConcept: 'Dingo',
      linkValue: 'x',
      action: REALIZATION.ADD,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: REALIZATION.EDIT,
      update: {
        realizationIndex: 0,
        realizationItem: { toConcept: 'Dingo Updated', linkValue: 'y' },
      },
      initialState,
    })

    expect(stagedState.realizations[0].toConcept).toBe('Dingo Updated')
    expect(stagedState.realizations[0].linkValue).toBe('y')

    updates = realizations.stateUpdates(initialState, stagedState)
    expect(updates.realizations.staged[0].toConcept).toBe('Dingo Updated')
    expect(updates.realizations.staged[0].linkValue).toBe('y')

    stagedState = conceptStateReducer(stagedState, {
      type: REALIZATION.DELETE,
      update: { realizationIndex: 0 },
      initialState,
    })

    expect(stagedState.realizations).toHaveLength(0)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(realizations.stateUpdates(initialState, stagedState)).toEqual({})
  })
})
