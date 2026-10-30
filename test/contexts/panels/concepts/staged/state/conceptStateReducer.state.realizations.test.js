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
      stateId: expect.any(String),
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
      stateId: expect.any(String),
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
        realizationStateId: stagedState.realizations[0].stateId,
        realizationItem: { ...stagedState.realizations[0], toConcept: 'Edited', linkValue: 'v2' },
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
      update: { realizationStateId: stagedState.realizations[0].stateId },
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
        realizationStateId: stagedState.realizations[0].stateId,
        realizationItem: { ...stagedState.realizations[0], toConcept: 'Dingo Updated', linkValue: 'y' },
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
      update: { realizationStateId: stagedState.realizations[0].stateId },
      initialState,
    })

    expect(stagedState.realizations).toHaveLength(0)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(realizations.stateUpdates(initialState, stagedState)).toEqual({})
  })

  describe('stable stateId identity when server order differs from sort order', () => {
    // Server returns zebra before alpha, but sortRealizations displays alpha first
    const concept = {
      realizations: [
        { id: 11, linkName: 'zebra', toConcept: 'Zed', linkValue: 'z' },
        { id: 22, linkName: 'alpha', toConcept: 'Ay', linkValue: 'a' },
      ],
    }

    const buildState = () => {
      const built = { ...baseStagedState, ...realizations.initialState(concept, []) }
      return { initial: built, staged: structuredClone(built) }
    }

    it('initialState stamps stateId and sorts by linkName', () => {
      const { initial } = buildState()

      expect(initial.realizations.map(item => item.linkName)).toEqual(['alpha', 'zebra'])
      expect(initial.realizations.every(item => typeof item.stateId === 'string')).toBe(true)
    })

    it('editing a displayed row targets the realization with that row stateId', () => {
      const { initial, staged } = buildState()
      const displayedRow = staged.realizations[0]
      expect(displayedRow.linkName).toBe('alpha')

      const stagedState = conceptStateReducer(staged, {
        type: REALIZATION.EDIT,
        update: {
          realizationStateId: displayedRow.stateId,
          realizationItem: { ...displayedRow, linkValue: 'edited' },
        },
        initialState: initial,
      })

      const alpha = stagedState.realizations.find(item => item.linkName === 'alpha')
      const zebra = stagedState.realizations.find(item => item.linkName === 'zebra')
      expect(alpha.linkValue).toBe('edited')
      expect(alpha.action).toBe(REALIZATION.EDIT)
      expect(zebra.linkValue).toBe('z')
      expect(zebra.action).toBe(CONCEPT_STATE.NO_ACTION)
    })

    it('deleting a displayed row marks the realization with that row stateId', () => {
      const { initial, staged } = buildState()
      const displayedRow = staged.realizations[0]
      expect(displayedRow.linkName).toBe('alpha')

      const stagedState = conceptStateReducer(staged, {
        type: REALIZATION.DELETE,
        update: { realizationStateId: displayedRow.stateId },
        initialState: initial,
      })

      const alpha = stagedState.realizations.find(item => item.linkName === 'alpha')
      const zebra = stagedState.realizations.find(item => item.linkName === 'zebra')
      expect(alpha.action).toBe(REALIZATION.DELETE)
      expect(zebra.action).toBe(CONCEPT_STATE.NO_ACTION)
    })
  })

  describe('stable stateId identity after an add re-sorts the staged array', () => {
    const concept = {
      realizations: [
        { id: 11, linkName: 'alpha', toConcept: 'Ay', linkValue: 'a' },
        { id: 22, linkName: 'zebra', toConcept: 'Zed', linkValue: 'z' },
      ],
    }

    it('editing an existing realization after a mid-array add targets the correct item', () => {
      const initial = { ...baseStagedState, ...realizations.initialState(concept, []) }
      let staged = structuredClone(initial)

      staged = conceptStateReducer(staged, {
        type: REALIZATION.ADD,
        update: {
          realizationItem: { linkName: 'middle', toConcept: 'Em', linkValue: 'm' },
        },
        initialState: initial,
      })

      expect(staged.realizations.map(item => item.linkName)).toEqual(['alpha', 'middle', 'zebra'])

      const zebraRow = staged.realizations.find(item => item.linkName === 'zebra')
      staged = conceptStateReducer(staged, {
        type: REALIZATION.EDIT,
        update: {
          realizationStateId: zebraRow.stateId,
          realizationItem: { ...zebraRow, linkValue: 'z-edited' },
        },
        initialState: initial,
      })

      const zebra = staged.realizations.find(item => item.linkName === 'zebra')
      const middle = staged.realizations.find(item => item.linkName === 'middle')
      const alpha = staged.realizations.find(item => item.linkName === 'alpha')
      expect(zebra.linkValue).toBe('z-edited')
      expect(zebra.action).toBe(REALIZATION.EDIT)
      expect(middle.action).toBe(REALIZATION.ADD)
      expect(middle.linkValue).toBe('m')
      expect(alpha.action).toBe(CONCEPT_STATE.NO_ACTION)
    })

    it('deleting an existing realization after a mid-array add targets the correct item', () => {
      const initial = { ...baseStagedState, ...realizations.initialState(concept, []) }
      let staged = structuredClone(initial)

      staged = conceptStateReducer(staged, {
        type: REALIZATION.ADD,
        update: {
          realizationItem: { linkName: 'middle', toConcept: 'Em', linkValue: 'm' },
        },
        initialState: initial,
      })

      const zebraRow = staged.realizations.find(item => item.linkName === 'zebra')
      staged = conceptStateReducer(staged, {
        type: REALIZATION.DELETE,
        update: { realizationStateId: zebraRow.stateId },
        initialState: initial,
      })

      const zebra = staged.realizations.find(item => item.linkName === 'zebra')
      const middle = staged.realizations.find(item => item.linkName === 'middle')
      expect(zebra.action).toBe(REALIZATION.DELETE)
      expect(middle.action).toBe(REALIZATION.ADD)
    })
  })
})
