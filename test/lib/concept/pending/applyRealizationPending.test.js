import { describe, expect, it } from 'vitest'

import { applyApprovals } from '@/lib/concept/pending/applyApproves'
import { applyRejects } from '@/lib/concept/pending/applyRejects'
import { ACTION } from '@/lib/constants'
import { HISTORY_FIELD } from '@/lib/constants/historyField.js'

const baseConcept = () => ({
  name: 'dino',
  realizations: [{ linkName: 'eats', toConcept: 'fish', linkValue: 'self' }],
})

describe('realization pending applyApprovals / applyRejects (concept untouched; realizations reload via panel data)', () => {
  it('approves DELETE without mutating the concept', () => {
    const concept = baseConcept()
    applyApprovals(concept, [
      {
        action: ACTION.DELETE,
        field: HISTORY_FIELD.REALIZATION,
        oldValue: 'eats | fish | 1',
        newValue: null,
      },
    ])

    expect(concept).toEqual(baseConcept())
  })

  it('rejects DELETE without mutating the concept', () => {
    const concept = baseConcept()
    applyRejects(concept, [
      {
        action: ACTION.DELETE,
        field: HISTORY_FIELD.REALIZATION,
        oldValue: 'eats | fish | 1',
        newValue: null,
      },
    ])

    expect(concept).toEqual(baseConcept())
  })
})
