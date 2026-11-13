import { describe, expect, it } from 'vitest'

import { createEffectiveState } from '@/lib/concept/state/effectiveState'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const baseState = {
  aliases: [{ id: 1, name: 'old-alias', author: 'a', nameType: 'synonym', action: 'None', index: 0 }],
  author: { action: 'None', value: 'author' },
  children: [],
  media: [],
  name: { action: 'None', value: 'dingo', extent: '' },
  parent: { action: 'None', value: 'root' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
}

describe('createEffectiveState', () => {
  it('advances name under applyImmediately after a NAME op', () => {
    const effective = createEffectiveState(baseState, { applyImmediately: true })

    effective.apply({
      field: CONCEPT.FIELD.NAME,
      action: CONCEPT_STATE.NAME,
      item: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '' },
    })

    expect(effective.state.name).toBe('wolf')
  })

  it('always advances name on NAME ops even when applyImmediately is false', () => {
    const effective = createEffectiveState(baseState, { applyImmediately: false })

    effective.apply({
      field: CONCEPT.FIELD.NAME,
      action: CONCEPT_STATE.NAME,
      item: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '' },
    })
    effective.apply({
      field: CONCEPT.FIELD.ALIASES,
      action: CONCEPT_STATE.ALIAS.ADD,
      item: { name: 'x', action: CONCEPT_STATE.ALIAS.ADD },
    })

    expect(effective.state.name).toBe('wolf')
    expect(effective.state.aliases).toHaveLength(1)
  })

  it('resolves alias prior name after an in-session rename when applying', () => {
    const effective = createEffectiveState(baseState, { applyImmediately: true })

    effective.apply({
      field: CONCEPT.FIELD.ALIASES,
      action: CONCEPT_STATE.ALIAS.EDIT,
      item: {
        id: 1,
        name: 'new-alias',
        author: 'a',
        nameType: 'synonym',
        action: CONCEPT_STATE.ALIAS.EDIT,
      },
    })

    const prior = effective.findAlias({ id: 1, name: 'whatever' })
    expect(prior.name).toBe('new-alias')
  })
})
