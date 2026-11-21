import { describe, expect, it } from 'vitest'

import applyAliasResults from '@/contexts/panels/concepts/staged/save/applier/applyAliasResults'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ALIAS } = CONCEPT_STATE

const buildConcept = () => ({
  aliases: [{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }],
  alternateNames: ['wolf'],
})

const response = {
  names: [
    { id: 1, name: 'dingo', nameType: 'primary' },
    { id: 9, name: 'wolf', nameType: 'synonym' },
    { id: 11, name: 'fox', nameType: 'common' },
  ],
}

describe('applyAliasResults', () => {
  it('adds a created alias with the server id from the add response', () => {
    const concept = buildConcept()

    applyAliasResults({
      concept,
      isAdmin: true,
      result: { action: ALIAS.ADD, update: { author: '', name: 'fox', nameType: 'Common' }, response },
    })

    expect(concept.aliases).toEqual([
      { id: 9, name: 'wolf', author: '', nameType: 'Synonym' },
      { id: 11, author: '', name: 'fox', nameType: 'Common' },
    ])
    expect(concept.alternateNames).toEqual(['wolf', 'fox'])
  })

  it('edits an alias matched by id and keeps the alternate names in step', () => {
    const concept = buildConcept()

    applyAliasResults({
      concept,
      isAdmin: false,
      result: { action: ALIAS.EDIT, params: [9, { newName: 'wolfie', author: 'B. Schlining' }] },
    })

    expect(concept.aliases).toEqual([{ id: 9, name: 'wolfie', author: 'B. Schlining', nameType: 'Synonym' }])
    expect(concept.alternateNames).toEqual(['wolfie'])
  })

  it('removes an alias by id only for administrators', () => {
    const admin = buildConcept()
    applyAliasResults({ concept: admin, isAdmin: true, result: { action: ALIAS.DELETE, params: 9 } })
    expect(admin.aliases).toEqual([])
    expect(admin.alternateNames).toEqual([])

    const maintainer = buildConcept()
    applyAliasResults({ concept: maintainer, isAdmin: false, result: { action: ALIAS.DELETE, params: 9 } })
    expect(maintainer.aliases).toEqual([{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }])
    expect(maintainer.alternateNames).toEqual(['wolf'])
  })
})
