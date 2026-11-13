import { describe, expect, it } from 'vitest'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import buildRealizationSubmit from '@/contexts/panels/concepts/staged/save/submitter/submitRealizations'
import { createEffectiveState } from '@/lib/concept/state/effectiveState'
import { buildStagedJournal } from '@/lib/concept/state/stagedJournal'
import * as realizations from '@/lib/concept/state/realizations'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState'

const { REALIZATION } = CONCEPT_STATE

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

describe('buildRealizationSubmit', () => {
  it('builds EDIT with the correct prior id after an add re-sorted the staged array', () => {
    const concept = {
      name: 'dingo',
      realizations: [
        { id: 11, linkName: 'zebra', toConcept: 'Zed', linkValue: 'z' },
        { id: 22, linkName: 'alpha', toConcept: 'Ay', linkValue: 'a' },
      ],
    }

    const initial = { ...baseStagedState, ...realizations.initialState(concept, []) }
    let staged = structuredClone(initial)

    staged = conceptStateReducer(staged, {
      type: REALIZATION.ADD,
      update: {
        realizationItem: { linkName: 'middle', toConcept: 'Em', linkValue: 'm' },
      },
      initialState: initial,
    })
    expect(staged.realizations.map(item => item.linkName)).toEqual(['alpha', 'middle', 'zebra'])

    const zebraRow = staged.realizations.find(item => item.linkName === 'zebra')
    staged = conceptStateReducer(staged, {
      type: REALIZATION.EDIT,
      update: {
        realizationStateId: zebraRow.stateId,
        realizationItem: { ...zebraRow, linkValue: 'z-edited' },
      },
      initialState: initial,
    })

    const ops = buildStagedJournal(initial, staged)
    const effective = createEffectiveState(initial, { applyImmediately: false })

    const addOp = ops.find(op => op.action === REALIZATION.ADD)
    const editOp = ops.find(op => op.action === REALIZATION.EDIT)

    expect(buildRealizationSubmit(addOp, effective).params).toEqual({
      linkName: 'middle',
      toConcept: 'Em',
      linkValue: 'm',
      concept: 'dingo',
    })

    expect(buildRealizationSubmit(editOp, effective).params).toEqual([11, { linkValue: 'z-edited' }])
    expect(addOp.field).toBe(CONCEPT.FIELD.REALIZATIONS)
  })

  it('builds DELETE with the staged item server id', () => {
    const concept = {
      name: 'dingo',
      realizations: [
        { id: 11, linkName: 'zebra', toConcept: 'Zed', linkValue: 'z' },
        { id: 22, linkName: 'alpha', toConcept: 'Ay', linkValue: 'a' },
      ],
    }

    const initial = { ...baseStagedState, ...realizations.initialState(concept, []) }
    let staged = structuredClone(initial)

    const alphaRow = staged.realizations.find(item => item.linkName === 'alpha')
    staged = conceptStateReducer(staged, {
      type: REALIZATION.DELETE,
      update: { realizationStateId: alphaRow.stateId },
      initialState: initial,
    })

    const ops = buildStagedJournal(initial, staged)
    const effective = createEffectiveState(initial, { applyImmediately: false })
    const deleteOp = ops.find(op => op.action === REALIZATION.DELETE)

    expect(buildRealizationSubmit(deleteOp, effective).params).toBe(22)
  })
})
