import { describe, expect, it } from 'vitest'

import { stampStagedEdits } from '@/lib/concept/state/stagedSeq'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const baseState = {
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  media: [],
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
}

describe('stampStagedEdits', () => {
  it('returns the same state when nothing needs stamping', () => {
    const state = {
      ...baseState,
      aliases: [{ name: 'x', action: 'None', index: 0 }],
    }

    expect(stampStagedEdits(state)).toBe(state)
  })

  it('stamps array items and value fields that have a staged action', () => {
    const state = {
      ...baseState,
      aliases: [{ name: 'x', action: CONCEPT_STATE.ALIAS.ADD, index: 0 }],
      author: { action: CONCEPT_STATE.AUTHOR, value: 'me' },
      children: [{ name: 'kid', action: CONCEPT_STATE.CHILD.ADD, index: 0 }],
    }

    const stamped = stampStagedEdits(state)

    expect(stamped.aliases[0].stagedSeq).toBe(1)
    expect(stamped.children[0].stagedSeq).toBe(2)
    expect(stamped.author.stagedSeq).toBe(3)
  })

  it('does not stamp pending or no-action items', () => {
    const state = {
      ...baseState,
      aliases: [
        { name: 'x', action: 'Add Pending', historyId: 'h1', index: 0 },
        { name: 'y', action: 'None', index: 1 },
      ],
    }

    expect(stampStagedEdits(state)).toBe(state)
  })

  it('keeps existing stamps and continues from the current max', () => {
    const state = {
      ...baseState,
      aliases: [{ name: 'x', action: CONCEPT_STATE.ALIAS.EDIT, index: 0, stagedSeq: 7 }],
      children: [{ name: 'kid', action: CONCEPT_STATE.CHILD.ADD, index: 0 }],
    }

    const stamped = stampStagedEdits(state)

    expect(stamped.aliases[0].stagedSeq).toBe(7)
    expect(stamped.children[0].stagedSeq).toBe(8)
  })
})
