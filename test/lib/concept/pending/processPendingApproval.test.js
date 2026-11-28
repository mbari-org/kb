import { describe, expect, it, vi } from 'vitest'

const applyApprovalsMock = vi.fn()
const applyRejectsMock = vi.fn()
const cloneStaleMock = vi.fn()

vi.mock('@/lib/concept/pending/applyApproves', () => ({
  applyApprovals: (...args) => applyApprovalsMock(...args),
}))

vi.mock('@/lib/concept/pending/applyRejects', () => ({
  applyRejects: (...args) => applyRejectsMock(...args),
}))

vi.mock('@/lib/concept/pending/cloneStale', () => ({
  default: (...args) => cloneStaleMock(...args),
}))

import { processPendingApproval } from '@/lib/concept/pending/processPendingApproval'

import { getConceptByName } from '@/lib/api/concept'
import { updatePendingItem } from '@/lib/api/history'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PENDING } from '@/lib/constants/pending.js'

const okApiFns = () => ({
  apiPayload: vi.fn(async () => ({})),
  apiRaw: vi.fn(async () => ({ payload: {} })),
})

const freeNameApiFns = () => ({
  apiPayload: vi.fn(async () => ({})),
  apiRaw: vi.fn(async request =>
    request === getConceptByName ? { error: { title: 'Not Found' }, status: 404 } : { payload: {} }
  ),
})

