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
    const refreshData = vi.fn(async () => {})
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
      deps: { apiFns, conceptEditsRefresh, getConcept, refreshData, updateSelected },
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
    expect(refreshData).toHaveBeenCalledWith(PANEL_DATA.ALL)
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
      updated: ['renamed-concept'],
    })
  })
})
