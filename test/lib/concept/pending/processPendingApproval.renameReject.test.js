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
import { PENDING } from '@/lib/constants/pending.js'

const renameItem = {
  concept: 'wolf',
  field: 'ConceptName',
  action: 'Edit',
  oldValue: 'dingo',
  newValue: 'wolf',
  id: 'pending-1',
}

const staleConcept = {
  aliases: [],
  alternateNames: [],
  children: [],
  media: [],
  name: 'wolf',
  parent: 'root',
  primaryNameId: 1,
  rankLevel: '',
  rankName: '',
  realizations: [],
}

const apiFnsWithLookup = lookup => ({
  apiPayload: vi.fn(async () => ({})),
  apiRaw: vi.fn(async request => (request === getConceptByName ? lookup : { payload: {} })),
})

const depsFor = apiFns => ({
  apiFns,
  conceptEditsRefresh: vi.fn(async concept => ({ concept })),
  getConcept: vi.fn(() => staleConcept),
  loadConcept: vi.fn(async () => staleConcept),
  refreshData: vi.fn(async () => ({ pendingHistory: [] })),
  reloadConceptRealizations: vi.fn(async () => []),
  resetConceptPaths: vi.fn(),
  updateSelected: vi.fn(),
})

describe('processPendingApproval rename rejects', () => {
  it('rejects the rename when no concept holds the old name', async () => {
    const apiFns = apiFnsWithLookup({ error: { title: 'Not Found' }, status: 404 })
    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps: depsFor(apiFns), items: [renameItem] })

    expect(apiFns.apiRaw).toHaveBeenCalledWith(getConceptByName, 'dingo')
    expect(apiFns.apiRaw).toHaveBeenCalledWith(updatePendingItem, [PENDING.APPROVAL.REJECT, 'pending-1'])
  })

  it('blocks the reject before any write when a concept with the old name has been added', async () => {
    const apiFns = apiFnsWithLookup({ payload: { name: 'dingo' } })
    const deps = depsFor(apiFns)

    await expect(processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps, items: [renameItem] })).rejects.toMatchObject({
      title: 'Rename Reject Blocked',
      details: { name: 'dingo', reason: 'CONCEPT_ADDED' },
    })

    expect(apiFns.apiRaw).not.toHaveBeenCalledWith(updatePendingItem, expect.anything())
    expect(deps.refreshData).not.toHaveBeenCalled()
  })

  it('blocks the reject when another concept holds the old name as an alias', async () => {
    const apiFns = apiFnsWithLookup({ payload: { name: 'fox' } })

    await expect(
      processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps: depsFor(apiFns), items: [renameItem] })
    ).rejects.toMatchObject({
      title: 'Rename Reject Blocked',
      details: { name: 'dingo', owner: 'fox', reason: 'ALIAS_HELD' },
    })

    expect(apiFns.apiRaw).not.toHaveBeenCalledWith(updatePendingItem, expect.anything())
  })

  it('surfaces a failed name lookup instead of treating the name as free', async () => {
    const failure = { title: 'Server Error', message: 'boom' }
    const apiFns = apiFnsWithLookup({ error: failure, status: 500 })

    await expect(
      processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps: depsFor(apiFns), items: [renameItem] })
    ).rejects.toMatchObject(failure)

    expect(apiFns.apiRaw).not.toHaveBeenCalledWith(updatePendingItem, expect.anything())
  })

  it('does not look up the old name when approving a rename', async () => {
    const apiFns = apiFnsWithLookup({ payload: { name: 'dingo' } })
    cloneStaleMock.mockResolvedValue({ ...staleConcept })

    await processPendingApproval({ approval: PENDING.APPROVAL.ACCEPT, deps: depsFor(apiFns), items: [renameItem] })

    expect(apiFns.apiRaw).not.toHaveBeenCalledWith(getConceptByName, 'dingo')
    expect(apiFns.apiRaw).toHaveBeenCalledWith(updatePendingItem, [PENDING.APPROVAL.ACCEPT, 'pending-1'])
  })
})