describe('processPendingApproval', () => {
  it('groups approved items by concept and refreshes renamed concepts once', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'old-concept',
      parent: 'root',
      rankLevel: '',
      rankName: '',
      realizations: [],
    }
    const optimisticConcept = { ...staleConcept }
    const updatedConcept = { ...optimisticConcept, name: 'renamed-concept' }

    const apiFns = okApiFns()
    const conceptEditsRefresh = vi.fn(async () => ({ concept: updatedConcept }))
    const getConcept = vi.fn(conceptName => {
      if (conceptName === 'old-concept') {
        return staleConcept
      }
      return null
    })
    const loadConcept = vi.fn(async conceptName => getConcept(conceptName))
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const updateSelected = vi.fn()
    const items = [
      { concept: 'old-concept', field: 'Name', id: 'pending-1' },
      { concept: 'old-concept', field: 'Parent', id: 'pending-2' },
    ]

    cloneStaleMock.mockResolvedValue(optimisticConcept)
    applyApprovalsMock.mockImplementation(concept => {
      concept.name = 'renamed-concept'
      return concept
    })

    const result = await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, updateSelected },
      items,
    })

    expect(apiFns.apiRaw).toHaveBeenNthCalledWith(1, updatePendingItem, [
      PENDING.APPROVAL.ACCEPT,
      'pending-1',
    ])
    expect(apiFns.apiRaw).toHaveBeenNthCalledWith(2, updatePendingItem, [
      PENDING.APPROVAL.ACCEPT,
      'pending-2',
    ])
    expect(refreshData).toHaveBeenCalledWith(PANEL_DATA.PENDING_HISTORY)
    expect(reloadConceptRealizations).not.toHaveBeenCalled()
    expect(cloneStaleMock).toHaveBeenCalledWith(apiFns, staleConcept, false)
    expect(applyApprovalsMock).toHaveBeenCalledWith(optimisticConcept, items)
    expect(applyRejectsMock).not.toHaveBeenCalled()
    expect(conceptEditsRefresh).toHaveBeenCalledTimes(1)
    expect(conceptEditsRefresh).toHaveBeenCalledWith(optimisticConcept, staleConcept)
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'renamed-concept' })
    expect(result).toEqual({
      concepts: {
        'old-concept': updatedConcept,
      },
      removed: [],
      pendingHistory: [],
      updated: ['renamed-concept'],
    })
  })

  it('reloads realizations only for concepts with realization items', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'dingo',
      parent: 'root',
      rankLevel: '',
      rankName: '',
    }

    const apiFns = okApiFns()
    const conceptEditsRefresh = vi.fn(async () => ({ concept: staleConcept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => staleConcept)
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const updateSelected = vi.fn()
    const items = [
      { concept: 'dingo', field: 'LinkRealization', id: 'pending-1' },
      { concept: 'wolf', field: 'LinkRealization', id: 'pending-2' },
      { concept: 'wolf', field: 'LinkRealization', id: 'pending-3' },
      { concept: 'dingo', field: 'Name', id: 'pending-4' },
    ]

    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, updateSelected },
      items,
    })

    expect(refreshData).toHaveBeenCalledWith(PANEL_DATA.PENDING_HISTORY)
    expect(reloadConceptRealizations).toHaveBeenCalledTimes(2)
    expect(reloadConceptRealizations).toHaveBeenCalledWith('dingo')
    expect(reloadConceptRealizations).toHaveBeenCalledWith('wolf')
  })

  it('reloads realizations against the restored name when a reject batch renames back', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'data file - 2',
      parent: 'root',
      rankLevel: '',
      rankName: '',
    }

    const apiFns = freeNameApiFns()
    const conceptEditsRefresh = vi.fn(async () => ({ concept: staleConcept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => staleConcept)
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const resetConceptPaths = vi.fn()
    const updateSelected = vi.fn()
    const items = [
      { concept: 'data file - 2', field: 'LinkRealization', id: 'pending-1' },
      { concept: 'data file - 2', field: 'ConceptName', action: 'Edit', oldValue: 'data file', newValue: 'data file - 2', id: 'pending-2' },
    ]

    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({
      approval: PENDING.APPROVAL.REJECT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, resetConceptPaths, updateSelected },
      items,
    })

    expect(reloadConceptRealizations).toHaveBeenCalledTimes(1)
    expect(reloadConceptRealizations).toHaveBeenCalledWith('data file')
  })

  it('skips the realization reload for a concept deleted in the same accept batch', async () => {
    const parentConcept = {
      aliases: [],
      alternateNames: [],
      children: ['B'],
      media: [],
      name: 'object',
      parent: 'root',
      rankLevel: '',
      rankName: '',
    }
    const childConcept = { ...parentConcept, name: 'B', parent: 'object', children: [] }

    const apiFns = okApiFns()
    const conceptEditsRefresh = vi.fn(async concept => ({ concept }))
    const getConcept = vi.fn(name => ({ object: parentConcept, B: childConcept })[name])
    const loadConcept = vi.fn(async name => getConcept(name))
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const removeSelectedConceptName = vi.fn()
    const updateSelected = vi.fn()
    const items = [
      { concept: 'B', field: 'LinkRealization', action: 'Add', newValue: 'comment | self | B', id: 'pending-1' },
      { concept: 'object', field: 'Concept.child', action: 'Delete', oldValue: 'B', id: 'pending-2' },
    ]

    cloneStaleMock.mockImplementation(async (_api, concept) => ({ ...concept, children: [...concept.children] }))
    applyApprovalsMock.mockImplementation(() => {})

    await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, removeSelectedConceptName, updateSelected },
      items,
    })

    expect(reloadConceptRealizations).not.toHaveBeenCalledWith('B')
  })

  it('fully loads a partially loaded group concept before cloning', async () => {
    const partialConcept = { name: 'miscellany', parent: 'object', children: ['try'] }
    const loadedConcept = {
      aliases: [],
      alternateNames: [],
      children: ['try'],
      media: [],
      name: 'miscellany',
      parent: 'object',
      rankLevel: '',
      rankName: '',
    }
    const optimisticConcept = { ...loadedConcept, children: [] }

    const apiFns = okApiFns()
    const conceptEditsRefresh = vi.fn(async () => ({ concept: optimisticConcept }))
    const getConcept = vi.fn(() => partialConcept)
    const loadConcept = vi.fn(async () => loadedConcept)
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const removeSelectedConceptName = vi.fn()
    const updateSelected = vi.fn()
    const items = [{ concept: 'miscellany', field: 'Concept.child', action: 'Delete', oldValue: 'try', id: 'pending-1' }]

    cloneStaleMock.mockResolvedValue(optimisticConcept)
    applyApprovalsMock.mockImplementation(() => {})

    const result = await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, removeSelectedConceptName, updateSelected },
      items,
    })

    expect(loadConcept).toHaveBeenCalledWith('miscellany')
    expect(cloneStaleMock).toHaveBeenCalledWith(apiFns, loadedConcept, false)
    expect(conceptEditsRefresh).toHaveBeenCalledWith(optimisticConcept, loadedConcept)
    expect(removeSelectedConceptName).toHaveBeenCalledWith('try')
    expect(result.removed).toEqual(['try'])
    expect(result.updated).toEqual(['miscellany'])
  })

  it('resolves stale concepts before submitting approvals so a post-approval rename cannot 404', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'dingo-2',
      parent: 'root',
      rankLevel: '',
      rankName: '',
    }

    const calls = []
    const apiFns = {
      apiPayload: vi.fn(async () => ({})),
      apiRaw: vi.fn(async request => {
        if (request === getConceptByName) return { error: { title: 'Not Found' }, status: 404 }
        calls.push('put')
        return { payload: {} }
      }),
    }
    const conceptEditsRefresh = vi.fn(async concept => ({ concept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => {
      calls.push('load')
      return staleConcept
    })
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const resetConceptPaths = vi.fn()
    const updateSelected = vi.fn()

    const items = [
      { concept: 'dingo-2', field: 'ConceptName', action: 'Edit', oldValue: 'dingo', newValue: 'dingo-2', id: 'pending-1' },
    ]

    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({
      approval: PENDING.APPROVAL.REJECT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, resetConceptPaths, updateSelected },
      items,
    })

    expect(calls).toEqual(['load', 'put'])
  })

  it('removes approved child deletes from concept selection history, but not rejected ones', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: ['try'],
      media: [],
      name: 'miscellany',
      parent: 'object',
      rankLevel: '',
      rankName: '',
    }

    const apiFns = okApiFns()
    const conceptEditsRefresh = vi.fn(async () => ({ concept: staleConcept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => staleConcept)
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const removeSelectedConceptName = vi.fn()
    const updateSelected = vi.fn()
    const items = [{ concept: 'miscellany', field: 'Concept.child', action: 'Delete', oldValue: 'try', id: 'pending-1' }]

    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, removeSelectedConceptName, updateSelected },
      items,
    })

    expect(removeSelectedConceptName).toHaveBeenCalledWith('try')

    removeSelectedConceptName.mockClear()

    await processPendingApproval({
      approval: PENDING.APPROVAL.REJECT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, removeSelectedConceptName, updateSelected },
      items,
    })

    expect(removeSelectedConceptName).not.toHaveBeenCalled()

    const childAddItem = {
      concept: 'miscellany',
      field: 'Concept.child',
      action: 'Add',
      newValue: 'try',
      recordedName: 'try',
      id: 'pending-2',
    }

    const rejectAddResult = await processPendingApproval({
      approval: PENDING.APPROVAL.REJECT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, removeSelectedConceptName, updateSelected },
      items: [childAddItem],
    })

    expect(removeSelectedConceptName).toHaveBeenCalledWith('try')
    expect(rejectAddResult.removed).toEqual(['try'])
  })

  it('leaves a child delete unapplied when its child add is rejected in the same batch', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: ['A'],
      media: [],
      name: 'object',
      parent: 'root',
      rankLevel: '',
      rankName: '',
    }
    const addItem = {
      id: 'pending-1',
      concept: 'object',
      field: 'Concept.child',
      action: 'Add',
      newValue: 'A',
      recordedName: 'A',
    }
    const deleteItem = { id: 'pending-2', concept: 'object', field: 'Concept.child', action: 'Delete', oldValue: 'A' }

    const apiFns = okApiFns()
    const conceptEditsRefresh = vi.fn(async concept => ({ concept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => staleConcept)
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const removeSelectedConceptName = vi.fn()
    const updateSelected = vi.fn()

    cloneStaleMock.mockResolvedValue({ ...staleConcept, children: [] })
    applyRejectsMock.mockClear()

    const result = await processPendingApproval({
      approval: PENDING.APPROVAL.REJECT,
      deps: {
        apiFns,
        conceptEditsRefresh,
        getConcept,
        loadConcept,
        refreshData,
        reloadConceptRealizations,
        removeSelectedConceptName,
        updateSelected,
      },
      items: [addItem, deleteItem],
    })

    expect(apiFns.apiRaw).toHaveBeenCalledWith(updatePendingItem, [PENDING.APPROVAL.REJECT, 'pending-2'])
    expect(applyRejectsMock).toHaveBeenCalledTimes(1)
    expect(applyRejectsMock).toHaveBeenCalledWith(expect.anything(), [addItem])
    expect(result.removed).toEqual(['A'])
  })

  it('refuses to approve a child add when the child concept no longer exists', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'miscellany',
      parent: 'object',
      rankLevel: '',
      rankName: '',
    }

    const apiFns = {
      apiPayload: vi.fn(async () => ({})),
      apiRaw: vi.fn(async request =>
        request === getConceptByName ? { error: { title: 'Not Found' } } : { payload: {} }
      ),
    }
    const conceptEditsRefresh = vi.fn()
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const items = [{ concept: 'miscellany', field: 'Concept.child', action: 'Add', newValue: 'try', id: 'pending-1' }]

    await expect(
      processPendingApproval({
        approval: PENDING.APPROVAL.ACCEPT,
        deps: { apiFns, conceptEditsRefresh, getConcept: vi.fn(() => staleConcept), loadConcept: vi.fn(), refreshData, reloadConceptRealizations: vi.fn(), updateSelected: vi.fn() },
        items,
      })
    ).rejects.toMatchObject({ title: 'Stale Pending Child' })

    expect(apiFns.apiRaw).toHaveBeenCalledTimes(1)
    expect(apiFns.apiRaw).toHaveBeenCalledWith(getConceptByName, 'try')
    expect(apiFns.apiRaw).not.toHaveBeenCalledWith(updatePendingItem, expect.anything())
    expect(conceptEditsRefresh).not.toHaveBeenCalled()
  })

  it('refuses to reject a child delete when the child concept no longer exists', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'miscellany',
      parent: 'object',
      rankLevel: '',
      rankName: '',
    }

    const apiFns = {
      apiPayload: vi.fn(async () => ({})),
      apiRaw: vi.fn(async request =>
        request === getConceptByName ? { error: { title: 'Not Found' } } : { payload: {} }
      ),
    }
    const conceptEditsRefresh = vi.fn()
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const items = [{ concept: 'miscellany', field: 'Concept.child', action: 'Delete', oldValue: 'try', id: 'pending-1' }]

    await expect(
      processPendingApproval({
        approval: PENDING.APPROVAL.REJECT,
        deps: { apiFns, conceptEditsRefresh, getConcept: vi.fn(() => staleConcept), loadConcept: vi.fn(), refreshData, reloadConceptRealizations: vi.fn(), updateSelected: vi.fn() },
        items,
      })
    ).rejects.toMatchObject({ title: 'Stale Pending Child' })

    expect(apiFns.apiRaw).toHaveBeenCalledTimes(1)
    expect(conceptEditsRefresh).not.toHaveBeenCalled()
  })

  it('refreshes pending history and aborts when a submit fails mid-batch', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'dingo',
      parent: 'root',
      rankLevel: '',
      rankName: '',
    }

    let puts = 0
    const apiFns = {
      apiPayload: vi.fn(async () => ({})),
      apiRaw: vi.fn(async () => {
        puts += 1
        return puts === 1 ? { payload: {} } : { error: { title: 'Server Error' } }
      }),
    }
    const conceptEditsRefresh = vi.fn()
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const items = [
      { concept: 'dingo', field: 'ConceptName', action: 'Edit', oldValue: 'dingo', newValue: 'dingo-2', id: 'pending-1' },
      { concept: 'dingo', field: 'Media', action: 'Add', id: 'pending-2' },
    ]

    await expect(
      processPendingApproval({
        approval: PENDING.APPROVAL.ACCEPT,
        deps: { apiFns, conceptEditsRefresh, getConcept: vi.fn(() => staleConcept), loadConcept: vi.fn(async () => staleConcept), refreshData, reloadConceptRealizations: vi.fn(), updateSelected: vi.fn() },
        items,
      })
    ).rejects.toMatchObject({ title: 'Pending Update Failed' })

    expect(apiFns.apiRaw).toHaveBeenCalledTimes(2)
    expect(refreshData).toHaveBeenCalledWith(PANEL_DATA.PENDING_HISTORY)
    expect(conceptEditsRefresh).not.toHaveBeenCalled()
  })
})
