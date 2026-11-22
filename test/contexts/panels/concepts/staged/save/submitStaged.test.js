import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import useApiFns from '@/contexts/config/useApiFns'
import submitStaged from '@/contexts/panels/concepts/staged/save/submitStaged'
import { CONCEPT } from '@/lib/constants'
import { CONCEPT_STATE } from '@/lib/constants/conceptState.js'
import { oniUserDelete, oniUserPost, oniUserPut } from '@/lib/services/oni/methods'

vi.mock('@/lib/services/oni/methods', async importOriginal => ({
  ...(await importOriginal()),
  oniUserDelete: vi.fn(),
  oniUserPost: vi.fn(),
  oniUserPut: vi.fn(),
}))

const baseState = {
  aliasIndex: 0,
  id: 42,
  primaryNameId: 7,
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
  apiFns: { apiWrite: submit },
  isAdmin,
  staleConcept: { name: 'dingo' },
})

describe('submitStaged chrono replay', () => {
  it('submits in stagedSeq order and advances concept name for admin', async () => {
    const calls = []
    const submit = vi.fn(async (apiFn, params) => {
      calls.push({ name: apiFn.name, params })
      if (apiFn.name === 'createAlias') {
        return { names: [{ id: 3, name: 'alias-1', nameType: 'synonym' }] }
      }
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

    expect(calls.map(call => call.name)).toEqual(['updateConceptNameById', 'createAlias', 'createConcept'])
    expect(calls[0].params).toEqual([7, { newName: 'wolf' }])
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

    expect(calls.map(call => call.name)).toEqual(['updateConceptNameById', 'createAlias'])
    expect(calls[0].params).toEqual([7, { newName: 'wolf' }])
    expect(calls[1].params.name).toBe('wolf')
  })

  it('stops on first failure and reports skipped ops', async () => {
    oniUserPut.mockResolvedValue({ payload: {}, status: 200 })
    oniUserPost.mockImplementation(async ({ path }) =>
      path[0] === 'names'
        ? { error: { title: 'Server Error', message: 'boom', details: {} }, status: 500 }
        : { payload: {}, status: 200 }
    )
    const { result } = renderHook(() => useApiFns({}, vi.fn()))

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
      submitStaged(baseState, staged, { apiFns: result.current, isAdmin: true, staleConcept: { name: 'dingo' } })
    ).rejects.toMatchObject({
      title: 'Concept Save Error',
      details: {
        completedOperations: [{ field: CONCEPT.FIELD.NAME, action: CONCEPT_STATE.NAME }],
        failedOperations: [{ field: CONCEPT.FIELD.ALIASES, message: 'boom' }],
        skippedOperations: [{ field: CONCEPT.FIELD.CHILDREN, action: CONCEPT_STATE.CHILD.ADD }],
      },
      original: { title: 'Server Error', message: 'boom', status: 500 },
    })

    expect(oniUserPut).toHaveBeenCalledTimes(1)
    expect(oniUserPost).toHaveBeenCalledTimes(1)
  })
})

describe('submitStaged ids and rejected writes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stops at a rejected parent move before later writes', async () => {
    oniUserPut.mockResolvedValueOnce({
      error: { title: 'Bad Request', message: 'Invalid parent', details: {} },
      status: 400,
    })
    const { result } = renderHook(() => useApiFns({}, vi.fn()))
    const staged = {
      ...baseState,
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
      parent: { action: CONCEPT_STATE.PARENT, value: 'object', stagedSeq: 1 },
    }

    await expect(
      submitStaged(baseState, staged, { apiFns: result.current, isAdmin: true, staleConcept: { name: 'dingo' } })
    ).rejects.toMatchObject({
      title: 'Concept Save Error',
      details: {
        completedOperations: [],
        failedOperations: [{ field: CONCEPT.FIELD.PARENT, message: 'Invalid parent' }],
        outcomeUnknown: false,
        skippedOperations: [{ action: CONCEPT_STATE.ALIAS.ADD, field: CONCEPT.FIELD.ALIASES }],
      },
    })

    expect(oniUserPut).toHaveBeenCalledWith(
      expect.objectContaining({ path: ['concept', 'id', 42], data: { parentName: 'object' } })
    )
    expect(oniUserPost).not.toHaveBeenCalled()
  })

  it('addresses parent, rank, alias edit, and alias delete writes by id', async () => {
    oniUserPut.mockResolvedValue({ payload: {}, status: 200 })
    oniUserDelete.mockResolvedValueOnce({ payload: {}, status: 200 })
    const { result } = renderHook(() => useApiFns({}, vi.fn()))
    const initial = {
      ...baseState,
      aliases: [
        { id: 9, name: 'wolf', author: '', nameType: 'Synonym' },
        { id: 10, name: 'fox', author: '', nameType: 'Common' },
      ],
    }
    const staged = {
      ...initial,
      aliases: [
        {
          id: 9,
          name: 'wolfie',
          author: '',
          nameType: 'Synonym',
          action: CONCEPT_STATE.ALIAS.EDIT,
          index: 0,
          stagedSeq: 3,
        },
        {
          id: 10,
          name: 'fox',
          author: '',
          nameType: 'Common',
          action: CONCEPT_STATE.ALIAS.DELETE,
          index: 1,
          stagedSeq: 4,
        },
      ],
      parent: { action: CONCEPT_STATE.PARENT, value: 'object', stagedSeq: 1 },
      rank: { action: CONCEPT_STATE.RANK, level: 'Species', name: 'species', stagedSeq: 2 },
    }

    await submitStaged(initial, staged, { apiFns: result.current, isAdmin: true, staleConcept: { name: 'dingo' } })

    expect(oniUserPut.mock.calls.map(([request]) => [request.path, request.data])).toEqual([
      [['concept', 'id', 42], { parentName: 'object' }],
      [['concept', 'id', 42], { rankLevel: 'Species', rankName: 'species' }],
      [['names', 'id', 9], { newName: 'wolfie' }],
    ])
    expect(oniUserDelete.mock.calls.map(([request]) => request.path)).toEqual([['names', 'id', 10]])
  })
})

describe('submitStaged write failure outcome', () => {
  const renameStaged = {
    ...baseState,
    name: { action: CONCEPT_STATE.NAME, value: 'wolf', extent: '', stagedSeq: 1 },
  }

  const saveRename = async failure => {
    oniUserPut.mockResolvedValueOnce(failure)
    const { result } = renderHook(() => useApiFns({}, vi.fn()))
    return submitStaged(baseState, renameStaged, {
      apiFns: result.current,
      isAdmin: true,
      staleConcept: { name: 'dingo' },
    })
  }

  it('marks a server error as outcome unknown', async () => {
    await expect(
      saveRename({ error: { title: 'Server Error', message: 'boom', details: {} }, status: 500 })
    ).rejects.toMatchObject({ title: 'Concept Save Error', details: { outcomeUnknown: true } })
  })

  it('marks a network failure without a status as outcome unknown', async () => {
    await expect(
      saveRename({ error: { title: 'Network Error', message: 'offline', details: {} } })
    ).rejects.toMatchObject({ details: { outcomeUnknown: true } })
  })

  it('marks a client error as not applied', async () => {
    await expect(
      saveRename({ error: { title: 'Bad Request', message: 'exists', details: {} }, status: 400 })
    ).rejects.toMatchObject({ details: { outcomeUnknown: false } })
  })
})
