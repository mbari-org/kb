import { describe, expect, it } from 'vitest'

import applyRankResults from '@/contexts/panels/concepts/staged/save/applier/applyRankResults'

describe('applyRankResults', () => {
  it('takes the rank from the server response, not the request', () => {
    const concept = { rankLevel: '', rankName: '' }

    applyRankResults({
      concept,
      result: {
        update: { rankLevel: 'Genus', rankName: 'Genus' },
        response: { rankLevel: 'Species', rankName: 'species' },
      },
    })

    expect(concept).toEqual({ rankLevel: 'Species', rankName: 'species' })
  })

  it('stores a cleared rank as the server returns it', () => {
    const concept = { rankLevel: 'Species', rankName: 'species' }

    applyRankResults({
      concept,
      result: { update: { rankLevel: '', rankName: '' }, response: { rankLevel: null, rankName: null } },
    })

    expect(concept).toEqual({ rankLevel: null, rankName: null })
  })
})
