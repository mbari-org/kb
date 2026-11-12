import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import ConfigContext from '@/contexts/config/ConfigContext'
import PanelDataContext from '@/contexts/panel/data/PanelDataContext'
import ConceptContext from '@/contexts/panels/concepts/ConceptContext'
import ConceptModalContext from '@/contexts/panels/concepts/modal/ConceptModalContext'
import SelectedContext from '@/contexts/selected/SelectedContext'
import TaxonomyContext from '@/contexts/taxonomy/TaxonomyContext'

import useConceptUpdatePending from '@/contexts/panels/concepts/pending/useConceptUpdatePending'

import { PENDING } from '@/lib/constants/pending.js'
import CONFIG from '@/lib/config'

const processPendingApprovalMock = vi.fn()

vi.mock('@/lib/concept/pending/processPendingApproval', () => ({
  default: (...args) => processPendingApprovalMock(...args),
}))

const { PROCESSING } = CONFIG

describe('useConceptUpdatePending', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const buildWrapper = ({ closestConcept = vi.fn(), conceptEditsRefresh, getConcept, pendingHistory = [], pendingItems, parentPendingItems = [], refreshData, setConcept, updateSelected, withProcessing }) => {
    const staleConcept = { name: 'pending-concept', parent: 'root' }
    const pending = vi.fn(key => {
      if (key === PENDING.DATA.CONCEPT) return pendingItems
      if (key === PENDING.DATA.PARENT) return parentPendingItems
      return []
    })

    const wrapper = ({ children }) => (
      <ConfigContext.Provider value={{ apiFns: { apiPayload: vi.fn() } }}>
        <PanelDataContext.Provider value={{ pendingHistory, refreshData }}>
          <SelectedContext.Provider value={{ concepts: { removeName: vi.fn() }, updateSelected }}>
            <TaxonomyContext.Provider value={{ closestConcept, conceptEditsRefresh, getConcept, loadConcept: vi.fn() }}>
              <ConceptModalContext.Provider value={{ withProcessing }}>
                <ConceptContext.Provider value={{ concept: staleConcept, pending, setConcept }}>
                  {children}
                </ConceptContext.Provider>
              </ConceptModalContext.Provider>
            </TaxonomyContext.Provider>
          </SelectedContext.Provider>
        </PanelDataContext.Provider>
      </ConfigContext.Provider>
    )

    return { staleConcept, wrapper }
  }

  it('applies the optimistic concept returned by processPendingApproval', async () => {
    const pendingItem = { id: 'p1', concept: 'pending-concept' }
    const secondItem = { id: 'p2', concept: 'pending-concept' }
    const optimisticConcept = { name: 'pending-concept', parent: 'root' }
    const pendingHistory = [{ id: 'p1' }]

    const setConcept = vi.fn(async () => {})
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: { 'pending-concept': optimisticConcept },
      removed: [],
      pendingHistory,
      updated: ['pending-concept'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(),
      pendingItems: [pendingItem, secondItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'accept', pendingIds: ['p1'] })
    })

    expect(withProcessing).toHaveBeenCalledWith(
      expect.any(Function),
      PROCESSING.UPDATE,
      `${PROCESSING.ARG.PENDING}: accept`
    )
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'accept',
        items: [pendingItem],
      })
    )
    expect(setConcept).toHaveBeenCalledWith(optimisticConcept, pendingHistory)
    expect(remaining).toBe(true)
  })

  it('falls back to reloading the concept from taxonomy when no optimistic concept is returned', async () => {
    const pendingItem = { id: 'p1', concept: 'pending-concept' }
    const refreshedConcept = { name: 'pending-concept', parent: 'root' }
    const pendingHistory = []

    const getConcept = vi.fn(() => refreshedConcept)
    const setConcept = vi.fn(async () => {})
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      removed: [],
      pendingHistory,
      updated: ['pending-concept'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingItems: [pendingItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'reject', pendingIds: ['p1'] })
    })

    expect(getConcept).toHaveBeenCalledWith('pending-concept')
    expect(setConcept).toHaveBeenCalledWith(refreshedConcept, pendingHistory)
    expect(remaining).toBe(false)
  })

  it('resolves parent-owned child records and selects the parent when the concept was deleted', async () => {
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }
    const pendingHistory = []

    const getConcept = vi.fn(() => null)
    const setConcept = vi.fn(async () => {})
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      removed: ['pending-concept'],
      pendingHistory,
      updated: ['root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingItems: [],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'approve', pendingIds: ['p9'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [childDeleteItem],
      })
    )
    expect(setConcept).not.toHaveBeenCalled()
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'root' })
    expect(remaining).toBe(true)
  })

  it('approves a delete without acting on the concept\'s other pending items', async () => {
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }

    const getConcept = vi.fn(() => null)
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      removed: ['pending-concept'],
      pendingHistory: [],
      updated: ['root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingHistory: [mediaItem, rankItem, childDeleteItem],
      pendingItems: [mediaItem, rankItem],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'approve', pendingIds: ['p9'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [childDeleteItem],
      })
    )
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'root' })
    expect(remaining).toBe(true)
  })

  it('approves all items with the delete approved last', async () => {
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }

    const getConcept = vi.fn()
    const setConcept = vi.fn(async () => {})
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: { 'pending-concept': { name: 'pending-concept', parent: 'root' } },
      removed: ['pending-concept'],
      pendingHistory: [],
      updated: ['pending-concept', 'root'],
    }))

    const { wrapper } = buildWrapper({
      closestConcept: vi.fn(() => ({ name: 'CDF' })),
      conceptEditsRefresh: vi.fn(),
      getConcept,
      pendingHistory: [mediaItem, rankItem, childDeleteItem],
      pendingItems: [mediaItem, rankItem],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', pendingIds: ['p9', 'p1', 'p2'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [mediaItem, rankItem, childDeleteItem],
      })
    )
    expect(setConcept).not.toHaveBeenCalled()
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'CDF' })
  })

  it('rejects all items with the delete rejected last', async () => {
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }
    const childDeleteItem = {
      id: 'p9',
      concept: 'root',
      field: 'Concept.child',
      action: 'Delete',
      oldValue: 'pending-concept',
    }

    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      removed: [],
      pendingHistory: [],
      updated: ['pending-concept', 'root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(),
      pendingHistory: [mediaItem, rankItem, childDeleteItem],
      pendingItems: [mediaItem, rankItem],
      parentPendingItems: [childDeleteItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'reject', pendingIds: ['p9', 'p1', 'p2'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'reject',
        items: [rankItem, mediaItem, childDeleteItem],
      })
    )
  })

  it('approves all items with the concept add approved first', async () => {
    const addItem = { id: 'p0', concept: 'root', field: 'Concept.child', action: 'Add', newValue: 'pending-concept' }
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }

    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      pendingHistory: [],
      removed: [],
      updated: ['root', 'pending-concept'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(() => ({ name: 'pending-concept', parent: 'root' })),
      pendingHistory: [addItem, mediaItem, rankItem],
      pendingItems: [mediaItem, rankItem, addItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'approve', pendingIds: ['p1', 'p2', 'p0'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [addItem, mediaItem, rankItem],
      })
    )
  })

  it('rejects all items with the concept add rejected last', async () => {
    const addItem = { id: 'p0', concept: 'root', field: 'Concept.child', action: 'Add', newValue: 'pending-concept' }
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }

    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      pendingHistory: [],
      removed: ['pending-concept'],
      updated: ['root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(() => null),
      pendingHistory: [addItem, mediaItem, rankItem],
      pendingItems: [mediaItem, rankItem, addItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'reject', pendingIds: ['p0', 'p1', 'p2'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'reject',
        items: [rankItem, mediaItem, addItem],
      })
    )
  })

  it('rejects all items in reverse creation order so dependent changes are undone first', async () => {
    const renameItem = {
      id: 'p1',
      concept: 'dingo-2',
      field: 'ConceptName',
      action: 'Edit',
      oldValue: 'dingo',
      newValue: 'dingo-2',
    }
    const aliasAddItem = { id: 'p2', concept: 'dingo-2', field: 'ConceptName', action: 'Add', newValue: 'dingo' }

    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      pendingHistory: [],
      removed: [],
      updated: ['dingo-2'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(() => ({ name: 'dingo-2', parent: 'root' })),
      pendingItems: [renameItem, aliasAddItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected: vi.fn(),
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    await act(async () => {
      await result.current({ approval: 'reject', pendingIds: ['p1', 'p2'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'reject',
        items: [aliasAddItem, renameItem],
      })
    )
  })

  it('applies the concept under its displayed name when a rename reject restores the old name', async () => {
    const renameItem = {
      id: 'p1',
      concept: 'pending-concept',
      field: 'ConceptName',
      action: 'Edit',
      oldValue: 'old-name',
      newValue: 'pending-concept',
    }
    const restoredConcept = { name: 'old-name', parent: 'root' }

    const setConcept = vi.fn(async () => {})
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async ({ deps }) => {
      deps.updateSelected({ concept: 'old-name' })
      return {
        concepts: { 'pending-concept': restoredConcept },
        pendingHistory: [],
        removed: [],
        updated: ['old-name'],
      }
    })

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(),
      pendingItems: [renameItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'reject', pendingIds: ['p1'] })
    })

    expect(setConcept).toHaveBeenCalledWith(restoredConcept, [])
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'old-name' })
    expect(updateSelected).not.toHaveBeenCalledWith({ concept: 'root' })
    expect(remaining).toBe(false)
  })

  it('rejects a pending add without acting on the concept\'s other pending items', async () => {
    const addItem = { id: 'p0', concept: 'root', field: 'Concept.child', action: 'Add', newValue: 'pending-concept' }
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }
    const rankItem = { id: 'p2', concept: 'pending-concept', field: 'Rank', action: 'Edit' }

    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      pendingHistory: [],
      removed: ['pending-concept'],
      updated: ['root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(() => null),
      pendingHistory: [addItem, mediaItem, rankItem],
      pendingItems: [mediaItem, rankItem, addItem],
      refreshData: vi.fn(),
      setConcept: vi.fn(async () => {}),
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'reject', pendingIds: ['p0'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'reject',
        items: [addItem],
      })
    )
    expect(updateSelected).toHaveBeenCalledWith({ concept: 'root' })
    expect(remaining).toBe(true)
  })

  it('approves a pending add with no side effects on other pending items', async () => {
    const addItem = { id: 'p0', concept: 'root', field: 'Concept.child', action: 'Add', newValue: 'pending-concept' }
    const mediaItem = { id: 'p1', concept: 'pending-concept', field: 'Media', action: 'Edit' }

    const setConcept = vi.fn(async () => {})
    const updateSelected = vi.fn()
    const withProcessing = vi.fn(async work => work())

    processPendingApprovalMock.mockImplementation(async () => ({
      concepts: {},
      pendingHistory: [],
      removed: [],
      updated: ['root'],
    }))

    const { wrapper } = buildWrapper({
      conceptEditsRefresh: vi.fn(),
      getConcept: vi.fn(() => ({ name: 'pending-concept', parent: 'root' })),
      pendingHistory: [addItem, mediaItem],
      pendingItems: [mediaItem, addItem],
      refreshData: vi.fn(),
      setConcept,
      updateSelected,
      withProcessing,
    })

    const { result } = renderHook(() => useConceptUpdatePending(), { wrapper })

    let remaining
    await act(async () => {
      remaining = await result.current({ approval: 'approve', pendingIds: ['p0'] })
    })

    expect(processPendingApprovalMock).toHaveBeenCalledTimes(1)
    expect(processPendingApprovalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        approval: 'approve',
        items: [addItem],
      })
    )
    expect(setConcept).not.toHaveBeenCalled()
    expect(updateSelected).not.toHaveBeenCalled()
    expect(remaining).toBe(true)
  })
})
