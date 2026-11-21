import { describe, expect, it } from 'vitest'

import applyUpdateResults from '@/contexts/panels/concepts/staged/save/applyUpdateResults'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ALIAS } = CONCEPT_STATE

const staleConcept = {
  name: 'dingo',
  primaryNameId: 1,
  author: '',
  aliases: [{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }],
  alternateNames: ['wolf'],
  children: [],
  parent: 'root',
  rankLevel: '',
  rankName: '',
}

const namesAfterAliasAdd = [
  { id: 1, name: 'dingo', nameType: 'primary', author: '' },
  { id: 9, name: 'wolf', nameType: 'synonym', author: '' },
  { id: 11, name: 'fox', nameType: 'common', author: '' },
]

const namesAfterRename = [
  { id: 1, name: 'dingo-renamed', nameType: 'primary', author: '' },
  { id: 9, name: 'wolf', nameType: 'synonym', author: '' },
]

const namesAfterRenameAndAdd = [
  { id: 1, name: 'dingo-renamed', nameType: 'primary', author: '' },
  { id: 9, name: 'wolf', nameType: 'synonym', author: '' },
  { id: 11, name: 'fox', nameType: 'common', author: '' },
]

const aliasAdd = response => ({
  action: ALIAS.ADD,
  field: CONCEPT.FIELD.ALIASES,
  update: { author: '', name: 'fox', nameType: 'Common' },
  response,
})

const rename = response => ({
  action: CONCEPT_STATE.NAME,
  field: CONCEPT.FIELD.NAME,
  update: { value: 'dingo-renamed' },
  response,
})

const applyResults = async results => {
  const freshConcept = structuredClone(staleConcept)
  await applyUpdateResults({ freshConcept, isAdmin: true, staleConcept, updatesInfo: { results } })
  return freshConcept
}

describe('applyUpdateResults', () => {
  it('keeps an alias added before a rename, because the rename response includes it', async () => {
    const freshConcept = await applyResults([
      aliasAdd({ names: namesAfterAliasAdd }),
      rename({ names: namesAfterRenameAndAdd }),
    ])

    expect(freshConcept.name).toBe('dingo-renamed')
    expect(freshConcept.aliases.map(alias => [alias.id, alias.name])).toEqual([
      [11, 'fox'],
      [9, 'wolf'],
    ])
    expect(freshConcept.alternateNames).toEqual(['fox', 'wolf'])
  })

  it('keeps an alias added after a rename, because the add response carries the renamed primary name', async () => {
    const freshConcept = await applyResults([
      rename({ names: namesAfterRename }),
      aliasAdd({ names: namesAfterRenameAndAdd }),
    ])

    expect(freshConcept.name).toBe('dingo-renamed')
    expect(freshConcept.aliases.map(alias => [alias.id, alias.name])).toEqual([
      [11, 'fox'],
      [9, 'wolf'],
    ])
    expect(freshConcept.alternateNames).toEqual(['fox', 'wolf'])
  })

  it('takes the rank and author from the server responses', async () => {
    const freshConcept = structuredClone(staleConcept)

    await applyUpdateResults({
      freshConcept,
      isAdmin: true,
      staleConcept,
      updatesInfo: {
        results: [
          {
            action: CONCEPT_STATE.RANK,
            field: CONCEPT.FIELD.RANK,
            update: { rankLevel: 'Genus', rankName: 'Genus' },
            response: { rankLevel: 'Species', rankName: 'species' },
          },
          {
            action: CONCEPT_STATE.AUTHOR,
            field: CONCEPT.FIELD.AUTHOR,
            update: { author: 'Requested' },
            response: { names: [{ id: 1, name: 'dingo', nameType: 'primary', author: 'Server' }] },
          },
        ],
      },
    })

    expect(freshConcept.rankLevel).toBe('Species')
    expect(freshConcept.rankName).toBe('species')
    expect(freshConcept.author).toBe('Server')
  })
})
