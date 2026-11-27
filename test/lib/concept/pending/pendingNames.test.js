import { describe, expect, it } from 'vitest'

import { withCurrentChildNames } from '@/lib/concept/pending/pendingNames'

const rename = {
  id: 'rename',
  concept: 'spin',
  field: 'ConceptName',
  action: 'Edit',
  oldValue: 'spinning',
  newValue: 'spin',
}
const childAdd = { id: 'add', concept: 'data file', field: 'Concept.child', action: 'Add', newValue: 'spinning' }
const otherAdd = { id: 'other', concept: 'data file', field: 'Concept.child', action: 'Add', newValue: 'dolphin' }

describe('withCurrentChildNames', () => {
  it('gives a renamed child add its current name and keeps the recorded name', () => {
    expect(withCurrentChildNames([rename, childAdd])[1]).toEqual({
      ...childAdd,
      newValue: 'spin',
      recordedName: 'spinning',
    })
  })

  it('records the stored name for a child add without a rename', () => {
    expect(withCurrentChildNames([otherAdd])[0]).toEqual({ ...otherAdd, recordedName: 'dolphin' })
  })

  it('leaves other rows as they are', () => {
    expect(withCurrentChildNames([rename])[0]).toBe(rename)
  })
})
