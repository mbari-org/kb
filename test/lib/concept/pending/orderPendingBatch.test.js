import { describe, expect, it } from 'vitest'

import orderPendingBatch from '@/lib/concept/pending/orderPendingBatch'

import { PENDING } from '@/lib/constants/pending.js'

const add = { id: 'add', field: 'Concept.child', action: 'Add', creationTimestamp: '2026-11-26T12:07:00Z' }
const parentEdit = { id: 'parent', field: 'Concept.parent', action: 'Edit', creationTimestamp: '2026-11-26T12:20:00Z' }
const rename = { id: 'rename', field: 'ConceptName', action: 'Edit', creationTimestamp: '2026-11-26T12:22:00Z' }

describe('orderPendingBatch', () => {
  it('approves in creation order with the add first', () => {
    expect(orderPendingBatch(PENDING.APPROVAL.ACCEPT, [rename, add, parentEdit])).toEqual([add, parentEdit, rename])
  })

  it('rejects newest first with the add last', () => {
    expect(orderPendingBatch(PENDING.APPROVAL.REJECT, [add, rename, parentEdit])).toEqual([rename, parentEdit, add])
  })
})
