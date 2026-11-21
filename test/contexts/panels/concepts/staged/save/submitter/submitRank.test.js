import { describe, expect, it } from 'vitest'

import buildRankSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitRank'
import { updateConceptById } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

describe('buildRankSubmit', () => {
  it('sets the rank by concept id', () => {
    const op = { field: CONCEPT.FIELD.RANK, item: { action: CONCEPT_STATE.RANK, level: 'Species', name: 'species' } }
    const effective = { state: { id: 42, name: 'dingo' } }

    const submit = buildRankSubmit(op, effective)

    expect(submit.apiFn).toBe(updateConceptById)
    expect(submit.params).toEqual([42, { rankLevel: 'Species', rankName: 'species' }])
  })
})
