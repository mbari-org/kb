import { describe, expect, it } from 'vitest'

import { snapshotFromRawConcept } from '@/lib/model/aliases'

const rawConcept = {
  id: 42,
  names: [
    { id: 3, name: 'Whale shark', nameType: 'common', author: '' },
    { id: 1, name: 'Rhincodon typus', nameType: 'primary', author: 'Smith 1839' },
    { id: 4, name: 'Rhincodon pacificus', nameType: 'synonym', author: null },
    { id: 5, name: 'Rhineodon', nameType: 'former', author: null },
    { id: 6, name: 'Rhincodon alt', nameType: 'alternate', author: null },
  ],
}

describe('snapshotFromRawConcept', () => {
  it('takes the primary name, author, and ordered aliases from the names response', () => {
    const snapshot = snapshotFromRawConcept(rawConcept)

    expect(snapshot.name).toBe('Rhincodon typus')
    expect(snapshot.primaryNameId).toBe(1)
    expect(snapshot.author).toBe('Smith 1839')
    expect(snapshot.aliases.map(alias => [alias.id, alias.name, alias.nameType])).toEqual([
      [3, 'Whale shark', 'Common'],
      [4, 'Rhincodon pacificus', 'Synonym'],
      [5, 'Rhineodon', 'Former'],
    ])
  })

  it('lists every non-primary name as an alternate name, including the types aliases omit', () => {
    const snapshot = snapshotFromRawConcept(rawConcept)

    expect(snapshot.alternateNames).toEqual(['Rhincodon alt', 'Rhincodon pacificus', 'Rhineodon', 'Whale shark'])
  })
})
