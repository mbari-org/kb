import { describe, expect, it } from 'vitest'

import applyUpdateResults from '@/contexts/panels/concepts/staged/save/applyUpdateResults'

import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { REALIZATION } = CONCEPT_STATE

const buildStaleConcept = () => ({
  name: 'dingo',
  aliases: [],
  alternateNames: [],
  children: [],
  parent: 'canid',
  realizations: [{ id: 7, linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }],
})

const buildFreshConcept = () => ({
  name: 'dingo',
  aliases: [],
  alternateNames: [],
  children: [],
  parent: 'canid',
  media: [],
  realizations: [],
})

describe('applyUpdateResults', () => {
  it('bases realizations on the local stale concept rather than the refetched concept', async () => {
    const staleConcept = buildStaleConcept()
    const freshConcept = buildFreshConcept()
    const updatesInfo = { results: [] }

    await applyUpdateResults({ freshConcept, isAdmin: true, staleConcept, updatesInfo })

    expect(freshConcept.realizations).toEqual(staleConcept.realizations)
    expect(freshConcept.realizations).not.toBe(staleConcept.realizations)
  })

  it('applies realization results on top of the local realizations', async () => {
    const staleConcept = buildStaleConcept()
    const freshConcept = buildFreshConcept()
    const updatesInfo = {
      results: [
        {
          field: CONCEPT.FIELD.REALIZATIONS,
          action: REALIZATION.EDIT,
          params: [7, { linkValue: 'weekly' }],
        },
      ],
    }

    await applyUpdateResults({ freshConcept, isAdmin: true, staleConcept, updatesInfo })

    expect(freshConcept.realizations).toEqual([{ id: 7, linkName: 'eats', toConcept: 'fish', linkValue: 'weekly' }])
  })
})
