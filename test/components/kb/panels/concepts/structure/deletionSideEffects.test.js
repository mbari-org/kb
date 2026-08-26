import { describe, expect, it, vi } from 'vitest'

import { preSideEffects } from '@/components/kb/panels/concepts/concept/change/staged/name/delete/deletionSideEffects'
import { RELATED_DATA_COUNTS } from '@/components/kb/panels/concepts/concept/change/staged/name/relatedDataCounts'
import { createRealization } from '@/lib/api/realizations'

describe('deletionSideEffects preSideEffects', () => {
  it('recreates explicitly defined realizations on the reassigned concept if not already existing', async () => {
    const createdPayloads = []
    const apiFns = {
      apiPayload: vi.fn(async (apiFn, payload) => {
        if (apiFn === createRealization) {
          createdPayloads.push(payload)
          return { id: 100, ...payload }
        }
        return {}
      }),
    }

    const concept = {
      name: 'OldConcept',
      realizations: [
        { id: 1, concept: 'OldConcept', linkName: 'sample-link', linkValue: 'nil', toConcept: 'TargetConcept' },
        { id: 2, concept: 'OldConcept', linkName: 'self-link', linkValue: 'nil', toConcept: 'OldConcept' },
        { id: 3, concept: 'OldConcept', linkName: 'existing-link', linkValue: 'val', toConcept: 'ReassignedConcept' },
      ],
    }

    const realizations = [
      ...concept.realizations,
      { id: 4, concept: 'ReassignedConcept', linkName: 'existing-link', linkValue: 'val', toConcept: 'ReassignedConcept' },
    ]

    const relatedDataCounts = [
      { title: RELATED_DATA_COUNTS.REALIZATIONS, value: 3 },
    ]

    const deleteConceptContext = {
      apiFns,
      concept,
      realizations,
      reassign: 'ReassignedConcept',
      relatedDataCounts,
      templates: [],
    }

    const results = await preSideEffects(deleteConceptContext)

    expect(createdPayloads).toEqual([
      { concept: 'ReassignedConcept', linkName: 'sample-link', linkValue: 'nil', toConcept: 'TargetConcept' },
      { concept: 'ReassignedConcept', linkName: 'self-link', linkValue: 'nil', toConcept: 'ReassignedConcept' },
    ])
    expect(results[RELATED_DATA_COUNTS.REALIZATIONS]).toHaveLength(2)
  })
})
