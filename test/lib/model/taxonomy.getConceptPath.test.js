import { describe, expect, it } from 'vitest'

import { getConceptPath } from '@/lib/model/taxonomy'

const taxonomy = {
  aliasMap: {},
  conceptMap: {
    root: { name: 'root', parent: undefined, children: ['a'] },
    a: { name: 'a', parent: 'root', children: ['b'] },
    b: { name: 'b', parent: 'a', children: [] },
    floating: { name: 'floating', parent: 'missing', children: [] },
  },
  rootName: 'root',
}

describe('getConceptPath', () => {
  it('returns the single-element path for the root', () => {
    expect(getConceptPath(taxonomy, 'root')).toEqual(['root'])
  })

  it('returns the root-first path for a connected concept', () => {
    expect(getConceptPath(taxonomy, 'b')).toEqual(['root', 'a', 'b'])
  })

  it('returns null for a concept absent from the taxonomy', () => {
    expect(getConceptPath(taxonomy, 'unknown')).toBeNull()
  })

  it('returns null when the parent chain does not reach the root', () => {
    expect(getConceptPath(taxonomy, 'floating')).toBeNull()
  })
})
