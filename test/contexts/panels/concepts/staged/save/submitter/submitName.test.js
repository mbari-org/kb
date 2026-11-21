import { describe, expect, it } from 'vitest'

import buildNameSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitName'
import { updateConceptNameById } from '@/lib/api/concept'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

describe('buildNameSubmit', () => {
  it('renames the primary concept name by its id', () => {
    const op = { field: CONCEPT.FIELD.NAME, item: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '' } }
    const effective = { state: { name: 'dingo', primaryNameId: 7 } }

    const submit = buildNameSubmit(op, effective)

    expect(submit.apiFn).toBe(updateConceptNameById)
    expect(submit.params).toEqual([7, { newName: 'wolf' }])
  })
})
