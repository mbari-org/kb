import { describe, expect, it } from 'vitest'

import { pendingFieldLabel } from '@/lib/model/history'

const base = { id: 'p1', concept: 'dingo-2', action: 'Edit', oldValue: 'a', newValue: 'b' }

describe('pendingFieldLabel', () => {
  it('labels each pending field', () => {
    expect(pendingFieldLabel({ ...base, field: 'Concept.child', action: 'Add' })).toBe('Child')
    expect(pendingFieldLabel({ ...base, field: 'Media' })).toBe('Media')
    expect(pendingFieldLabel({ ...base, field: 'Concept.parent' })).toBe('Parent')
    expect(pendingFieldLabel({ ...base, field: 'Rank' })).toBe('Rank')
    expect(pendingFieldLabel({ ...base, field: 'LinkRealization' })).toBe('Realization')
    expect(pendingFieldLabel({ ...base, field: 'LinkTemplate' })).toBe('Template')
  })

  it('distinguishes a primary rename from an alias change', () => {
    const rename = { ...base, field: 'ConceptName', oldValue: 'dingo', newValue: 'dingo-2' }
    const aliasAdd = { ...base, field: 'ConceptName', action: 'Add', newValue: 'dingo' }

    expect(pendingFieldLabel(rename)).toBe('Name')
    expect(pendingFieldLabel(aliasAdd)).toBe('Alias')
  })

  it('throws on an unknown field', () => {
    expect(() => pendingFieldLabel({ ...base, field: 'Bogus' })).toThrow(
      'Cannot label pending item with unknown field: Bogus'
    )
  })
})
