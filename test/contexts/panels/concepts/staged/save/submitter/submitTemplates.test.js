import { describe, expect, it } from 'vitest'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import buildTemplateSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitTemplates'
import { createEffectiveState } from '@/lib/concept/state/effectiveState'
import { buildStagedJournal } from '@/lib/concept/state/stagedJournal'
import * as templates from '@/lib/concept/state/templates'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'

const { TEMPLATE } = CONCEPT_STATE

const baseStagedState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: 'dingo', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

describe('buildTemplateSubmit', () => {
  it('builds ADD, EDIT, and DELETE calls from staged template operations', () => {
    const concept = {
      templates: [
        { id: 11, concept: 'dingo', linkName: 'eats', toConcept: 'squid', linkValue: 'x' },
        { id: 22, concept: 'dingo', linkName: 'chases', toConcept: 'ball', linkValue: 'y' },
      ],
    }
    const initial = { ...baseStagedState, ...templates.initialState(concept, []) }
    const eats = initial.templates.find(item => item.id === 11)
    const chases = initial.templates.find(item => item.id === 22)

    let staged = structuredClone(initial)
    staged = conceptStateReducer(staged, {
      type: TEMPLATE.EDIT,
      update: { templateStateId: eats.stateId, templateItem: { ...eats, linkValue: 'edited' } },
      initialState: initial,
    })
    staged = conceptStateReducer(staged, {
      type: TEMPLATE.DELETE,
      update: { templateStateId: chases.stateId },
      initialState: initial,
    })
    staged = conceptStateReducer(staged, {
      type: TEMPLATE.ADD,
      update: { templateItem: { concept: 'dingo', linkName: 'likes', toConcept: 'fish', linkValue: 'z' } },
      initialState: initial,
    })

    const ops = buildStagedJournal(initial, staged)
    const effective = createEffectiveState(initial, { applyImmediately: false })
    const addOp = ops.find(op => op.action === TEMPLATE.ADD)
    const editOp = ops.find(op => op.action === TEMPLATE.EDIT)
    const deleteOp = ops.find(op => op.action === TEMPLATE.DELETE)

    expect(addOp.field).toBe(CONCEPT.FIELD.TEMPLATES)
    expect(buildTemplateSubmit(addOp, effective).params).toEqual({
      concept: 'dingo',
      linkName: 'likes',
      toConcept: 'fish',
      linkValue: 'z',
    })
    expect(buildTemplateSubmit(editOp, effective).params).toEqual([11, { linkValue: 'edited' }])
    expect(buildTemplateSubmit(deleteOp, effective).params).toBe(22)
  })
})
