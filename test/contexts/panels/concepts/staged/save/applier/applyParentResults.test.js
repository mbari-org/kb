import { describe, expect, it } from 'vitest'

import applyParentResults from '@/contexts/panels/concepts/staged/save/applier/applyParentResults'

describe('applyParentResults', () => {
  it('takes the accepted parent name, because the move response carries no parent', () => {
    const concept = { parent: 'old-parent' }

    applyParentResults({
      concept,
      result: { update: { parentName: 'new-parent' }, response: { id: 42, name: 'dingo' } },
    })

    expect(concept.parent).toBe('new-parent')
  })
})
