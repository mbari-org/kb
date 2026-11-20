import { describe, expect, it } from 'vitest'

import CONFIG from '@/lib/config'
import { pendingItemLabel } from '@/lib/model/history'

const ITEM_TITLES = CONFIG.PANELS.CONCEPTS.MODALS.ITEM_TITLES

const base = { id: 'p1', concept: 'dingo-2', action: 'Edit', oldValue: 'a', newValue: 'b' }

describe('pendingItemLabel', () => {
  it('labels each pending field', () => {
    expect(pendingItemLabel({ ...base, field: 'Concept.child', action: 'Add' })).toBe(ITEM_TITLES.CHILD.ADD)
    expect(pendingItemLabel({ ...base, field: 'Media' })).toBe(ITEM_TITLES.MEDIA.EDIT)
    expect(pendingItemLabel({ ...base, field: 'Concept.parent' })).toBe(ITEM_TITLES.PARENT.EDIT)
    expect(pendingItemLabel({ ...base, field: 'Rank' })).toBe(ITEM_TITLES.RANK.EDIT)
    expect(pendingItemLabel({ ...base, field: 'LinkRealization' })).toBe(ITEM_TITLES.REALIZATION.EDIT)
    expect(pendingItemLabel({ ...base, field: 'LinkTemplate' })).toBe(ITEM_TITLES.TEMPLATE.EDIT)
  })

  it('distinguishes a primary rename from an alias change', () => {
    const rename = { ...base, field: 'ConceptName', oldValue: 'dingo', newValue: 'dingo-2' }
    const aliasAdd = { ...base, field: 'ConceptName', action: 'Add', newValue: 'dingo' }

    const aliasEdit = { ...base, field: 'ConceptName', oldValue: 'a', newValue: 'b' }

    expect(pendingItemLabel(rename)).toBe(ITEM_TITLES.NAME.EDIT)
    expect(pendingItemLabel(aliasAdd)).toBe(ITEM_TITLES.ALIAS.ADD)
    expect(pendingItemLabel(aliasEdit)).toBe(ITEM_TITLES.ALIAS.EDIT)
  })

  it('uses the configured title', () => {
    const titles = ITEM_TITLES.ALIAS
    const original = titles.ADD
    titles.ADD = 'Configured alias title'
    try {
      expect(pendingItemLabel({ ...base, field: 'ConceptName', action: 'Add' })).toBe('Configured alias title')
    } finally {
      titles.ADD = original
    }
  })

  it('throws on an unknown field', () => {
    expect(() => pendingItemLabel({ ...base, field: 'Bogus' })).toThrow(
      'Cannot label pending item with unknown field: Bogus'
    )
  })

  it('throws on an unsupported action', () => {
    expect(() => pendingItemLabel({ ...base, field: 'Media', action: 'Bogus' })).toThrow(
      'Cannot label MEDIA action: Bogus'
    )
  })
})
