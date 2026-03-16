import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as parent from '@/lib/concept/state/parent'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { PARENT, RESET } = CONCEPT_STATE

const baseStagedState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: 'root' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

const initialState = { ...baseStagedState }

describe('conceptStateReducer parent', () => {
  it('edits parent and verifies isModified', () => {
    const stagedState = conceptStateReducer(baseStagedState, {
      type: PARENT,
      update: { value: 'entity' },
      initialState,
    })

    expect(stagedState.parent).toMatchObject({
      value: 'entity',
      action: PARENT,
    })

    expect(parent.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies stateUpdates from parent matches reducer output', () => {
    const stagedState = conceptStateReducer(baseStagedState, {
      type: PARENT,
      update: { value: 'Staged Parent' },
      initialState,
    })

    const parentStateUpdates = parent.stateUpdates(initialState, stagedState)
    expect(parentStateUpdates).toEqual({
      parent: {
        initial: initialState.parent,
        staged: stagedState.parent,
      },
    })

    expect(parentStateUpdates.parent.initial.value).toBe('root')
    expect(parentStateUpdates.parent.staged.value).toBe('Staged Parent')
    expect(parentStateUpdates.parent.staged.action).toBe(PARENT)

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.parent).toBeDefined()
    expect(fullStateUpdates.parent.initial).toEqual(initialState.parent)
    expect(fullStateUpdates.parent.staged).toEqual(stagedState.parent)
  })

  it('edits parent again and verifies new staged values', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: PARENT,
      update: { value: 'Original Parent' },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: PARENT,
      update: { value: 'Edited Parent' },
      initialState,
    })

    expect(stagedState.parent.value).toBe('Edited Parent')
    expect(stagedState.parent.action).toBe(PARENT)

    const parentStateUpdates = parent.stateUpdates(initialState, stagedState)
    expect(parentStateUpdates.parent.staged.value).toBe('Edited Parent')
  })

  it('resets parent and verifies isModified is false', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: PARENT,
      update: { value: 'To Be Reset' },
      initialState,
    })

    expect(parent.isModified(initialState, stagedState)).toBe(true)

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.PARENT,
      update: { parent: initialState.parent },
      initialState,
    })

    expect(stagedState.parent).toEqual(initialState.parent)
    expect(parent.isModified(initialState, stagedState)).toBe(false)
    expect(isStateModified({ initialState, stagedState })).toBe(false)

    const parentStateUpdates = parent.stateUpdates(initialState, stagedState)
    expect(parentStateUpdates).toEqual({})
  })

  it('full flow: edit, verify stateUpdates, edit again, verify, reset, verify isModified false', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: PARENT,
      update: { value: 'dingo' },
      initialState,
    })

    expect(stagedState.parent.value).toBe('dingo')
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = parent.stateUpdates(initialState, stagedState)
    expect(updates.parent.initial.value).toBe('root')
    expect(updates.parent.staged.value).toBe('dingo')

    stagedState = conceptStateReducer(stagedState, {
      type: PARENT,
      update: { value: 'wolf' },
      initialState,
    })

    expect(stagedState.parent.value).toBe('wolf')

    updates = parent.stateUpdates(initialState, stagedState)
    expect(updates.parent.staged.value).toBe('wolf')

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.PARENT,
      update: { parent: initialState.parent },
      initialState,
    })

    expect(stagedState.parent).toEqual(initialState.parent)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(parent.stateUpdates(initialState, stagedState)).toEqual({})
  })
})
