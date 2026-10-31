import { describe, expect, it } from 'vitest'

import applyRealizationResults from '@/contexts/panels/concepts/staged/save/applier/applyRealizationResults'

import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { REALIZATION } = CONCEPT_STATE

const EXISTING = { id: 7, linkName: 'eats', toConcept: 'fish', linkValue: 'daily' }
const OTHER = { id: 9, linkName: 'lives-near', toConcept: 'reef', linkValue: 'often' }

const buildConcept = () => ({ name: 'dingo', realizations: [{ ...EXISTING }, { ...OTHER }] })

describe('applyRealizationResults', () => {
  it('ADD appends the created realization from the response and keeps realizations sorted', () => {
    const concept = buildConcept()
    const result = {
      action: REALIZATION.ADD,
      params: { linkName: 'hunts', toConcept: 'rabbit', linkValue: 'nightly', concept: 'dingo' },
      response: { id: 11, linkName: 'hunts', toConcept: 'rabbit', linkValue: 'nightly' },
    }

    applyRealizationResults({ concept, isAdmin: true, result })

    expect(concept.realizations).toEqual([
      EXISTING,
      { id: 11, linkName: 'hunts', toConcept: 'rabbit', linkValue: 'nightly' },
      OTHER,
    ])
  })

  it('ADD falls back to the submitted params when the response has no id', () => {
    const concept = buildConcept()
    const result = {
      action: REALIZATION.ADD,
      params: { linkName: 'hunts', toConcept: 'rabbit', linkValue: 'nightly', concept: 'dingo' },
      response: null,
    }

    applyRealizationResults({ concept, isAdmin: true, result })

    expect(concept.realizations).toEqual([
      EXISTING,
      { linkName: 'hunts', toConcept: 'rabbit', linkValue: 'nightly' },
      OTHER,
    ])
  })

  it('EDIT merges the updates into the matching realization and re-sorts', () => {
    const concept = buildConcept()
    const result = {
      action: REALIZATION.EDIT,
      params: [EXISTING.id, { linkName: 'zebra' }],
    }

    applyRealizationResults({ concept, isAdmin: true, result })

    expect(concept.realizations).toEqual([OTHER, { ...EXISTING, linkName: 'zebra' }])
  })

  it('DELETE removes the realization by id for an admin', () => {
    const concept = buildConcept()
    const result = {
      action: REALIZATION.DELETE,
      params: EXISTING.id,
    }

    applyRealizationResults({ concept, isAdmin: true, result })

    expect(concept.realizations).toEqual([OTHER])
  })

  it('DELETE keeps the realization for a non-admin so it can be marked pending', () => {
    const concept = buildConcept()
    const result = {
      action: REALIZATION.DELETE,
      params: EXISTING.id,
    }

    applyRealizationResults({ concept, isAdmin: false, result })

    expect(concept.realizations).toEqual([EXISTING, OTHER])
  })
})
