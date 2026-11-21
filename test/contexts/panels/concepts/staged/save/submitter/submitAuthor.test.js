import { describe, expect, it } from 'vitest'

import buildAuthorSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitAuthor'
import { updateConceptNameById } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

describe('buildAuthorSubmit', () => {
  it('sets the primary concept name author by its id', () => {
    const op = { field: CONCEPT.FIELD.AUTHOR, item: { action: CONCEPT_STATE.AUTHOR, value: 'B. Schlining' } }
    const effective = { state: { name: 'dingo', primaryNameId: 7 } }

    const submit = buildAuthorSubmit(op, effective)

    expect(submit.apiFn).toBe(updateConceptNameById)
    expect(submit.params).toEqual([7, { author: 'B. Schlining' }])
  })
})
