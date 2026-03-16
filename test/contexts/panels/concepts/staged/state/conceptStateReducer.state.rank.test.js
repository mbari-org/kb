import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdates } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import { isStateModified } from '@/lib/concept/state/state'
import * as rank from '@/lib/concept/state/rank'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'
import { describe, expect, it } from 'vitest'

const { RANK, RESET } = CONCEPT_STATE

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

describe('conceptStateReducer rank', () => {
  it('edits rank and verifies isModified', () => {
    const stagedState = conceptStateReducer(baseStagedState, {
      type: RANK,
      update: { level: 'Species', name: 'Animalia' },
      initialState,
    })

    expect(stagedState.rank).toMatchObject({
      level: 'Species',
      name: 'Animalia',
    })

    expect(rank.isModified(initialState, stagedState)).toBe(true)
    expect(isStateModified({ initialState, stagedState })).toBe(true)
  })

  it('verifies stateUpdates from rank matches reducer output', () => {
    const stagedState = conceptStateReducer(baseStagedState, {
      type: RANK,
      update: { level: 'Genus', name: 'Canis' },
      initialState,
    })

    const rankStateUpdates = rank.stateUpdates(initialState, stagedState)
    expect(rankStateUpdates).toEqual({
      rank: {
        initial: initialState.rank,
        staged: stagedState.rank,
      },
    })

    expect(rankStateUpdates.rank.initial.level).toBe('')
    expect(rankStateUpdates.rank.initial.name).toBe('')
    expect(rankStateUpdates.rank.staged.level).toBe('Genus')
    expect(rankStateUpdates.rank.staged.name).toBe('Canis')

    const fullStateUpdates = stateUpdates(initialState, stagedState)
    expect(fullStateUpdates.rank).toBeDefined()
    expect(fullStateUpdates.rank.initial).toEqual(initialState.rank)
    expect(fullStateUpdates.rank.staged).toEqual(stagedState.rank)
  })

  it('edits rank again and verifies new staged values', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: RANK,
      update: { level: 'Species', name: 'Original' },
      initialState,
    })

    stagedState = conceptStateReducer(stagedState, {
      type: RANK,
      update: { level: 'Genus', name: 'Edited' },
      initialState,
    })

    expect(stagedState.rank.level).toBe('Genus')
    expect(stagedState.rank.name).toBe('Edited')

    const rankStateUpdates = rank.stateUpdates(initialState, stagedState)
    expect(rankStateUpdates.rank.staged.level).toBe('Genus')
    expect(rankStateUpdates.rank.staged.name).toBe('Edited')
  })

  it('resets rank and verifies isModified is false', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: RANK,
      update: { level: 'Species', name: 'To Be Reset' },
      initialState,
    })

    expect(rank.isModified(initialState, stagedState)).toBe(true)

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.RANK,
      update: { rank: initialState.rank },
      initialState,
    })

    expect(stagedState.rank).toEqual(initialState.rank)
    expect(rank.isModified(initialState, stagedState)).toBe(false)
    expect(isStateModified({ initialState, stagedState })).toBe(false)

    const rankStateUpdates = rank.stateUpdates(initialState, stagedState)
    expect(rankStateUpdates).toEqual({})
  })

  it('full flow: edit, verify stateUpdates, edit again, verify, reset, verify isModified false', () => {
    let stagedState = conceptStateReducer(baseStagedState, {
      type: RANK,
      update: { level: 'Species', name: 'Dingo' },
      initialState,
    })

    expect(stagedState.rank.level).toBe('Species')
    expect(stagedState.rank.name).toBe('Dingo')
    expect(isStateModified({ initialState, stagedState })).toBe(true)

    let updates = rank.stateUpdates(initialState, stagedState)
    expect(updates.rank.initial.level).toBe('')
    expect(updates.rank.staged.level).toBe('Species')
    expect(updates.rank.staged.name).toBe('Dingo')

    stagedState = conceptStateReducer(stagedState, {
      type: RANK,
      update: { level: 'Genus', name: 'Canis' },
      initialState,
    })

    expect(stagedState.rank.level).toBe('Genus')
    expect(stagedState.rank.name).toBe('Canis')

    updates = rank.stateUpdates(initialState, stagedState)
    expect(updates.rank.staged.level).toBe('Genus')
    expect(updates.rank.staged.name).toBe('Canis')

    stagedState = conceptStateReducer(stagedState, {
      type: RESET.RANK,
      update: { rank: initialState.rank },
      initialState,
    })

    expect(stagedState.rank).toEqual(initialState.rank)
    expect(isStateModified({ initialState, stagedState })).toBe(false)
    expect(rank.stateUpdates(initialState, stagedState)).toEqual({})
  })
})
