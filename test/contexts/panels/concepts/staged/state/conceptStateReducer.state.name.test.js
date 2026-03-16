import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as name from '@/lib/concept/state/name'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { NAME, RESET } = CONCEPT_STATE

const baseStagedState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: 'object', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

const initialState = { ...baseStagedState }

describe('conceptStateReducer name', () => {
  it('edits name and verifies isModified', () => {
    const stagedState = conceptStateReducer(baseStagedState, {
      type: NAME,
      update: { value: 'Dingo', extent: 'Full extent' },
      initialState,
    })

    expect(stagedState.name).toMatchObject({
      value: 'Dingo',
      extent: 'Full extent',
    })

    expect(name.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies stateUpdates from name matches reducer output', () => {
    const stagedState = conceptStateReducer(baseStagedState, {
      type: NAME,
      update: { value: 'Staged Name', extent: 'Solo extent' },
      initialState,
    })

    const nameStateUpdates = name.stateUpdates(initialState, stagedState)
    expect(nameStateUpdates).toEqual({
      name: {
        initial: initialState.name,
        staged: stagedState.name,
      },
    })

    expect(nameStateUpdates.name.initial.value).toBe('object')
    expect(nameStateUpdates.name.staged.value).toBe('Staged Name')
    expect(nameStateUpdates.name.staged.extent).toBe('Solo extent')

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.name).toBeDefined()
    expect(fullStateUpdates.name.initial).toEqual(initialState.name)
    expect(fullStateUpdates.name.staged).toEqual(stagedState.name)
  })

  it('edits name again and verifies new staged values', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: NAME,
      update: { value: 'Original Name', extent: '' },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: NAME,
      update: { value: 'Edited Name', extent: 'Descendants extent' },
      initialState,
    })

    expect(stagedState.name.value).toBe('Edited Name')
    expect(stagedState.name.extent).toBe('Descendants extent')

    const nameStateUpdates = name.stateUpdates(initialState, stagedState)
    expect(nameStateUpdates.name.staged.value).toBe('Edited Name')
    expect(nameStateUpdates.name.staged.extent).toBe('Descendants extent')
  })

  it('resets name and verifies isModified is false', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: NAME,
      update: { value: 'To Be Reset', extent: 'Full' },
      initialState,
    })

    expect(name.isModified(initialState, stagedState)).toBe(true)

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.NAME,
      update: { name: initialState.name },
      initialState,
    })

    expect(stagedState.name).toEqual(initialState.name)
    expect(name.isModified(initialState, stagedState)).toBe(false)
    expect(isStateModified({ initialState, stagedState })).toBe(false)

    const nameStateUpdates = name.stateUpdates(initialState, stagedState)
    expect(nameStateUpdates).toEqual({})
  })

  it('full flow: edit, verify stateUpdates, edit again, verify, reset, verify isModified false', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: NAME,
      update: { value: 'Dingo', extent: '' },
      initialState,
    })

    expect(stagedState.name.value).toBe('Dingo')
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = name.stateUpdates(initialState, stagedState)
    expect(updates.name.initial.value).toBe('object')
    expect(updates.name.staged.value).toBe('Dingo')

    stagedState = conceptStateReducer(stagedState, {
      type: NAME,
      update: { value: 'Dingo Updated', extent: 'Full extent' },
      initialState,
    })

    expect(stagedState.name.value).toBe('Dingo Updated')
    expect(stagedState.name.extent).toBe('Full extent')

    updates = name.stateUpdates(initialState, stagedState)
    expect(updates.name.staged.value).toBe('Dingo Updated')
    expect(updates.name.staged.extent).toBe('Full extent')

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.NAME,
      update: { name: initialState.name },
      initialState,
    })

    expect(stagedState.name).toEqual(initialState.name)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(name.stateUpdates(initialState, stagedState)).toEqual({})
  })
})
