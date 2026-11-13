import { describe, expect, it, vi } from 'vitest'

import submitStaged from '@/contexts/panels/concepts/staged/save/submitStaged'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'

const baseState = {
  aliasIndex: 0,
  aliases: [],
  author: { action: 'None', value: '' },
  children: [],
  deleteConcept: false,
  media: [],
  mediaIndex: 0,
  name: { action: 'None', value: 'dingo', extent: '' },
  parent: { action: 'None', value: 'root' },
  rank: { action: 'None', level: '', name: '' },
  realizations: [],
  realizationIndex: 0,
  templates: [],
}

const updatesContext = ({ isAdmin, submit }) => ({
  apiFns: { apiPayload: submit },
  isAdmin,
  staleConcept: { name: 'dingo' },
})

describe('submitStaged chrono replay', () => {
  it('submits in stagedSeq order and advances concept name for admin', async () => {
    const calls = []
    const submit = vi.fn(async (apiFn, params) => {
      calls.push({ name: apiFn.name, params })
      return { ok: true }
    })

    const staged = {
      ...baseState,
      name: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '', stagedSeq: 1 },
      aliases: [
        {
          name: 'alias-1',
          author: '',
          nameType: 'synonym',
          action: CONCEPT_STATE.ALIAS.ADD,
          index: 0,
          stagedSeq: 2,
        },
      ],
      children: [{ name: 'pup', action: CONCEPT_STATE.CHILD.ADD, index: 0, stagedSeq: 3 }],
    }

    const info = await submitStaged(baseState, staged, updatesContext({ isAdmin: true, submit }))

    expect(calls.map(call => call.name)).toEqual([
      'updateConceptName',
      'createAlias',
      'createConcept',
    ])
    expect(calls[0].params).toEqual(['dingo', { name: 'wolf' }])
    expect(calls[1].params.name).toBe('wolf')
    expect(calls[2].params.parentName).toBe('wolf')
    expect(info.results).toHaveLength(3)
    expect(info.hasUpdated(CONCEPT.FIELD.NAME)).toBe(true)
  })

  it('advances concept name after rename for non-admin too (ONI applies rename immediately)', async () => {
    const calls = []
    const submit = vi.fn(async (apiFn, params) => {
      calls.push({ name: apiFn.name, params })
      return { ok: true }
    })

    const staged = {
      ...baseState,
      name: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '', stagedSeq: 1 },
      aliases: [
        {
          name: 'alias-1',
          author: '',
          nameType: 'synonym',
          action: CONCEPT_STATE.ALIAS.ADD,
          index: 0,
          stagedSeq: 2,
        },
      ],
    }

    await submitStaged(baseState, staged, updatesContext({ isAdmin: false, submit }))

    expect(calls.map(call => call.name)).toEqual(['updateConceptName', 'createAlias'])
    expect(calls[0].params).toEqual(['dingo', { name: 'wolf' }])
    expect(calls[1].params.name).toBe('wolf')
  })

  it('stops on first failure and reports skipped ops', async () => {
    const submit = vi.fn(async (apiFn, params) => {
      if (apiFn.name === 'createAlias') {
        throw { message: 'boom', details: {} }
      }
      return { ok: true, params }
    })

    const staged = {
      ...baseState,
      name: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '', stagedSeq: 1 },
      aliases: [
        {
          name: 'alias-1',
          author: '',
          nameType: 'synonym',
          action: CONCEPT_STATE.ALIAS.ADD,
          index: 0,
          stagedSeq: 2,
        },
      ],
      children: [{ name: 'pup', action: CONCEPT_STATE.CHILD.ADD, index: 0, stagedSeq: 3 }],
    }

    await expect(
      submitStaged(baseState, staged, updatesContext({ isAdmin: true, submit }))
    ).rejects.toMatchObject({
      title: 'Concept Save Error',
      details: {
        completedOperations: [{ field: CONCEPT.FIELD.NAME, action: CONCEPT_STATE.NAME }],
        skippedOperations: [
          {
            field: CONCEPT.FIELD.CHILDREN,
            action: CONCEPT_STATE.CHILD.ADD,
          },
        ],
      },
    })

    expect(submit).toHaveBeenCalledTimes(2)
  })
})
