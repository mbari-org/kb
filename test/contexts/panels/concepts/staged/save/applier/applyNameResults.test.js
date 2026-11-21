import { describe, expect, it } from 'vitest'

import applyNameResults from '@/contexts/panels/concepts/staged/save/applier/applyNameResults'

const response = {
  names: [
    { id: 1, name: 'Rhincodon typus Smith', nameType: 'primary', author: 'Smith 1839' },
    { id: 3, name: 'Whale shark', nameType: 'common', author: '' },
    { id: 6, name: 'Rhincodon alt', nameType: 'alternate', author: '' },
  ],
}

describe('applyNameResults', () => {
  it('rebuilds the name, primary name id, author, aliases, and alternate names from the rename response', () => {
    const concept = {
      name: 'Rhincodon typus',
      primaryNameId: 1,
      author: null,
      aliases: [],
      alternateNames: ['Rhincodon typus'],
    }

    applyNameResults({
      concept,
      result: { update: { value: 'Rhincodon typus Smith' }, response },
    })

    expect(concept).toEqual({
      name: 'Rhincodon typus Smith',
      primaryNameId: 1,
      author: 'Smith 1839',
      aliases: [{ id: 3, name: 'Whale shark', nameType: 'Common', author: '' }],
      alternateNames: ['Rhincodon alt', 'Whale shark'],
    })
  })
})
