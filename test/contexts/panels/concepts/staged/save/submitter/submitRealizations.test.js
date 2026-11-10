import { describe, expect, it, vi } from 'vitest'

import conceptStateReducer from '@/contexts/panels/concepts/staged/edit/conceptStateReducer'
import { stateUpdatesInfo } from '@/contexts/panels/concepts/staged/edit/stateUpdates'
import submitRealizations from '@/contexts/panels/concepts/staged/save/submitter/submitRealizations'
import * as realizations from '@/lib/concept/state/realizations'
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
  name: { action: 'None', value: '', extent: '' },
  parent: { action: 'None', value: '' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

describe('submitRealizations', () => {
  it('submits EDIT with the correct prior id and diff after an add re-sorted the staged array', async () => {
    // Server order (zebra first) differs from display sort order (alpha first)
    const concept = {
      name: 'dingo',
      realizations: [
        { id: 11, linkName: 'zebra', toConcept: 'Zed', linkValue: 'z' },
        { id: 22, linkName: 'alpha', toConcept: 'Ay', linkValue: 'a' },
      ],
    }

    const initial = { ...baseStagedState, ...realizations.initialState(concept, []) }
    let staged = structuredClone(initial)

    // The added realization sorts into the middle of the staged array,
    // shifting the positional index of zebra from 0 (server order) to 2
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

    const updatesInfo = stateUpdatesInfo(initial, staged)
    const submit = vi.fn(() => Promise.resolve({ ok: true }))

    const results = await Promise.all(submitRealizations([submit, { concept, updatesInfo }]).map(submitOne => submitOne()))

    const addResult = results.find(result => result.action === REALIZATION.ADD)
    expect(addResult.error).toBeUndefined()
    expect(addResult.params).toEqual({
      linkName: 'middle',
      toConcept: 'Em',
      linkValue: 'm',
      concept: 'dingo',
    })

    const editResult = results.find(result => result.action === REALIZATION.EDIT)
    expect(editResult.error).toBeUndefined()
    // zebra's server id is 11; a positional pairing would have used alpha's id 22
    expect(editResult.params).toEqual([11, { linkValue: 'z-edited' }])
  })

  it('submits DELETE with the staged item server id', async () => {
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

    const updatesInfo = stateUpdatesInfo(initial, staged)
    const submit = vi.fn(() => Promise.resolve({ ok: true }))

    const results = await Promise.all(submitRealizations([submit, { concept, updatesInfo }]).map(submitOne => submitOne()))

    expect(results).toHaveLength(1)
    expect(results[0].action).toBe(REALIZATION.DELETE)
    expect(results[0].params).toBe(22)
  })
})
