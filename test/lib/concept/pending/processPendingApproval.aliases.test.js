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

import { getConceptNameById } from '@/lib/api/concept'
import { ACTION, HISTORY_FIELD } from '@/lib/constants'
import { PENDING } from '@/lib/constants/pending.js'

const staleAliasConcept = () => ({
  aliases: [],
  alternateNames: [],
  children: [],
  media: [],
  name: 'dingo',
  parent: 'root',
  primaryNameId: 1,
  rankLevel: '',
  rankName: '',
  realizations: [],
})

describe('processPendingApproval alias changes', () => {
  it('re-reads the names by primary name id so approved alias adds carry their server ids', async () => {
    const staleConcept = staleAliasConcept()
    const serverNames = [
      { id: 1, name: 'dingo', nameType: 'primary', author: 'Smith' },
      { id: 9, name: 'wolf', nameType: 'synonym', author: '' },
    ]
    const apiFns = {
      apiPayload: vi.fn(async fn => (fn === getConceptNameById ? { names: serverNames } : {})),
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

    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptNameById, 1)
    expect(conceptEditsRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        aliases: [{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }],
        alternateNames: ['wolf'],
        primaryNameId: 1,
      }),
      staleConcept
    )
  })

  it('re-reads the names by primary name id after a rename in the same batch', async () => {
    const staleConcept = staleAliasConcept()
    const serverNames = [
      { id: 1, name: 'wolf-renamed', nameType: 'primary', author: '' },
      { id: 9, name: 'wolf', nameType: 'synonym', author: '' },
    ]
    const apiFns = {
      apiPayload: vi.fn(async fn => (fn === getConceptNameById ? { names: serverNames } : {})),
      apiRaw: vi.fn(async () => ({ payload: {} })),
    }
    const conceptEditsRefresh = vi.fn(async concept => ({ concept }))
    const getConcept = vi.fn(() => staleConcept)
    const loadConcept = vi.fn(async () => staleConcept)
    const refreshData = vi.fn(async () => ({ pendingHistory: [] }))
    const updateSelected = vi.fn()
    const items = [
      {
        concept: 'wolf-renamed',
        field: HISTORY_FIELD.NAME,
        action: ACTION.EDIT,
        oldValue: 'dingo',
        newValue: 'wolf-renamed',
        id: 'pending-1',
      },
      { concept: 'wolf-renamed', field: HISTORY_FIELD.ALIAS, action: ACTION.ADD, newValue: 'wolf', id: 'pending-2' },
    ]

    cloneStaleMock.mockResolvedValue({ ...staleConcept })
    applyApprovalsMock.mockImplementationOnce(concept => {
      concept.name = 'wolf-renamed'
    })

    await processPendingApproval({
      approval: PENDING.APPROVAL.ACCEPT,
      deps: {
        apiFns,
        conceptEditsRefresh,
        getConcept,
        loadConcept,
        refreshData,
        reloadConceptRealizations: vi.fn(async () => []),
        resetConceptPaths: vi.fn(),
        updateSelected,
      },
      items,
    })

    expect(apiFns.apiPayload).toHaveBeenCalledWith(getConceptNameById, 1)
    expect(conceptEditsRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        alternateNames: ['wolf'],
        aliases: [{ id: 9, name: 'wolf', author: '', nameType: 'Synonym' }],
        name: 'wolf-renamed',
        primaryNameId: 1,
      }),
      staleConcept
    )
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'wolf-renamed' })
  })

  it('does not re-read names for a concept the same batch deletes', async () => {
    const staleConcept = staleAliasConcept()
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

    expect(apiFns.apiPayload).not.toHaveBeenCalledWith(getConceptNameById, 1)
    expect(conceptEditsRefresh).toHaveBeenCalledTimes(2)
  })
})
