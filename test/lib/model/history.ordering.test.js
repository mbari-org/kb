import { describe, expect, it } from 'vitest'

import { moveAddToFirst, moveAddToLast, moveDeleteToLast } from '@/lib/model/history'

const childAdd = id => ({ id, field: 'Concept.child', action: 'Add' })
const childDelete = id => ({ id, field: 'Concept.child', action: 'Delete' })
const rename = id => ({ id, field: 'ConceptName', action: 'Edit', oldValue: 'a', newValue: 'b', concept: 'b' })
const mediaAdd = id => ({ id, field: 'Media', action: 'Add' })
const aliasAdd = id => ({ id, field: 'ConceptName', action: 'Add' })

describe('history ordering', () => {
  it('moveAddToFirst moves only Concept.child Add items, preserving relative order', () => {
    const items = [mediaAdd('m'), childAdd('add'), rename('r')]

    expect(moveAddToFirst(items).map(i => i.id)).toEqual(['add', 'm', 'r'])
  })

  it('moveAddToLast moves only Concept.child Add items, preserving relative order', () => {
    const items = [childAdd('add'), rename('r'), mediaAdd('m')]

    expect(moveAddToLast(items).map(i => i.id)).toEqual(['r', 'm', 'add'])
  })

  it('moveDeleteToLast moves only Concept.child Delete items, preserving relative order', () => {
    const items = [childDelete('del'), rename('r'), aliasAdd('a')]

    expect(moveDeleteToLast(items).map(i => i.id)).toEqual(['r', 'a', 'del'])
  })

  it('never repositions rename or alias ConceptName items', () => {
    const items = [rename('r'), aliasAdd('a'), mediaAdd('m')]

    expect(moveAddToFirst(items)).toEqual(items)
    expect(moveAddToLast(items)).toEqual(items)
    expect(moveDeleteToLast(items)).toEqual(items)
  })
})
