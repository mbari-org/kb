import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as aliases from '@/lib/concept/state/aliases'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { ALIAS } = CONCEPT_STATE

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

describe('conceptStateReducer aliases', () => {
  it('normalizes indexes after ordering alias initial state', () => {
    const concept = {
      aliases: [
        { id: 'a2', name: 'beta', nameType: 'common', author: '' },
        { id: 'a1', name: 'alpha', nameType: 'common', author: '' },
        { id: 'a3', name: 'zeta', nameType: 'former', author: '' },
      ],
    }

    const aliasState = aliases.initialState(concept, [])

    expect(aliasState.aliases.map(alias => alias.name)).toEqual(['alpha', 'beta', 'zeta'])
    expect(aliasState.aliases.map(alias => alias.index)).toEqual([0, 1, 2])
  })
  it('adds an alias and verifies isModified', () => {
    const aliasItem = {
      id: 'alias-1',
      name: 'New Alias',
      nameType: 'Common',
      author: 'J. Smith',
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: ALIAS.ADD,
      update: { aliasItem },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(1)
    expect(stagedState.aliases[0]).toMatchObject({
      id: 'alias-1',
      name: 'New Alias',
      nameType: 'Common',
      author: 'J. Smith',
      action: ALIAS.ADD,
      index: 0,
    })

    expect(aliases.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies stateUpdates from aliases matches reducer output', () => {
    const aliasItem = {
      id: 'alias-1',
      name: 'Staged Alias',
      nameType: 'Synonym',
      author: 'Author Name',
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: ALIAS.ADD,
      update: { aliasItem },
      initialState,
    })

    const aliasStateUpdates = aliases.stateUpdates(initialState, stagedState)
    expect(aliasStateUpdates).toEqual({
      aliases: {
        initial: [],
        staged: stagedState.aliases,
      },
    })

    expect(aliasStateUpdates.aliases.initial).toEqual([])
    expect(aliasStateUpdates.aliases.staged).toHaveLength(1)
    expect(aliasStateUpdates.aliases.staged[0]).toMatchObject({
      id: 'alias-1',
      name: 'Staged Alias',
      nameType: 'Synonym',
      author: 'Author Name',
      action: ALIAS.ADD,
      index: 0,
    })

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.aliases).toBeDefined()
    expect(fullStateUpdates.aliases.initial).toEqual([])
    expect(fullStateUpdates.aliases.staged).toEqual(stagedState.aliases)
  })

  it('edits the added alias and verifies new staged values', () => {
    const aliasItem = {
      id: 'alias-1',
      name: 'Original Name',
      nameType: 'Common',
      author: 'Original Author',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: ALIAS.ADD,
      update: { aliasItem },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: ALIAS.EDIT,
      update: {
        aliasIndex: 0,
        aliasItem: { name: 'Edited Name', author: 'Edited Author' },
      },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(1)
    expect(stagedState.aliases[0]).toMatchObject({
      name: 'Edited Name',
      author: 'Edited Author',
      action: ALIAS.ADD,
    })

    const aliasStateUpdates = aliases.stateUpdates(initialState, stagedState)
    expect(aliasStateUpdates.aliases.staged[0].name).toBe('Edited Name')
    expect(aliasStateUpdates.aliases.staged[0].author).toBe('Edited Author')
  })

  it('deletes the added alias and verifies isModified is false', () => {
    const aliasItem = {
      id: 'alias-1',
      name: 'To Be Deleted',
      nameType: 'Former',
      author: '',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: ALIAS.ADD,
      update: { aliasItem },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(1)
    expect(aliases.isModified(initialState, stagedState)).toBe(true)

    stagedState = conceptStateReducer(stagedState, {
      type: ALIAS.DELETE,
      update: { aliasIndex: 0 },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(0)
    expect(aliases.isModified(initialState, stagedState)).toBe(false)
    expect(isStateModified({ initialState, stagedState })).toBe(false)

    const aliasStateUpdates = aliases.stateUpdates(initialState, stagedState)
    expect(aliasStateUpdates).toEqual({})
  })

  it('full flow: add, verify stateUpdates, edit, verify, delete, verify isModified false', () => {
    const aliasItem = {
      id: 'alias-full-flow',
      name: 'Dingo',
      nameType: 'Common',
      author: 'me',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: ALIAS.ADD,
      update: { aliasItem },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(1)
    expect(stagedState.aliases[0].name).toBe('Dingo')
    expect(stagedState.aliases[0].author).toBe('me')
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = aliases.stateUpdates(initialState, stagedState)
    expect(updates.aliases.initial).toEqual([])
    expect(updates.aliases.staged[0]).toMatchObject({
      name: 'Dingo',
      author: 'me',
      action: ALIAS.ADD,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: ALIAS.EDIT,
      update: {
        aliasIndex: 0,
        aliasItem: { name: 'Dingo Updated', author: 'you' },
      },
      initialState,
    })

    expect(stagedState.aliases[0].name).toBe('Dingo Updated')
    expect(stagedState.aliases[0].author).toBe('you')

    updates = aliases.stateUpdates(initialState, stagedState)
    expect(updates.aliases.staged[0].name).toBe('Dingo Updated')
    expect(updates.aliases.staged[0].author).toBe('you')

    stagedState = conceptStateReducer(stagedState, {
      type: ALIAS.DELETE,
      update: { aliasIndex: 0 },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(0)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(aliases.stateUpdates(initialState, stagedState)).toEqual({})
  })

  it('reindexes after deleting an added alias so remaining alias can be edited by ui index', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: ALIAS.ADD,
      update: {
        aliasItem: {
          id: 'alias-1',
          name: 'First Alias',
          nameType: 'Common',
          author: 'author-1',
        },
      },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: ALIAS.ADD,
      update: {
        aliasItem: {
          id: 'alias-2',
          name: 'Second Alias',
          nameType: 'Common',
          author: 'author-2',
        },
      },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: ALIAS.DELETE,
      update: { aliasIndex: 0 },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(1)
    expect(stagedState.aliases[0].name).toBe('Second Alias')
    expect(stagedState.aliases[0].index).toBe(0)

    const aliasIndexFromUiItem = stagedState.aliases[0].index

    stagedState = conceptStateReducer(stagedState, {
      type: ALIAS.EDIT,
      update: {
        aliasIndex: aliasIndexFromUiItem,
        aliasItem: { name: 'Second Alias Edited', author: 'author-2-updated' },
      },
      initialState,
    })

    expect(stagedState.aliases).toHaveLength(1)
    expect(stagedState.aliases[0].name).toBe('Second Alias Edited')
    expect(stagedState.aliases[0].author).toBe('author-2-updated')
    expect(stagedState.aliases[0].action).toBe(ALIAS.ADD)
    expect(stagedState.aliases[0].index).toBe(0)
  })
})
