import { describe, expect, it } from 'vitest'

import buildAliasSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitAliases'
import { createAlias } from '@/lib/api/aliases'
import { deleteConceptNameById, updateConceptNameById } from '@/lib/api/concept'
import { createEffectiveState } from '@/lib/concept/state/effectiveState'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const { ALIAS } = CONCEPT_STATE

const initialState = {
  id: 42,
  primaryNameId: 7,
  aliases: [{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }],
  author: { action: 'None', value: '' },
  children: [],
  media: [],
  name: { action: 'None', value: 'dingo', extent: '' },
  parent: { action: 'None', value: 'root' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  templates: [],
}

const effective = createEffectiveState(initialState, { applyImmediately: false })

describe('buildAliasSubmit', () => {
  it('adds an alias anchored on the current concept name', () => {
    const op = {
      action: ALIAS.ADD,
      field: CONCEPT.FIELD.ALIASES,
      index: 1,
      item: { name: 'fox', author: '', nameType: 'Common', action: ALIAS.ADD, index: 1, stagedSeq: 3 },
    }

    const submit = buildAliasSubmit(op, effective)

    expect(submit.apiFn).toBe(createAlias)
    expect(submit.params).toEqual({ author: '', nameType: 'Common', name: 'dingo', newName: 'fox' })
  })

  it('renames an alias by its id', () => {
    const op = {
      action: ALIAS.EDIT,
      field: CONCEPT.FIELD.ALIASES,
      index: 0,
      item: { id: 9, name: 'wolfie', author: '', nameType: 'Synonym', action: ALIAS.EDIT, index: 0, stagedSeq: 4 },
    }

    const submit = buildAliasSubmit(op, effective)

    expect(submit.apiFn).toBe(updateConceptNameById)
    expect(submit.params).toEqual([9, { newName: 'wolfie' }])
  })

  it('sends only the changed alias fields, keyed by the alias id', () => {
    const op = {
      action: ALIAS.EDIT,
      field: CONCEPT.FIELD.ALIASES,
      index: 0,
      item: { id: 9, name: 'wolf', author: 'B. Schlining', nameType: 'Synonym', action: ALIAS.EDIT, index: 0 },
    }

    const submit = buildAliasSubmit(op, effective)

    expect(submit.apiFn).toBe(updateConceptNameById)
    expect(submit.params).toEqual([9, { author: 'B. Schlining' }])
  })

  it('deletes an alias by its id', () => {
    const op = {
      action: ALIAS.DELETE,
      field: CONCEPT.FIELD.ALIASES,
      index: 0,
      item: { id: 9, name: 'wolf', author: '', nameType: 'Synonym', action: ALIAS.DELETE, index: 0 },
    }

    const submit = buildAliasSubmit(op, effective)

    expect(submit.apiFn).toBe(deleteConceptNameById)
    expect(submit.params).toBe(9)
  })
})
