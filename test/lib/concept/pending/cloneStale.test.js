import { describe, expect, it, vi } from 'vitest'

import { getConceptByName } from '@/lib/api/concept'
import { cloneStale } from '@/lib/concept/pending/cloneStale'

const staleConcept = {
  aliases: [{ author: '', name: 'Whale shark', nameType: 'Common' }],
  alternateNames: ['Whale shark'],
  children: [],
  id: 7,
  media: [],
  name: 'Rhincodon typus',
  parent: 'Rhincodon',
  primaryNameId: 1,
  rankLevel: 10,
  rankName: 'Species',
  templates: [],
}

describe('cloneStale', () => {
  it('keeps the concept id and primary name id on a local clone', async () => {
    const apiFns = { apiPayload: vi.fn() }

    const freshConcept = await cloneStale(apiFns, staleConcept, false)

    expect(apiFns.apiPayload).not.toHaveBeenCalled()
    expect(freshConcept.id).toBe(7)
    expect(freshConcept.primaryNameId).toBe(1)
  })

  it('keeps the concept id and primary name id when the server base is re-read', async () => {
    const apiFns = { apiPayload: vi.fn(async () => ({ name: 'Rhincodon typus', parent: 'Rhincodon' })) }

    const freshConcept = await cloneStale(apiFns, staleConcept)

    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptByName, 'Rhincodon typus')
    expect(freshConcept.id).toBe(7)
    expect(freshConcept.primaryNameId).toBe(1)
  })
})
