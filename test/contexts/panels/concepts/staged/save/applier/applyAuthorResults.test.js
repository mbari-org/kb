import { describe, expect, it } from 'vitest'

import applyAuthorResults from '@/contexts/panels/concepts/staged/save/applier/applyAuthorResults'

const nameResponse = author => ({
  names: [
    { id: 1, name: 'Rhincodon typus', nameType: 'primary', author },
    { id: 3, name: 'Whale shark', nameType: 'common', author: '' },
  ],
})

describe('applyAuthorResults', () => {
  it('takes the author of the primary name from the names response, not the request', () => {
    const concept = { author: 'Old' }

    applyAuthorResults({
      concept,
      result: { update: { author: 'Requested' }, response: nameResponse('Server') },
    })

    expect(concept.author).toBe('Server')
  })

  it('stores a cleared author as the server returns it', () => {
    const concept = { author: 'Old' }

    applyAuthorResults({
      concept,
      result: { update: { author: '' }, response: nameResponse(null) },
    })

    expect(concept.author).toBeNull()
  })
})
