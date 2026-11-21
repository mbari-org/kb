import { describe, expect, it } from 'vitest'

import applyAliasResults from '@/contexts/panels/concepts/staged/save/applier/applyAliasResults'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ALIAS } = CONCEPT_STATE

const namesWith = aliasNames => [{ id: 1, name: 'dingo', nameType: 'primary', author: '' }, ...aliasNames]

const buildConcept = () => ({
  name: 'dingo',
  primaryNameId: 1,
  author: '',
  aliases: [{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }],
  alternateNames: ['wolf'],
})

describe('applyAliasResults', () => {
  it('takes the aliases, including the new alias id, from the add response', () => {
    const concept = buildConcept()

    applyAliasResults({
      concept,
      result: {
        action: ALIAS.ADD,
        update: { author: '', name: 'fox', nameType: 'Common' },
        response: {
          names: namesWith([
            { id: 9, name: 'wolf', nameType: 'synonym', author: '' },
            { id: 11, name: 'fox', nameType: 'common', author: '' },
          ]),
        },
      },
    })

    expect(concept.aliases).toEqual([
      { id: 11, name: 'fox', author: '', nameType: 'Common' },
      { id: 9, name: 'wolf', author: '', nameType: 'Synonym' },
    ])
    expect(concept.alternateNames).toEqual(['fox', 'wolf'])
  })

  it('takes an edited alias from the server response, not the request', () => {
    const concept = buildConcept()

    applyAliasResults({
      concept,
      result: {
        action: ALIAS.EDIT,
        params: [9, { newName: 'wolfie', author: 'Requested' }],
        response: { names: namesWith([{ id: 9, name: 'wolfie', nameType: 'synonym', author: 'B. Schlining' }]) },
      },
    })

    expect(concept.aliases).toEqual([{ id: 9, name: 'wolfie', author: 'B. Schlining', nameType: 'Synonym' }])
    expect(concept.alternateNames).toEqual(['wolfie'])
  })

  it('removes a deleted alias when the server response no longer lists it', () => {
    const concept = buildConcept()

    applyAliasResults({
      concept,
      result: { action: ALIAS.DELETE, params: 9, response: { names: namesWith([]) } },
    })

    expect(concept.aliases).toEqual([])
    expect(concept.alternateNames).toEqual([])
  })

  it('keeps an alias that a maintainer only marked for deletion', () => {
    const concept = buildConcept()

    applyAliasResults({
      concept,
      result: {
        action: ALIAS.DELETE,
        params: 9,
        response: { names: namesWith([{ id: 9, name: 'wolf', nameType: 'synonym', author: '' }]) },
      },
    })

    expect(concept.aliases).toEqual([{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }])
    expect(concept.alternateNames).toEqual(['wolf'])
  })
})
