import { describe, expect, it } from 'vitest'

import { buildStagedJournal } from '@/lib/concept/state/stagedJournal'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const baseState = {
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  media: [],
  name: { action: 'None', value: 'dingo', extent: '' },
  parent: { action: 'None', value: 'root' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
}

describe('buildStagedJournal', () => {
  it('orders stamped ops by stagedSeq', () => {
    const staged = {
      ...baseState,
      aliases: [{ name: 'a', action: CONCEPT_STATE.ALIAS.ADD, index: 0, stagedSeq: 2 }],
      name: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '', stagedSeq: 1 },
      children: [{ name: 'pup', action: CONCEPT_STATE.CHILD.ADD, index: 0, stagedSeq: 3 }],
    }

    const ops = buildStagedJournal(baseState, staged)

    expect(ops.map(op => op.field)).toEqual([
      CONCEPT.FIELD.NAME,
      CONCEPT.FIELD.ALIASES,
      CONCEPT.FIELD.CHILDREN,
    ])
    expect(ops.map(op => op.seq)).toEqual([1, 2, 3])
  })

  it('excludes pending decorations and no-action items', () => {
    const staged = {
      ...baseState,
      aliases: [
        { name: 'x', action: 'Add Pending', historyId: 'h1', index: 0 },
        { name: 'y', action: 'None', index: 1 },
        { name: 'z', action: CONCEPT_STATE.ALIAS.ADD, index: 2, stagedSeq: 1 },
      ],
    }

    const ops = buildStagedJournal(baseState, staged)

    expect(ops).toHaveLength(1)
    expect(ops[0].item.name).toBe('z')
  })

  it('sorts unstamped ops after stamped ones using legacy field order', () => {
    const staged = {
      ...baseState,
      aliases: [{ name: 'a', action: CONCEPT_STATE.ALIAS.ADD, index: 0 }],
      author: { action: CONCEPT_STATE.AUTHOR, value: 'me' },
      name: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '', stagedSeq: 1 },
      realizations: [
        {
          id: 1,
          linkName: 'has',
          toConcept: 'x',
          linkValue: 'v',
          action: CONCEPT_STATE.REALIZATION.ADD,
          stateId: 's1',
        },
      ],
    }

    const ops = buildStagedJournal(baseState, staged)

    expect(ops.map(op => op.field)).toEqual([
      CONCEPT.FIELD.NAME,
      CONCEPT.FIELD.ALIASES,
      CONCEPT.FIELD.AUTHOR,
      CONCEPT.FIELD.REALIZATIONS,
    ])
  })

  it('emits scalar field shapes and list item shapes', () => {
    const staged = {
      ...baseState,
      author: { action: CONCEPT_STATE.AUTHOR, value: 'me', stagedSeq: 1 },
      rank: { action: CONCEPT_STATE.RANK, level: '1', name: 'species', stagedSeq: 2 },
      media: [
        {
          url: 'https://example.com/a.jpg',
          action: CONCEPT_STATE.MEDIA_ITEM.ADD,
          index: 0,
          stagedSeq: 3,
        },
      ],
    }

    const ops = buildStagedJournal(baseState, staged)

    expect(ops[0]).toMatchObject({
      field: CONCEPT.FIELD.AUTHOR,
      action: CONCEPT_STATE.AUTHOR,
      item: { value: 'me' },
    })
    expect(ops[1]).toMatchObject({
      field: CONCEPT.FIELD.RANK,
      action: CONCEPT_STATE.RANK,
      item: { level: '1', name: 'species' },
    })
    expect(ops[2]).toMatchObject({
      field: CONCEPT.FIELD.MEDIA,
      action: CONCEPT_STATE.MEDIA_ITEM.ADD,
      index: 0,
    })
  })
})
