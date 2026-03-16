import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as children from '@/lib/concept/state/children'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { CHILD, RESET } = CONCEPT_STATE

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

describe('conceptStateReducer children', () => {
  it('adds a child and verifies isModified', () => {
    const childItem = {
      name: 'Dingo',
      author: 'me',
      rankLevel: '',
      rankName: '',
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: CHILD.ADD,
      update: { child: childItem },
      initialState,
    })

    expect(stagedState.children).toHaveLength(1)
    expect(stagedState.children[0]).toMatchObject({
      name: 'Dingo',
      author: 'me',
      rankLevel: '',
      rankName: '',
      action: CHILD.ADD,
      index: 0,
    })

    expect(children.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies stateUpdates from children matches reducer output', () => {
    const childItem = {
      name: 'Staged Child',
      author: 'Author Name',
      rankLevel: 'Species',
      rankName: 'Animalia',
    }

    const stagedState = conceptStateReducer(baseStagedState, {
      type: CHILD.ADD,
      update: { child: childItem },
      initialState,
    })

    const childrenStateUpdates = children.stateUpdates(initialState, stagedState)
    expect(childrenStateUpdates).toEqual({
      children: {
        initial: [],
        staged: stagedState.children,
      },
    })

    expect(childrenStateUpdates.children.initial).toEqual([])
    expect(childrenStateUpdates.children.staged).toHaveLength(1)
    expect(childrenStateUpdates.children.staged[0]).toMatchObject({
      name: 'Staged Child',
      author: 'Author Name',
      rankLevel: 'Species',
      rankName: 'Animalia',
      action: CHILD.ADD,
      index: 0,
    })

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.children).toBeDefined()
    expect(fullStateUpdates.children.initial).toEqual([])
    expect(fullStateUpdates.children.staged).toEqual(stagedState.children)
  })

  it('adds a second child and verifies new staged values', () => {
    const childItem1 = {
      name: 'First Child',
      author: 'Author One',
      rankLevel: '',
      rankName: '',
    }

    const childItem2 = {
      name: 'Second Child',
      author: 'Author Two',
      rankLevel: 'Genus',
      rankName: 'Canis',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: CHILD.ADD,
      update: { child: childItem1 },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: CHILD.ADD,
      update: { child: childItem2 },
      initialState,
    })

    expect(stagedState.children).toHaveLength(2)
    expect(stagedState.children[0]).toMatchObject({
      name: 'First Child',
      author: 'Author One',
      action: CHILD.ADD,
      index: 0,
    })
    expect(stagedState.children[1]).toMatchObject({
      name: 'Second Child',
      author: 'Author Two',
      rankLevel: 'Genus',
      rankName: 'Canis',
      action: CHILD.ADD,
      index: 1,
    })

    const childrenStateUpdates = children.stateUpdates(initialState, stagedState)
    expect(childrenStateUpdates.children.staged[0].name).toBe('First Child')
    expect(childrenStateUpdates.children.staged[1].name).toBe('Second Child')
  })

  it('resets children and verifies isModified is false', () => {
    const childItem = {
      name: 'To Be Reset',
      author: '',
      rankLevel: '',
      rankName: '',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: CHILD.ADD,
      update: { child: childItem },
      initialState,
    })

    expect(stagedState.children).toHaveLength(1)
    expect(children.isModified(initialState, stagedState)).toBe(true)

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.CHILDREN,
      update: { children: [] },
      initialState,
    })

    expect(stagedState.children).toHaveLength(0)
    expect(children.isModified(initialState, stagedState)).toBe(false)
    expect(isStateModified({ initialState, stagedState })).toBe(false)

    const childrenStateUpdates = children.stateUpdates(initialState, stagedState)
    expect(childrenStateUpdates).toEqual({})
  })

  it('full flow: add, verify stateUpdates, add second, verify, reset, verify isModified false', () => {
    const childItem1 = {
      name: 'Dingo',
      author: 'me',
      rankLevel: '',
      rankName: '',
    }

    const childItem2 = {
      name: 'Wolf',
      author: 'you',
      rankLevel: '',
      rankName: '',
    }

    let stagedState = conceptStateReducer(baseStagedState, {
      type: CHILD.ADD,
      update: { child: childItem1 },
      initialState,
    })

    expect(stagedState.children).toHaveLength(1)
    expect(stagedState.children[0].name).toBe('Dingo')
    expect(stagedState.children[0].author).toBe('me')
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = children.stateUpdates(initialState, stagedState)
    expect(updates.children.initial).toEqual([])
    expect(updates.children.staged[0]).toMatchObject({
      name: 'Dingo',
      author: 'me',
      action: CHILD.ADD,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: CHILD.ADD,
      update: { child: childItem2 },
      initialState,
    })

    expect(stagedState.children).toHaveLength(2)
    expect(stagedState.children[1].name).toBe('Wolf')
    expect(stagedState.children[1].author).toBe('you')

    updates = children.stateUpdates(initialState, stagedState)
    expect(updates.children.staged[0].name).toBe('Dingo')
    expect(updates.children.staged[1].name).toBe('Wolf')

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.CHILDREN,
      update: { children: [] },
      initialState,
    })

    expect(stagedState.children).toHaveLength(0)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(children.stateUpdates(initialState, stagedState)).toEqual({})
  })
})
