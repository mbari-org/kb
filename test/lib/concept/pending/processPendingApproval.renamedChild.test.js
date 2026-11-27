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

import { getConceptByName } from '@/lib/api/concept'
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

const renameItem = {
  id: 'rename',
  concept: 'spin',
  field: 'ConceptName',
  action: 'Edit',
  oldValue: 'spinning',
  newValue: 'spin',
}
const addItem = {
  id: 'add',
  concept: 'data file',
  field: 'Concept.child',
  action: 'Add',
  newValue: 'spin',
  recordedName: 'spinning',
}

const depsFor = (apiRaw, concepts) => ({
  apiFns: { apiPayload: vi.fn(async () => ({})), apiRaw },
  conceptEditsRefresh: vi.fn(async concept => ({ concept })),
  getConcept: vi.fn(name => concepts[name]),
  loadConcept: vi.fn(async name => concepts[name]),
  refreshData: vi.fn(async () => ({ pendingHistory: [] })),
  reloadConceptRealizations: vi.fn(async () => []),
  removeSelectedConceptName: vi.fn(),
  resetConceptPaths: vi.fn(),
  updateSelected: vi.fn(),
})

const copyStale = async (_apiFns, concept) => ({ ...concept, children: [...concept.children] })

describe('processPendingApproval with a renamed child add', () => {
  it('approves the add under the current name', async () => {
    const apiRaw = vi.fn(async () => ({ payload: {} }))
    cloneStaleMock.mockImplementation(copyStale)
    const deps = depsFor(apiRaw, { 'data file': conceptNamed('data file', 'root') })

    await processPendingApproval({ approval: PENDING.APPROVAL.ACCEPT, deps, items: [addItem] })

    expect(apiRaw).toHaveBeenCalledWith(getConceptByName, 'spin')
    expect(apiRaw).toHaveBeenCalledWith(updatePendingItem, [PENDING.APPROVAL.ACCEPT, 'add'])
  })

  it('removes a rejected add under the name it was recorded with', async () => {
    const apiRaw = vi.fn(async request =>
      request === getConceptByName ? { error: { title: 'Not Found' }, status: 404 } : { payload: {} }
    )
    cloneStaleMock.mockImplementation(copyStale)
    const deps = depsFor(apiRaw, {
      'data file': conceptNamed('data file', 'root', ['spin']),
      spin: conceptNamed('spin', 'data file'),
    })

    await processPendingApproval({ approval: PENDING.APPROVAL.REJECT, deps, items: [renameItem, addItem] })

    expect(deps.removeSelectedConceptName).toHaveBeenCalledWith('spinning')
    expect(deps.removeSelectedConceptName).not.toHaveBeenCalledWith('spin')
  })
})
