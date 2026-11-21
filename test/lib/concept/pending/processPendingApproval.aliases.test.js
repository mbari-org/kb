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

import { getConceptNames } from '@/lib/api/concept'
import { ACTION, HISTORY_FIELD } from '@/lib/constants'
import { PENDING } from '@/lib/constants/pending.js'

describe('processPendingApproval alias changes', () => {
  it('re-reads the concept names so approved alias adds carry their server ids', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'dingo',
      parent: 'root',
      rankLevel: '',
      rankName: '',
      realizations: [],
    }
    const serverNames = [
      { id: 1, name: 'dingo', nameType: 'primary' },
      { id: 9, name: 'wolf', nameType: 'synonym' },
    ]
    const apiFns = {
      apiPayload: vi.fn(async fn => (fn === getConceptNames ? serverNames : {})),
      apiRaw: vi.fn(async () => ({ payload: {} })),
    }
    const conceptEditsRefresh = vi.fn(async () => ({ concept: staleConcept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => staleConcept)
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const reloadConceptRealizations = vi.fn(async () => [])
    const items = [
      { concept: 'dingo', field: HISTORY_FIELD.ALIAS, action: ACTION.ADD, newValue: 'wolf', id: 'pending-1' },
    ]

    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: {
        apiFns,
        conceptEditsRefresh,
        getConcept,
        loadConcept,
        refreshData,
        reloadConceptRealizations,
        resetConceptPaths: vi.fn(),
        updateSelected: vi.fn(),
      },
      items,
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptNames, 'dingo')
    expect(conceptEditsRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        aliases: [{ id: 9, name: 'wolf', nameType: 'Synonym' }],
        alternateNames: ['wolf'],
        primaryNameId: 1,
      }),
      staleConcept
    )
  })

  it('does not re-read names for a concept the same batch deletes', async () => {
    const staleConcept = {
      aliases: [],
      alternateNames: [],
      children: [],
      media: [],
      name: 'dingo',
      parent: 'root',
      rankLevel: '',
      rankName: '',
      realizations: [],
    }
    const apiFns = {
      apiPayload: vi.fn(async () => ({})),
      apiRaw: vi.fn(async () => ({ payload: {} })),
    }
    const conceptEditsRefresh = vi.fn(async () => ({ concept: staleConcept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => staleConcept)
    const items = [
      { concept: 'dingo', field: HISTORY_FIELD.ALIAS, action: ACTION.ADD, newValue: 'wolf', id: 'pending-1' },
      { concept: 'root', field: HISTORY_FIELD.CHILD, action: ACTION.DELETE, oldValue: 'dingo', id: 'pending-2' },
    ]

    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: {
        apiFns,
        conceptEditsRefresh,
        getConcept,
        loadConcept,
        refreshData: vi.fn(async () => ({ pendingHistory: [] })),
        reloadConceptRealizations: vi.fn(async () => []),
        removeSelectedConceptName: vi.fn(),
        resetConceptPaths: vi.fn(),
        updateSelected: vi.fn(),
      },
      items,
    })

    expect(apiFns.apiPayload).not.toHaveBeenCalledWith(getConceptNames, 'dingo')
    expect(conceptEditsRefresh).toHaveBeenCalledTimes(2)
  })
})
