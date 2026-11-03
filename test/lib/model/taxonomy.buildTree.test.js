import { describe, expect, it } from 'vitest'

import { buildTree, buildTreeItems } from '@/lib/model/taxonomy'

const concept = (name, children = []) => ({ children, name })

// Distinct root names per test keep the module-level node cache isolated between cases.

describe('buildTree structural sharing', () => {
  it('returns the same node references when rebuilt from an unchanged taxonomy', () => {
    const taxonomy = {
      conceptMap: {
        rootA: concept('rootA', ['childA']),
        childA: concept('childA'),
      },
      rootName: 'rootA',
    }

    const first = buildTree(taxonomy)
    const second = buildTree(taxonomy)

    expect(second).toBe(first)
    expect(second.children[0]).toBe(first.children[0])
  })

  it('returns the same root reference when a concept object is replaced without structural change', () => {
    const conceptMap = {
      rootB: concept('rootB', ['childB']),
      childB: concept('childB'),
    }
    const first = buildTree({ conceptMap, rootName: 'rootB' })

    // Hydration-shaped update: new concept object, same name and children
    const hydrated = { ...conceptMap, childB: { ...conceptMap.childB, alternateNames: ['alias'] } }
    const second = buildTree({ conceptMap: hydrated, rootName: 'rootB' })

    expect(second).toBe(first)
  })

  it('rebuilds the affected path on a child-list change and reuses unaffected nodes', () => {
    const conceptMap = {
      rootC: concept('rootC', ['childC', 'otherC']),
      childC: concept('childC'),
      otherC: concept('otherC', ['grandC']),
      grandC: concept('grandC'),
    }
    const first = buildTree({ conceptMap, rootName: 'rootC' })

    const restructured = {
      ...conceptMap,
      rootC: concept('rootC', ['childC', 'otherC', 'newC']),
      newC: concept('newC'),
    }
    const second = buildTree({ conceptMap: restructured, rootName: 'rootC' })

    expect(second).not.toBe(first)
    expect(second.children[0]).toBe(first.children[0])
    expect(second.children[1]).toBe(first.children[1])
    expect(second.children[2].id).toBe('newC')
  })

  it('keeps the items array reference stable across non-structural updates', () => {
    const conceptMap = {
      rootD: concept('rootD', ['childD']),
      childD: concept('childD'),
    }
    const first = buildTreeItems({ conceptMap, rootName: 'rootD' })

    const hydrated = { ...conceptMap, childD: { ...conceptMap.childD, alternateNames: ['alias'] } }
    const second = buildTreeItems({ conceptMap: hydrated, rootName: 'rootD' })

    expect(second).toBe(first)

    const restructured = { ...conceptMap, rootD: concept('rootD', []) }
    const third = buildTreeItems({ conceptMap: restructured, rootName: 'rootD' })

    expect(third).not.toBe(first)
    expect(third[0].children).toEqual([])
  })
})
