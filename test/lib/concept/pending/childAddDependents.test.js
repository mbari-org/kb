import { describe, expect, it } from 'vitest'

import { implicitDeleteRejects, withDependents } from '@/lib/concept/pending/childAddDependents'

import { PENDING } from '@/lib/constants/pending.js'

const addItem = {
  id: 'add',
  concept: 'data file',
  field: 'Concept.child',
  action: 'Add',
  newValue: 'spin',
  recordedName: 'spinning',
}
const parentEdit = {
  id: 'parent',
  concept: 'spin',
  field: 'Concept.parent',
  action: 'Edit',
  oldValue: 'data file',
  newValue: 'behavior',
}
const rename = {
  id: 'rename',
  concept: 'spin',
  field: 'ConceptName',
  action: 'Edit',
  oldValue: 'spinning',
  newValue: 'spin',
}
const alias = { id: 'alias', concept: 'spin', field: 'ConceptName', action: 'Add', newValue: 'whirling dervish' }
const unrelatedAdd = {
  id: 'other-add',
  concept: 'data file',
  field: 'Concept.child',
  action: 'Add',
  newValue: 'dolphin',
  recordedName: 'dolphin',
}
const unrelatedParentEdit = {
  id: 'other-parent',
  concept: 'dolphin',
  field: 'Concept.parent',
  action: 'Edit',
  oldValue: 'data file',
  newValue: 'behavior',
}
const pendingHistory = [addItem, alias, parentEdit, rename, unrelatedAdd, unrelatedParentEdit]

describe('withDependents when rejecting an Add Child', () => {
  it('places the parent change and rename of a renamed child ahead of its rejected add', () => {
    expect(withDependents(PENDING.APPROVAL.REJECT, [addItem], pendingHistory)).toEqual([parentEdit, rename, addItem])
  })

  it('does not repeat dependents that are already selected', () => {
    expect(withDependents(PENDING.APPROVAL.REJECT, [parentEdit, addItem], pendingHistory)).toEqual([
      rename,
      parentEdit,
      addItem,
    ])
  })

  it('adds nothing when the child has no later parent change or rename', () => {
    const plainAdd = { ...unrelatedAdd, id: 'plain-add' }
    expect(withDependents(PENDING.APPROVAL.REJECT, [plainAdd], [plainAdd, alias])).toEqual([plainAdd])
  })
})

describe('withDependents when approving a rename', () => {
  it('adds the older Add Child that names the old name, ahead of the rename', () => {
    expect(withDependents(PENDING.APPROVAL.ACCEPT, [rename], pendingHistory)).toEqual([addItem, rename])
  })

  it('adds nothing when no Add Child names the old name', () => {
    expect(withDependents(PENDING.APPROVAL.ACCEPT, [rename], [rename, unrelatedAdd])).toEqual([rename])
  })
})

describe('withDependents when approving a child delete', () => {
  it('adds the pending add of that child, ahead of the delete', () => {
    const dolphinDelete = { id: 'dolphin-delete', concept: 'object', field: 'Concept.child', action: 'Delete', oldValue: 'dolphin' }
    expect(withDependents(PENDING.APPROVAL.ACCEPT, [dolphinDelete], [unrelatedAdd, dolphinDelete])).toEqual([
      unrelatedAdd,
      dolphinDelete,
    ])
  })
})

describe('withDependents when approving an Add Child', () => {
  it('leaves the items unchanged', () => {
    expect(withDependents(PENDING.APPROVAL.ACCEPT, [addItem], pendingHistory)).toEqual([addItem])
  })
})

describe('implicitDeleteRejects', () => {
  const spinDelete = { id: 'spin-delete', concept: 'data file', field: 'Concept.child', action: 'Delete', oldValue: 'spin' }
  const otherParentDelete = { id: 'other-delete', concept: 'object', field: 'Concept.child', action: 'Delete', oldValue: 'spin' }

  it('returns the pending delete of the approved add child under the same parent', () => {
    expect(implicitDeleteRejects(PENDING.APPROVAL.ACCEPT, [addItem], [addItem, otherParentDelete, spinDelete])).toEqual([
      spinDelete,
    ])
  })

  it('returns nothing when approving a delete or rejecting an add', () => {
    expect(implicitDeleteRejects(PENDING.APPROVAL.ACCEPT, [spinDelete], [addItem, spinDelete])).toEqual([])
    expect(implicitDeleteRejects(PENDING.APPROVAL.REJECT, [addItem], [addItem, spinDelete])).toEqual([])
  })
})
