import { describe, expect, it } from 'vitest'

import { removeBranchFromMaps } from '@/lib/model/taxonomy'

describe('removeBranchFromMaps', () => {
  it('removes the root concept and its aliases', () => {
    const child = { name: 'kid', alternateNames: ['kid-alias'], children: [] }
    const conceptMap = { kid: child }
    const aliasMap = { 'kid-alias': child }

    removeBranchFromMaps(conceptMap, aliasMap, 'kid')

    expect(conceptMap).toEqual({})
    expect(aliasMap).toEqual({})
  })

  it('removes descendants recursively', () => {
    const grandchild = { name: 'grandkid', alternateNames: [], children: [] }
    const child = { name: 'kid', alternateNames: ['kid-alias'], children: ['grandkid'] }
    const root = { name: 'root', alternateNames: [], children: ['kid'] }
    const conceptMap = { root, kid: child, grandkid: grandchild }
    const aliasMap = { 'kid-alias': child }

    removeBranchFromMaps(conceptMap, aliasMap, 'root')

    expect(conceptMap).toEqual({})
    expect(aliasMap).toEqual({})
  })

  it('handles concepts absent from the map and structure-only nodes', () => {
    const child = { name: 'kid', children: ['ghost'] }
    const conceptMap = { kid: child }
    const aliasMap = {}

    removeBranchFromMaps(conceptMap, aliasMap, 'kid')

    expect(conceptMap).toEqual({})
    expect(aliasMap).toEqual({})
  })
})
