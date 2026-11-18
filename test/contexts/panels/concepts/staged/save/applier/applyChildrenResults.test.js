import { describe, expect, it } from 'vitest'

import applyChildrenResults from '@/contexts/panels/concepts/staged/save/applier/applyChildrenResults'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

describe('applyChildrenResults', () => {
  it('adds children in case-insensitive order', () => {
    const concept = { children: ['alpha', 'zebra'] }

    applyChildrenResults({
      concept,
      result: {
        action: CONCEPT_STATE.CHILD.ADD,
        response: { name: 'Beta' },
      },
    })

    expect(concept.children).toEqual(['alpha', 'Beta', 'zebra'])
  })
})
