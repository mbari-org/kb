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

import { updatePendingItem } from '@/lib/api/history'
import { PANEL_DATA } from '@/lib/constants/panelData.js'
import { PENDING } from '@/lib/constants/pending.js'

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

    const apiFns = {
      apiPayload: vi.fn(async () => ({})),
    }
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

    expect(apiFns.apiPayload).toHaveBeenNthCalledWith(1, updatePendingItem, [
      PENDING.APPROVAL.ACCEPT,
      'pending-1',
    ])
    expect(apiFns.apiPayload).toHaveBeenNthCalledWith(2, updatePendingItem, [
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
        'renamed-concept': updatedConcept,
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

    const apiFns = { apiPayload: vi.fn(async () => ({})) }
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

    const apiFns = { apiPayload: vi.fn(async () => ({})) }
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

    const apiFns = { apiPayload: vi.fn(async () => ({})) }
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

    const childAddItem = { concept: 'miscellany', field: 'Concept.child', action: 'Add', newValue: 'try', id: 'pending-2' }

    const rejectAddResult = await processPendingApproval({
      approval: PENDING.APPROVAL.REJECT,
      deps: { apiFns, conceptEditsRefresh, getConcept, loadConcept, refreshData, reloadConceptRealizations, removeSelectedConceptName, updateSelected },
      items: [childAddItem],
    })

    expect(removeSelectedConceptName).toHaveBeenCalledWith('try')
    expect(rejectAddResult.removed).toEqual(['try'])
  })
})
