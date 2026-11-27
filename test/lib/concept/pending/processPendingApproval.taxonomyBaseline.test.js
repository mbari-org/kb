import { describe, expect, it, vi } from 'vitest'

const applyRejectsMock = vi.fn()
const cloneStaleMock = vi.fn()

vi.mock('@/lib/concept/pending/applyRejects', () => ({
  applyRejects: (...args) => applyRejectsMock(...args),
}))

vi.mock('@/lib/concept/pending/cloneStale', () => ({
  default: (...args) => cloneStaleMock(...args),
}))

import { processPendingApproval } from '@/lib/concept/pending/processPendingApproval'

import { updatePendingItem } from '@/lib/api/history'
import { PENDING } from '@/lib/constants/pending.js'

const conceptNamed = (name, parent, children = []) => ({
  aliases: [],
  alternateNames: [],
  children,
  id: 1,
  media: [],
  name,
  parent,
  primaryNameId: 1,
  rankLevel: '',
  rankName: '',
  realizations: [],
})

const parentEdit = {
  id: 'parent',
  concept: 'spinning',
  field: 'Concept.parent',
  action: 'Edit',
  oldValue: 'data file',
  newValue: 'behavior',
}

const addItem = { id: 'add', concept: 'data file', field: 'Concept.child', action: 'Add', newValue: 'spinning' }

describe('processPendingApproval taxonomy baseline', () => {
  it('gives a later group the taxonomy the earlier group committed, not the pre-batch snapshot', async () => {
    const spinning = conceptNamed('spinning', 'behavior')
    const dataFile = conceptNamed('data file', 'root')
    const staleByName = { spinning, 'data file': dataFile }
    const committed = {
      aliasMap: {},
      conceptMap: {
        'data file': conceptNamed('data file', 'root', ['spinning']),
        spinning: conceptNamed('spinning', 'data file'),
      },
    }
    const conceptEditsRefresh = vi
      .fn()
      .mockResolvedValueOnce({ concept: spinning, taxonomy: committed })
      .mockResolvedValueOnce({ concept: dataFile, taxonomy: committed })

    cloneStaleMock.mockImplementation(async (_apiFns, concept) => ({ ...concept, children: [...concept.children] }))

    const deps = {
      apiFns: {
        apiPayload: vi.fn(async () => ({})),
        apiRaw: vi.fn(async () => ({ payload: {} })),
      },
      conceptEditsRefresh,
      getConcept: vi.fn(name => staleByName[name]),
      loadConcept: vi.fn(async name => staleByName[name]),
      refreshData: vi.fn(async () => ({ pendingHistory: [] })),
      reloadConceptRealizations: vi.fn(async () => []),
      removeSelectedConceptName: vi.fn(),
      resetConceptPaths: vi.fn(),
      updateSelected: vi.fn(),
    }

    await processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps, items: [parentEdit, addItem] })

    expect(conceptEditsRefresh).toHaveBeenCalledTimes(2)
    expect(conceptEditsRefresh.mock.calls[1][1].children).toEqual(['spinning'])
  })

  it('does not attach an approved child add to a parent when the child already sits under another parent', async () => {
    const spinning = conceptNamed('spinning', 'behavior')
    const dataFile = conceptNamed('data file', 'root')
    const conceptsByName = { spinning, 'data file': dataFile }
    const conceptEditsRefresh = vi.fn(async concept => ({ concept }))
    const apiRaw = vi.fn(async () => ({ payload: {} }))

    cloneStaleMock.mockImplementation(async (_apiFns, concept) => ({ ...concept, children: [...concept.children] }))

    const deps = {
      apiFns: { apiPayload: vi.fn(async () => ({})), apiRaw },
      conceptEditsRefresh,
      getConcept: vi.fn(name => conceptsByName[name]),
      loadConcept: vi.fn(async name => conceptsByName[name]),
      refreshData: vi.fn(async () => ({ pendingHistory: [] })),
      reloadConceptRealizations: vi.fn(async () => []),
      removeSelectedConceptName: vi.fn(),
      resetConceptPaths: vi.fn(),
      updateSelected: vi.fn(),
    }

    await processPendingApproval({ approval: PENDING.APPROVAL.ACCEPT, deps, items: [addItem] })

    expect(apiRaw).toHaveBeenCalledWith(updatePendingItem, [PENDING.APPROVAL.ACCEPT, 'add'])
    expect(conceptEditsRefresh.mock.calls[0][0].children).toEqual([])
  })
})
