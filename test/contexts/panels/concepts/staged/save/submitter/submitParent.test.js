import { describe, expect, it } from 'vitest'

import buildParentSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitParent'
import { updateConceptById } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

describe('buildParentSubmit', () => {
  it('moves the concept by its id', () => {
    const op = { field: CONCEPT.FIELD.PARENT, item: { action: CONCEPT_STATE.PARENT, value: 'object' } }
    const effective = { state: { id: 42, name: 'dingo', parent: 'root' } }

    const submit = buildParentSubmit(op, effective)

    expect(submit.apiFn).toBe(updateConceptById)
    expect(submit.params).toEqual([42, { parentName: 'object' }])
  })
})
