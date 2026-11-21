import { describe, expect, it } from 'vitest'

import { initialConceptState, isStateModified } from '@/lib/concept/state/state'

const concept = {
  id: 42,
  primaryNameId: 7,
  name: 'dingo',
  parent: 'root',
  children: [],
  aliases: [],
  alternateNames: [],
  media: [],
  realizations: [],
  references: [],
  templates: [],
}

describe('initialConceptState', () => {
  it('carries the concept id and primary name id alongside the field states', () => {
    const state = initialConceptState(concept, [])

    expect(state.id).toBe(42)
    expect(state.primaryNameId).toBe(7)
    expect(state.name.value).toBe('dingo')
  })

  it('does not report the identity keys as modifications', () => {
    const initialState = initialConceptState(concept, [])
    const stagedState = structuredClone(initialState)

    expect(isStateModified({ initialState, stagedState })).toBe(false)
  })
})
